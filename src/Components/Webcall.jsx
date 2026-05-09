import { useState, useEffect, useRef, useCallback } from 'react';
import '../CSS/web.css';
import { auth, firestore } from '../config/fbConfig';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  setDoc,
  onSnapshot,
  deleteField,
  arrayUnion,
} from 'firebase/firestore';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import video from '../Logo/video.png';
import microphone from '../Logo/mic.png';
import endCall from '../Logo/endcall.png';
import createCall from '../Logo/createcall.png';

// Google STUN servers + OpenRelay free TURN (relay fallback for symmetric NAT)

const SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    // TURN relay — used automatically when direct P2P (STUN) fails
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443?transport=tcp',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
  ],
  iceCandidatePoolSize: 10,
};

// Call status enum
const STATUS = {
  IDLE: 'idle',
  REQUESTING_MEDIA: 'requesting_media',
  CONNECTING: 'connecting',
  RINGING: 'ringing',
  CONNECTED: 'connected',
  RECONNECTING: 'reconnecting',
  ENDED: 'ended',
  ERROR: 'error',
};

const STATUS_LABELS = {
  [STATUS.IDLE]: 'Ready to call',
  [STATUS.REQUESTING_MEDIA]: 'Starting camera & mic…',
  [STATUS.CONNECTING]: 'Connecting…',
  [STATUS.RINGING]: 'Ringing…',
  [STATUS.CONNECTED]: 'Connected',
  [STATUS.RECONNECTING]: 'Reconnecting…',
  [STATUS.ENDED]: 'Call ended',
  [STATUS.ERROR]: 'Connection failed',
};

// How long to wait for ICE to reach 'connected' before giving up (ms)
const ICE_CONNECT_TIMEOUT_MS = 20_000;
// Max automatic ICE restarts before surfacing a hard error
const ICE_RESTART_MAX = 3;
// Target max video bitrate in kbps (≈ 500 kbps is plenty for 720p 1:1)
const VIDEO_MAX_KBPS = 500;

