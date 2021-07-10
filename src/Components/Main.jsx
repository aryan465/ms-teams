import { useState } from 'react';
import { Link, useHistory, Redirect } from 'react-router-dom';
import '../CSS/Main.css';
import titlelogo from '../Logo/video-call (1).png';
import chatlogo from '../Logo/chatlogo.png';
import search from '../Logo/search.png';
import schedule from '../Logo/schedule.png';
import send from '../Logo/send.png';
import attach from '../Logo/attach.png';
import vclogo from '../Logo/vclogo.png';
import { auth, firestore } from '../config/fbConfig';



function Main() {

  const [message, setMessage] = useState('');
  const [people, setPeople] = useState('');
  const [done, setDone] = useState(false);
  const [currentchatuser, SetCurrentchatuser] = useState('');

  let history = useHistory();

  if (auth.currentUser === null) {
    return <Redirect to='/' />;
  }

  if (!done) {
    setTimeout(() => {
      firestore.collection("users").doc(auth.currentUser.email).get()
        .then(snapshot => {
          const chatusers = snapshot.data()["chatusers"]
          chatusers.forEach(chatuser => {
            createMeetUser(chatuser)
          })
        })
      setDone(true);
    })
  }


  const createPeopleElement = (docid) => {
    const peoples = document.getElementById('peoples')
    let peopleDiv = document.createElement('div');
    peopleDiv.classList.add('people')
    peopleDiv.innerHTML = docid;
    peoples.appendChild(peopleDiv);
  }

  const createMeetUser = (thisUser) => {
    const meets = document.getElementById("meets");
    const meet = document.createElement("div")
    meet.classList.add("meet");
    meet.id = "meet";

    meet.innerHTML = `<img src=${schedule} /><span>${thisUser}</span>`;
    meets.appendChild(meet)
  }


  return (
    <div id="main">
      <header className="main">


        <img src={titlelogo} alt="" />
        <div className="name">Microsoft Teams</div>

        <div className="peopleContainer">
          <input
            id='peopleSearch'
            type="search"
            placeholder="Search for people..."
            value={people}
            onChange={(e) => {

              const peoples = document.getElementById('peoples')
              setPeople(e.target.value)

              if (e.target.value.length < 2) {
                peoples.innerHTML = "";

              }

              else {
                peoples.innerHTML = "";
                firestore.collection('users').get().then((snapshot) => {
                  snapshot.docs.forEach(doc => {
                    if (doc.id !== auth.currentUser.email) {
                      if (doc.id.includes(e.target.value)) {
                        createPeopleElement(doc.id);

                      }
                    }
                  })
                })
              }

            }}

            onClick={() => {
              const peoples = document.getElementById('peoples');
              peoples.style.display = "flex";
            }}
          />

          <div id='peoples' className="peoples"
            onClick={(e) => {


              console.log(e.target.innerHTML)
              const thisUser = e.target.innerHTML;

              firestore.collection("users").doc(auth.currentUser.email).get()
                .then(snapshot => {
                  const chatusers = snapshot.data()["chatusers"]

                  if (chatusers.includes(thisUser)) {
                    console.log("Already chatting!")
                  }

                  else {

                    createMeetUser(thisUser);

                    chatusers.push(thisUser);
                    console.log(chatusers)
                    firestore.collection("users").doc(auth.currentUser.email).update({
                      chatusers: chatusers,
                      [thisUser.substring(0,thisUser.indexOf('@'))]: []
                    })

                    firestore.collection("users").doc(thisUser).get().then(e => {
                      const clientchatusers = e.data()["chatusers"]
                      clientchatusers.push((auth.currentUser.email));

                      firestore.collection("users").doc(thisUser).update({
                        chatusers: clientchatusers,
                        [auth.currentUser.email.substring(0,auth.currentUser.email.indexOf('@'))]: []
                      })
                    })

                  }

                })


              const peoples = document.getElementById("peoples")
              setPeople('')
              peoples.style.display = "none"
            }}
          >
            {/* div with class people */}

          </div>
        </div>


        <div className="avatar">{auth.currentUser.displayName.slice(0, 1)}</div>
        <button
          onClick={(e) => {
            e.preventDefault();
            auth.signOut().then(() => {

              console.log('user out')
              history.push('/');
            })
          }}
        >LogOut</button>

      </header>

      <div className="window">
        <div className="left">
          <div className="chatlogo">
            <img src={chatlogo} alt="" />
            <h6>Chat</h6>
          </div>
        </div>
        <div className="middle">
          <div className="mhead">
            <h3>Chat</h3>
            <div className="logos">
              <img src={search} alt=""
              />
            </div>
          </div>

          <div className="meets" id="meets"
            onClick={(e) => {

              if (e.target.id === "") {

                const chatUser = e.target.innerHTML
                SetCurrentchatuser(chatUser);
                const minChatuser = chatUser.substring(0,chatUser.indexOf("@"));

                const msgarea = document.getElementById("msgarea");
                const meetname = document.getElementById("meetname")
                meetname.innerHTML = `Meeting with ${minChatuser}`;
                msgarea.innerHTML = "";

                firestore.collection("users").doc(auth.currentUser.email).get().then(snapshot => {
                  const currentchats = snapshot.data()[minChatuser]
                  console.log(currentchats)
                })
              }

              else {
                console.log(e.target)
              }
            }}
          >

            {/* Syntax of the meet element in middle segment */}
            {/* <div className="meet" id="meet">
              <img src={schedule} alt="" />
              <span>Meeting with Lorem Ipsum</span>
            </div> */}

          </div>
        </div>


        <div className="right">

          <div className="rhead">
            <div className="meettitle">
              <img src={schedule} alt="" />
              <h3 className="meetname" id="meetname">Meeting with Lorem Ipsum</h3>
            </div>

            {/* <div className="files">
              <ul>
                <li>Chat</li>
                <li>Files</li>
              </ul>
            </div> */}

            <div className="rheadlogos">
              <Link to='/chat/vc'><img src={vclogo} alt=""

              /></Link>
            </div>
          </div>

          <div id="msgarea" className="msgarea">
            <div className="mymsg">
              Hi! How are you
            </div>
            <div className="sendermsg">
              hello!!
            </div>
            <div className="mymsg">
              Hi! How are you
            </div>
            <div className="sendermsg">
              hello!!
            </div>
            <div className="mymsg">
              Hi! How are you
            </div>
          </div>

          <div className="rfoot">

            <input className="msg" type="text" placeholder="Type a new message.."
              value={message} onChange={(e) => {
                setMessage(e.target.value)
              }}

              onKeyDown={(e) => {

                if (e.key === 'Enter') {
                  (document.getElementById("send")).click()
                }
              }}
            />

            <div className="ficons">
              <div className="attach">
                <img src={attach} alt="" />
              </div>

              <img id="send" className="send" src={send} alt=""
                onClick={() => {

                  var container = document.getElementById('msgarea');
                  var msg = document.createElement("div");
                  msg.classList.add('mymsg');
                  msg.innerHTML = message;
                  container.appendChild(msg);
                  container.scrollTop = container.scrollHeight;
                  setMessage('');

                }}
              />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;