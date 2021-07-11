import '../CSS/web.css';
import { firestore } from '../config/fbConfig';
import { useRef} from 'react';
import {video} from '../Logo/video.png';
import {mic} from '../Logo/mic.png';
import {endCall} from '../Logo/endcall.png';

function Webcall() {


  const webcamButton = useRef(null);
  const webcamVideo = useRef(null);
  const callButton = useRef(null);
  const callInput = useRef(null);
  const answerButton = useRef(null);
  const remoteVideo = useRef(null);
  const hangupButton = useRef(null);

  var localStream
  var remoteStream
  
  // var webcambtn;
  // var webcamvdo;
  // var callbtn;
  // var callinpt;
  // var answerbtn;
  // var remotevdo;
  // var hangupbtn;


  //   useEffect(()=>{
  //     webcambtn = webcamButton.current
  //     webcamvdo = webcamVideo.current
  //     callbtn = callButton.current
  //     callinpt = callInput.current
  //     answerbtn = answerButton.current
  //     remotevdo = remoteVideo.current
  //     hangupbtn = hangupButton.current

  //   },[webcamButton,webcamVideo,callButton,callInput,answerButton,remoteVideo,hangupButton])

  // console.log(webcambtn)

  const servers = {
    iceServers: [
      {
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  const pc = new RTCPeerConnection(servers);

  async function webCam() {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    remoteStream = new MediaStream();

    // Push tracks from local stream to peer connection
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      })
    };
    webcamVideo.current.srcObject = localStream;
    remoteVideo.current.srcObject = remoteStream;

    callButton.current.disabled = false;
    answerButton.current.disabled = false;
    webcamButton.current.disabled = true;
  };

  async function callButtonClick() {

    const callDoc = firestore.collection('calls').doc();
    const offerCandidates = callDoc.collection('offerCandidates');
    const answerCandidates = callDoc.collection('answerCandidates');


    callInput.current.value = callDoc.id;

    pc.onicecandidate = (event) => {
      event.candidate && offerCandidates.add(event.candidate.toJSON());
    };
    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await callDoc.set({ offer });

    // Listen for remote answer
    callDoc.onSnapshot((snapshot) => {
      const data = snapshot.data();
      if (!pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.setRemoteDescription(answerDescription);
      }
    });

    // When answered, add candidate to peer connection
    answerCandidates.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate);
        }
      });
    });

    hangupButton.current.disabled = false;
  };

  async function answerButtonClick(){

    const callId = callInput.current.value;
    const callDoc = firestore.collection('calls').doc(callId);
    const answerCandidates = callDoc.collection('answerCandidates');
    const offerCandidates = callDoc.collection('offerCandidates');

    pc.onicecandidate = (event) => {
      event.candidate && answerCandidates.add(event.candidate.toJSON());
    };
    const callData = (await callDoc.get()).data();

  const offerDescription = callData.offer;
  await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

  const answerDescription = await pc.createAnswer();
  await pc.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
  };
  await callDoc.update({ answer });

  offerCandidates.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      console.log(change);
      if (change.type === 'added') {
        let data = change.doc.data();
        pc.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });
  };

  return (
    <div className = "vc" id = "vc">
      {/* <h2>1. Start your Webcam</h2> */}
      <div className="videos">
        <span>
          {/* <h3>Local Stream</h3> */}
          <video id="webcamVideo" ref={webcamVideo} autoPlay playsInline></video>
        </span>
        <span>
          {/* <h3>Remote Stream</h3> */}
          <video id="remoteVideo" ref={remoteVideo} autoPlay playsInline></video>
        </span>
      </div>


      <button id="webcamButton" ref={webcamButton}
        onClick={() => {
          webCam();
        }}
      >Start webcam</button>

      <h2>{/*2. Create a new Call*/}</h2>

      <button id="callButton" ref={callButton}
        onClick={() => {
          console.log('click');
          callButtonClick();
        }}
      >Create Call (offer)</button>

      {/* <h2>3. Join a Call</h2> */}
      {/* <p>Answer the call from a different browser window or device</p> */}
      <p>
        Type the offer id to answer the call.
      </p>

      <input id="callInput" ref={callInput} />
      <button id="answerButton" ref={answerButton} 
      onClick = {()=>{
        answerButtonClick()
        console.log(32154)
      }}
      >Answer</button>

      {/* <h2>4. Hangup</h2> */}

      <button id="hangupButton" ref={hangupButton} disabled>Hangup</button>
    </div>
  );
}

export default Webcall;