function Webcall() {
  const [myStream, setMyStream] = useState(null);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [callStarted, setCallStarted] = useState(false);
  const [callStatus, setCallStatus] = useState(STATUS.IDLE);
  const [callPartner, setCallPartner] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [remoteActive, setRemoteActive] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const webcamRef = useRef(null);
  const remoteRef = useRef(null);
  const pcRef = useRef(null);
  // Track Firestore unsubscribers so we can clean them up
  const unsubCallRef = useRef(null);
  const unsubAnswerRef = useRef(null);
  const unsubOfferRef = useRef(null);
  const myStreamRef = useRef(null);
  const callDocIdRef = useRef(null); // track active call doc for hangup signaling
  const isCallerRef = useRef(false);    // true = we created the offer
  const callConnectedRef = useRef(false); // true = call reached connected state
  const iceRestartCountRef = useRef(0);   // number of automatic ICE restarts attempted
  const connectTimeoutRef = useRef(null); // setTimeout handle for connection timeout
  // Ref to handleStartCall so the autoStart effect can call it after first render
  const handleStartCallRef = useRef(null);

  const currentUser = auth.currentUser;

  // ── Helpers ──────────────────────────────────────────────
  const minOf = (email) => email.substring(0, email.indexOf('@'));

  const cleanupPC = useCallback(() => {
    // Clear any pending connection timeout
    if (connectTimeoutRef.current) {
      clearTimeout(connectTimeoutRef.current);
      connectTimeoutRef.current = null;
    }
    if (unsubCallRef.current)   { unsubCallRef.current();   unsubCallRef.current = null; }
    if (unsubAnswerRef.current) { unsubAnswerRef.current(); unsubAnswerRef.current = null; }
    if (unsubOfferRef.current)  { unsubOfferRef.current();  unsubOfferRef.current = null; }
    if (pcRef.current) {
      pcRef.current.ontrack = null;
      pcRef.current.onicecandidate = null;
      pcRef.current.onconnectionstatechange = null;
      pcRef.current.oniceconnectionstatechange = null;
      pcRef.current.close();
      pcRef.current = null;
    }
  }, []);

  const stopMedia = useCallback((stream) => {
    if (stream) stream.getTracks().forEach((t) => t.stop());
  }, []);

  // ── Load partner name from Firestore ──────────────────────
  useEffect(() => {
    if (!currentUser) return;
    const userRef = doc(firestore, 'users', currentUser.email);
    const unsub = onSnapshot(userRef, (snap) => {
      if (!snap.exists()) return;
      const cu = snap.data().currentuser || '';
      setCallPartner(cu ? minOf(cu) : '');
    });
    return () => unsub();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Cleanup on unmount ────────────────────────────────────
  useEffect(() => {
    return () => {
      cleanupPC();
      // stop tracks via ref so closure has latest value
    };
  }, [cleanupPC]);

  // ── Auto-start when navigated here with { state: { autoStart: true } } ───
  useEffect(() => {
    if (!location.state?.autoStart) return;
    handleStartCallRef.current?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentUser) return <Navigate to="/chat" replace />;

  // ── Create or reuse RTCPeerConnection ────────────────────
  const getPC = () => {
    if (pcRef.current) return pcRef.current;
    const pc = new RTCPeerConnection(SERVERS);

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      if (state === 'connected') {
        // Clear timeout — we made it
        if (connectTimeoutRef.current) {
          clearTimeout(connectTimeoutRef.current);
          connectTimeoutRef.current = null;
        }
        iceRestartCountRef.current = 0;
        setCallStatus(STATUS.CONNECTED);
        setRemoteActive(true);
        callConnectedRef.current = true;
        // Apply bitrate cap once the connection is up
        applyBitrateCap(pc);
      }
      if (state === 'disconnected')  { setCallStatus(STATUS.RECONNECTING); }
      if (state === 'failed')        { setCallStatus(STATUS.ERROR); setErrorMsg('Peer connection failed. Try again.'); }
      if (state === 'closed')        { setCallStatus(STATUS.ENDED); }
    };

    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'failed') {
        if (iceRestartCountRef.current >= ICE_RESTART_MAX) {
          // Exhausted retries — surface a clear error
          setCallStatus(STATUS.ERROR);
          setErrorMsg(`Connection failed after ${ICE_RESTART_MAX} attempts. Check your network and try again.`);
          return;
        }
        iceRestartCountRef.current += 1;
        setCallStatus(STATUS.RECONNECTING);
        setErrorMsg(`Reconnecting… (attempt ${iceRestartCountRef.current}/${ICE_RESTART_MAX})`);
        pc.restartIce();
      }
      // Clear transient error message once ICE recovers
      if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
        setErrorMsg('');
      }
    };

    pcRef.current = pc;
    return pc;
  };

  // ── Start local media ────────────────────────────────────
  const startWebcam = async () => {
    setCallStatus(STATUS.REQUESTING_MEDIA);
    const pc = getPC();
    let localStream;
    try {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
    } catch (err) {
      // Fallback: audio only if video denied
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        });
        setCameraOn(false);
      } catch (audioErr) {
        throw new Error('Camera/microphone access was denied. Please allow access and try again.');
      }
    }

    const remoteStream = new MediaStream();

    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => remoteStream.addTrack(track));
      setRemoteActive(true);
    };

    if (webcamRef.current) webcamRef.current.srcObject = localStream;
    if (remoteRef.current) remoteRef.current.srcObject = remoteStream;
    setMyStream(localStream);
    myStreamRef.current = localStream;
    setCallStatus(STATUS.CONNECTING);

    // ── Connection timeout ────────────────────────────────
    // If ICE hasn't reached 'connected' within the timeout, abort gracefully.
    if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
    connectTimeoutRef.current = setTimeout(() => {
      const state = pcRef.current?.connectionState;
      if (state && state !== 'connected' && state !== 'closed') {
        setCallStatus(STATUS.ERROR);
        setErrorMsg('Connection timed out. Check your network or try again.');
        setCallStarted(false);
        stopMedia(myStreamRef.current);
        myStreamRef.current = null;
        cleanupPC();
      }
    }, ICE_CONNECT_TIMEOUT_MS);

    return localStream;
  };

  // ── Bitrate cap + adaptive quality ───────────────────────
  // Caps the video sender to VIDEO_MAX_KBPS. Called once after connection.
  // The browser's bandwidth estimation (REMB/TWCC) still adapts within that ceiling.
  const applyBitrateCap = async (pc) => {
    try {
      const senders = pc.getSenders();
      for (const sender of senders) {
        if (sender.track?.kind !== 'video') continue;
        const params = sender.getParameters();
        if (!params.encodings || params.encodings.length === 0) {
          params.encodings = [{}];
        }
        params.encodings[0].maxBitrate = VIDEO_MAX_KBPS * 1000;
        // Degrade resolution before dropping framerate when bandwidth is low
        params.encodings[0].degradationPreference = 'maintain-framerate';
        await sender.setParameters(params);
      }
    } catch (_) {
      // setParameters is best-effort — some browsers/versions don't support it
    }
  };

  // ── Caller side ──────────────────────────────────────────
  const createCallOffer = async (me, minMe, client, minClient) => {
    const pc = getPC();
    const callDocRef = doc(collection(firestore, 'calls'));
    callDocIdRef.current = callDocRef.id;
    isCallerRef.current = true;
    const offerCandidates = collection(callDocRef, 'offerCandidates');
    const answerCandidates = collection(callDocRef, 'answerCandidates');

    // Write callId to both users
    const [mySnap, theirSnap] = await Promise.all([
      getDoc(doc(firestore, 'users', me)),
      getDoc(doc(firestore, 'users', client)),
    ]);

    await Promise.all([
      updateDoc(doc(firestore, 'users', me), {
        mycalls: { ...mySnap.data().mycalls, [minClient]: callDocRef.id },
      }),
      updateDoc(doc(firestore, 'users', client), {
        mycalls: { ...theirSnap.data().mycalls, [minMe]: callDocRef.id },
      }),
    ]);

    pc.onicecandidate = (event) => {
      if (event.candidate) addDoc(offerCandidates, event.candidate.toJSON());
    };

    const offerDesc = await pc.createOffer();
    await pc.setLocalDescription(offerDesc);
    await setDoc(callDocRef, { offer: { sdp: offerDesc.sdp, type: offerDesc.type } });

    // Notify callee of incoming call
    await updateDoc(doc(firestore, 'users', client), {
      incomingCall: {
        from: me,
        callerName: currentUser.displayName || minMe,
        callId: callDocRef.id,
      },
    });

    // Listen for answer, decline, or remote hangup
    unsubCallRef.current = onSnapshot(callDocRef, (snap) => {
      const data = snap.data();
      if (!pc.currentRemoteDescription && data?.answer) {
        pc.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
      if (data?.callDeclined) {
        // Log as missed for the caller
        updateDoc(doc(firestore, 'users', me), {
          callLogs: arrayUnion({ with: client, withName: minClient, type: 'missed', ts: Date.now() }),
        }).catch(() => {});
        stopMedia(myStreamRef.current);
        myStreamRef.current = null;
        cleanupPC();
        setCallStatus(STATUS.ENDED);
        setErrorMsg('Call was declined.');
        setCallStarted(false);
        setTimeout(() => navigate('/chat', { replace: true }), 2500);
      }
      if (data?.callEnded && pc.connectionState !== 'closed') {
        stopMedia(myStreamRef.current);
        myStreamRef.current = null;
        cleanupPC();
        setCallStatus(STATUS.ENDED);
        setErrorMsg('Call ended.');
        setCallStarted(false);
        setTimeout(() => navigate('/chat', { replace: true }), 2000);
      }
    });

    // Listen for answer candidates
    unsubAnswerRef.current = onSnapshot(answerCandidates, (snap) => {
      snap.docChanges().forEach((change) => {
        if (change.type === 'added') {
          pc.addIceCandidate(new RTCIceCandidate(change.doc.data())).catch(() => {});
        }
      });
    });
  };

  // ── Callee side ──────────────────────────────────────────
  const answerCall = async (answerId) => {
    const pc = getPC();
    const callDocRef = doc(firestore, 'calls', answerId);
    callDocIdRef.current = answerId;
    isCallerRef.current = false;
    const answerCandidates = collection(callDocRef, 'answerCandidates');
    const offerCandidates = collection(callDocRef, 'offerCandidates');

    pc.onicecandidate = (event) => {
      if (event.candidate) addDoc(answerCandidates, event.candidate.toJSON());
    };

    const callData = (await getDoc(callDocRef)).data();
    if (!callData?.offer) throw new Error('Call not found or already ended.');

    await pc.setRemoteDescription(new RTCSessionDescription(callData.offer));
    const answerDesc = await pc.createAnswer();
    await pc.setLocalDescription(answerDesc);
    await updateDoc(callDocRef, { answer: { type: answerDesc.type, sdp: answerDesc.sdp } });

    // Listen for offer candidates
    unsubOfferRef.current = onSnapshot(offerCandidates, (snap) => {
      snap.docChanges().forEach((change) => {
        if (change.type === 'added') {
          pc.addIceCandidate(new RTCIceCandidate(change.doc.data())).catch(() => {});
        }
      });
    });

    // Listen for caller hangup signal
    unsubCallRef.current = onSnapshot(callDocRef, (snap) => {
      const data = snap.data();
      if (data?.callEnded && pc.connectionState !== 'closed') {
        stopMedia(myStreamRef.current);
        myStreamRef.current = null;
        cleanupPC();
        setCallStatus(STATUS.ENDED);
        setErrorMsg('Call ended by the other person.');
        setCallStarted(false);
        setTimeout(() => navigate('/chat', { replace: true }), 2000);
      }
    });
  };

  // ── Main "Start call" handler ────────────────────────────
  const handleStartCall = async () => {
    if (callStarted) return;
    setCallStarted(true);
    setErrorMsg('');

    try {
      const me = currentUser.email;
      const minMe = minOf(me);

      const userSnap = await getDoc(doc(firestore, 'users', me));
      const data = userSnap.data();
      const currentuser = data?.currentuser || '';

      if (!currentuser) {
        throw new Error('No chat partner selected. Go back to chat and open a conversation first.');
      }

      const minCurrentuser = minOf(currentuser);
      const existingCallId = data.mycalls?.[minCurrentuser] || '';

      await startWebcam();

      if (!existingCallId) {
        await createCallOffer(me, minMe, currentuser, minCurrentuser);
        setCallStatus(STATUS.RINGING);
      } else {
        await answerCall(existingCallId);
      }
    } catch (err) {
      setCallStatus(STATUS.ERROR);
      setErrorMsg(err.message || 'Something went wrong starting the call.');
      setCallStarted(false);
      cleanupPC();
    }
  };

  // Sync ref with latest closure so the autoStart effect can call it
  handleStartCallRef.current = handleStartCall;

  // ── Hang up ──────────────────────────────────────────────
  const handleHangUp = async () => {
    const stream = myStreamRef.current || myStream;
    stopMedia(stream);
    myStreamRef.current = null;
    cleanupPC();
    setCallStatus(STATUS.ENDED);

    try {
      const me = currentUser.email;
      const minMe = minOf(me);

      // Signal the other side via Firestore before we clean up
      if (callDocIdRef.current) {
        try {
          await updateDoc(doc(firestore, 'calls', callDocIdRef.current), { callEnded: true });
        } catch (_) {}
        callDocIdRef.current = null;
      }

      const userSnap = await getDoc(doc(firestore, 'users', me));
      const currentuser = userSnap.data()?.currentuser || '';
      const minCurrentuser = currentuser ? minOf(currentuser) : '';

      // Write call log based on whether the call actually connected
      if (currentuser) {
        const ts = Date.now();
        if (callConnectedRef.current) {
          // Both sides were connected — log outgoing/incoming for both parties
          const myType = isCallerRef.current ? 'outgoing' : 'incoming';
          const theirType = isCallerRef.current ? 'incoming' : 'outgoing';
          await Promise.all([
            updateDoc(doc(firestore, 'users', me), {
              callLogs: arrayUnion({ with: currentuser, withName: minCurrentuser, type: myType, ts }),
            }),
            updateDoc(doc(firestore, 'users', currentuser), {
              callLogs: arrayUnion({ with: me, withName: currentUser.displayName || minMe, type: theirType, ts }),
            }),
          ]).catch(() => {});
        } else if (isCallerRef.current) {
          // Caller hung up before callee answered — log as missed for callee
          updateDoc(doc(firestore, 'users', currentuser), {
            callLogs: arrayUnion({ with: me, withName: currentUser.displayName || minMe, type: 'missed', ts }),
          }).catch(() => {});
        }
        callConnectedRef.current = false;
        isCallerRef.current = false;
      }

      if (currentuser && minCurrentuser) {
        // Clear call ID so next call creates a fresh doc
        await updateDoc(doc(firestore, 'users', me), {
          mycalls: { ...userSnap.data().mycalls, [minCurrentuser]: '' },
        });
        const theirSnap = await getDoc(doc(firestore, 'users', currentuser));
        if (theirSnap.exists()) {
          const theirUpdates = {
            mycalls: { ...theirSnap.data().mycalls, [minMe]: '' },
          };
          // Clear pending incoming call notification if we cancelled before they answered
          if (theirSnap.data().incomingCall?.from === me) {
            theirUpdates.incomingCall = deleteField();
          }
          await updateDoc(doc(firestore, 'users', currentuser), theirUpdates);
        }
      }
    } catch (err) {
      console.warn('Hangup cleanup error:', err.message);
    } finally {
      navigate('/chat', { replace: true });
    }
  };

  // ── Media controls ───────────────────────────────────────
  const toggleMic = () => {
    if (!myStream) return;
    const enabled = !micOn;
    myStream.getAudioTracks().forEach((t) => (t.enabled = enabled));
    setMicOn(enabled);
  };

  const toggleCamera = () => {
    if (!myStream) return;
    const enabled = !cameraOn;
    myStream.getVideoTracks().forEach((t) => (t.enabled = enabled));
    setCameraOn(enabled);
  };

  const isConnected = callStatus === STATUS.CONNECTED;
  const isRinging = callStatus === STATUS.RINGING;
  const isConnecting = callStatus === STATUS.CONNECTING || callStatus === STATUS.REQUESTING_MEDIA;

  return (
    <div className="vc">
      {/* Status bar */}
      <div className={`vc-status-bar vc-status--${callStatus}`}>
        <span className={`vc-status-dot ${isConnected ? 'vc-status-dot--on' : ''} ${callStatus === STATUS.ERROR ? 'vc-status-dot--error' : ''}`} />
        {callPartner ? (
          <span>
            {isConnected ? `In call with ` : STATUS_LABELS[callStatus]}
            {isConnected && <strong>{callPartner}</strong>}
          </span>
        ) : (
          <span>{STATUS_LABELS[callStatus]}</span>
        )}
      </div>

      {/* Error message */}
      {errorMsg && (
        <div className="vc-error-banner">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Videos */}
      <div className="vc-videos">
        <div className="vc-video-wrap">
          <video ref={webcamRef} autoPlay playsInline muted className="vc-video vc-local" />
          <span className="vc-video-label">You {!cameraOn && '(Camera off)'}</span>
          {!myStream && (
            <div className="vc-video-offline">
              <span>📷</span>
              <p>Camera not started</p>
            </div>
          )}
        </div>
        <div className="vc-video-wrap">
          <video ref={remoteRef} autoPlay playsInline className="vc-video vc-remote" />
          <span className="vc-video-label">{callPartner || 'Remote'}</span>
          {!remoteActive && (
            <div className="vc-video-offline">
              {isRinging ? (
                <>
                  <div className="vc-spinner vc-spinner--ring" />
                  <p>Ringing {callPartner}…</p>
                </>
              ) : isConnecting ? (
                <>
                  <div className="vc-spinner" />
                  <p>Waiting for {callPartner || 'peer'}…</p>
                </>
              ) : (
                <>
                  <span>👤</span>
                  <p>{callPartner ? `${callPartner} not connected` : 'No remote video'}</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="vc-controls">
        <Tooltip title={callStarted ? 'Call in progress' : (callPartner ? `Call ${callPartner}` : 'Start call')}>
          <span>
            <button
              className={`vc-btn vc-btn--call ${callStarted ? 'vc-btn--disabled' : ''}`}
              onClick={handleStartCall}
              disabled={callStarted}
            >
              <img src={createCall} alt="Start call" />
            </button>
          </span>
        </Tooltip>

        <div className="vc-controls-sep" />

        <Tooltip title={cameraOn ? 'Turn off camera' : 'Turn on camera'}>
          <button
            className={`vc-btn vc-btn--media ${!cameraOn ? 'vc-btn--off' : ''} ${!myStream ? 'vc-btn--disabled' : ''}`}
            onClick={toggleCamera}
            disabled={!myStream}
          >
            <img src={video} alt="Camera" />
          </button>
        </Tooltip>

        <Tooltip title={micOn ? 'Mute' : 'Unmute'}>
          <button
            className={`vc-btn vc-btn--media ${!micOn ? 'vc-btn--off' : ''} ${!myStream ? 'vc-btn--disabled' : ''}`}
            onClick={toggleMic}
            disabled={!myStream}
          >
            <img src={microphone} alt="Microphone" />
          </button>
        </Tooltip>

        <div className="vc-controls-sep" />

        <Tooltip title="End call & return to chat">
          <button className="vc-btn vc-btn--hangup" onClick={handleHangUp}>
            <img src={endCall} alt="End call" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}

export default Webcall;
