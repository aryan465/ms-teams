const firebase = require('firebase/app')

var firebaseConfig = {
    apiKey: "AIzaSyAu8ZZro3EcPJsWxZ23kx986EjRKA-mz3g",
    authDomain: "ms-teams-b465g.firebaseapp.com",
    projectId: "ms-teams-b465g",
    storageBucket: "ms-teams-b465g.appspot.com",
    messagingSenderId: "598889449118",
    appId: "1:598889449118:web:cc6c31e2e5cb47707e5d8f",
    measurementId: "G-3WBK0NVYEZ"
  };

firebase.initializeApp(firebaseConfig);

var database = firebase.firestore().ref();
var yourVideo = document.getElementById("yourVideo");
var friendsVideo = document.getElementById("friendsVideo");
var yourId = Math.floor(Math.random()*1000000000);
var servers = {'iceServers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {'urls': 'turn:numb.viagenie.ca','credential': 'webrtc','username': 'websitebeaver@mail.com'}]};
var pc = new RTCPeerConnection(servers);
pc.onicecandidate = (event => event.candidate?sendMessage(yourId, JSON.stringify({'ice': event.candidate})):console.log("Sent All Ice") );
pc.onaddstream = (event => friendsVideo.srcObject = event.stream);

function sendMessage(senderId, data) {
 var msg = database.push({ sender: senderId, message: data });
 msg.remove();
}

function readMessage(data) {
 var msg = JSON.parse(data.val().message);
 var sender = data.val().sender;
 if (sender != yourId) {
 if (msg.ice != undefined)
 pc.addIceCandidate(new RTCIceCandidate(msg.ice));
 else if (msg.sdp.type == "offer")
 pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
 .then(() => pc.createAnswer())
 .then(answer => pc.setLocalDescription(answer))
 .then(() => sendMessage(yourId, JSON.stringify({'sdp': pc.localDescription})));
 else if (msg.sdp.type == "answer")
 pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
 }
};

database.on('child_added', readMessage);

function showMyFace() {
 navigator.mediaDevices.getUserMedia({audio:true, video:true})
 .then(stream => yourVideo.srcObject = stream)
 .then(stream => pc.addStream(stream));
}

function showFriendsFace() {
 pc.createOffer()
 .then(offer => pc.setLocalDescription(offer) )
 .then(() => sendMessage(yourId, JSON.stringify({'sdp': pc.localDescription})) );
}