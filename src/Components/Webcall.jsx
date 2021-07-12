import '../CSS/web.css';
import { auth, firestore } from '../config/fbConfig';
import { useRef } from 'react';
import video from '../Logo/video.png';
import mic from '../Logo/mic.png';
import endCall from '../Logo/endcall.png';
import createCall from '../Logo/createcall.png';
import { useState } from 'react';

function Webcall() {


  const[callId,setCallId] = useState("")


  const webcamVideo = useRef(null);
  const callButton = useRef(null);
  const remoteVideo = useRef(null);
  const hangupButton = useRef(null);

  var localStream
  var remoteStream



      firestore.collection("users").doc(auth.currentUser.email).onSnapshot(
      snapshot=>{
        
        const client = snapshot.data()["currentuser"]
        const minClient = client.substring(0,client.indexOf("@"))
        setCallId(snapshot.data()["mycalls"][minClient])
      })



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

  };

  async function callButtonClick(me, minMe, client, minClient) {

    const callDoc = firestore.collection('calls').doc();
    const offerCandidates = callDoc.collection('offerCandidates');
    const answerCandidates = callDoc.collection('answerCandidates');


    firestore.collection("users").doc(me).get().
      then(e => {

        let mycalls = e.data()["mycalls"]
        mycalls[minClient] = callDoc.id

        firestore.collection("users").doc(me).update({
          mycalls: mycalls

        })
        firestore.collection("users").doc(client).get().
          then(snap => {

            let clientcalls = snap.data()["mycalls"]
            clientcalls[minMe] = callDoc.id

            firestore.collection("users").doc(client).update({
              mycalls: clientcalls
            })
          })
      })

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

  async function answerButtonClick(me,minClient) {


      
      console.log(callId)
      const callDoc = firestore.collection('calls').doc(callId);
      const answerCandidates = callDoc.collection('answerCandidates');
      const offerCandidates = callDoc.collection('offerCandidates');
  
      pc.onicecandidate = (event) => {
        event.candidate && answerCandidates.add(event.candidate.toJSON());
      };
      const callData = (await callDoc.get()).data();
      console.log(callData)
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
    <div className="vc" id="vc">
      <div className="videos">
        <span>

          <video id="webcamVideo" ref={webcamVideo} autoPlay playsInline></video>
        </span>
        <span>
          <video id="remoteVideo" ref={remoteVideo} autoPlay playsInline></video>
        </span>
      </div>


      <button id="callButton" ref={callButton}
        onClick={() => {
          console.log('click');

          const me = auth.currentUser.email;
          const minMe = me.substring(0, me.indexOf("@"));

          firestore.collection("users").doc(me).get().
            then(snapshot => {
              const currentuser = snapshot.data()["currentuser"]
              const minCurrentuser = currentuser.substring(0, currentuser.indexOf("@"));

              var usercallId = snapshot.data()["mycalls"][minCurrentuser];

              if (usercallId === "") {
                console.log(1)
                webCam().then(()=>{
                callButtonClick(me, minMe, currentuser, minCurrentuser);    
                })
              }

              else {
                console.log(2)
                webCam().then(()=>{
                  answerButtonClick(me,minCurrentuser);
                })
              }

            })
        }}
      ><img src={createCall} alt="" /></button>


      <button id="hangupButton" ref={hangupButton}
        onClick={() => {
          const me = auth.currentUser.email;
          const minMe = me.substring(0, me.indexOf("@"));

          firestore.collection("users").doc(me).get().
            then(snapshot => {
              const currentuser = snapshot.data()["currentuser"]
              const minCurrentuser = currentuser.substring(0, currentuser.indexOf("@"));

              let mycalls = snapshot.data()["mycalls"]
              mycalls[minCurrentuser] = ""

              firestore.collection("users").doc(me).update({
                mycalls: mycalls
              })

              firestore.collection("users").doc(currentuser).get().
                then(snap => {

                  let clientcalls = snap.data()["mycalls"]
                  clientcalls[minMe] = ""

                  firestore.collection("users").doc(currentuser).update({
                    mycalls: clientcalls
                  })
                })

                console.log("empty")
            })
        }}
      >
        <img src={endCall} alt="" /></button>
    </div>
  );
}

export default Webcall;