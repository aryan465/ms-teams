import '../CSS/Test.css';
import firebase from 'firebase';
import { firestore } from '../config/fbConfig'
import { useState, useEffect } from 'react';



function Test() {

    // const [micval, setMicval] = useState(false);
    // const [camval, setCamval] = useState(false);


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

    var localVideo;
    var localStream;
    var remoteStream

    useEffect(() => {
        localVideo = document.getElementById('localVideo');
    }, []);

    const mediaStreamConstraints = {
        video: {
            width: {
                min: 1280
            },
            height: {
                min: 720
            }
        }
    }




    const gotLocalMediaStream = (mediaStream) => {
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

    const pc = new RTCPeerConnection(configuration);


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
                <video id="localVideo" autoPlay playsInline></video>
                <video id="remoteVideo" autoPlay playsInline></video>

            </div>
            <div>
                <button id="startButton">Start</button>
                <button id="callButton">Call</button>
                <button id="hangupButton">Hang Up</button>
            </div>

        </>
    );
}

export default Test;