import '../CSS/Test.css';
import firebase from 'firebase';
import { useState, useEffect } from 'react';



function Test() {
    
    // const [micval, setMicval] = useState(false);
    // const [camval, setCamval] = useState(false);

    var localVideo;

    useEffect(()=>{
        localVideo = document.getElementById('hostVideo');
        // console.log(localVideo);
        // console.log(1)
    }, []);
    
    // async function openMic(e) {
    //     const stream = await navigator.mediaDevices.getUserMedia(
    //         { audio: true }
    //     );
    // }

    // async function openCamera(e) {
    //     const stream = await navigator.mediaDevices.getUserMedia(
    //         { video: true, audio: true }
    //     );
    // }

    const mediaStreamConstraints = {
        video: true,
      };


      
    let localStream;

    const gotLocalMediaStream = (mediaStream) =>{
        localStream = mediaStream;
        localVideo.srcObject = mediaStream;
    }

    function handleLocalMediaStreamError(error) {
        console.log('navigator.getUserMedia error: ', error);
      }
      
      // Initializes media stream.
      navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
        .then(gotLocalMediaStream).catch(handleLocalMediaStreamError);
    
    const configuration = {
        iceServers: [
            {
                urls: [
                    'stun:stun1.l.google.com:19302',
                    'stun:stun2.l.google.com:19302',
                ],
            },
        ],
        iceCandidatePoolSize: 10,
    };

    // var pc = new RTCPeerConnection(configuration);


    return (
        <>
            <h4>
                Video Call Testing
            </h4>

            <button id="open_mic"
               
            >Open Mic</button>
            <button id="open_camera"
                
            >Open Camera</button>
            <div className="videocontainer">
                <video id = "hostVideo" autoPlay playsInline></video>
            </div>
        </>
    );
}

export default Test;