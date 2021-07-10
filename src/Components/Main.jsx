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

  let history = useHistory();

  if (auth.currentUser === null) {
    return <Redirect to='/' />;
  }

  const createPeopleElement = (doc) => {
    const peoples = document.getElementById('peoples')
    let peopleDiv = document.createElement('div');
    peopleDiv.classList.add('people')
    peopleDiv.innerHTML = doc.id;
    peoples.appendChild(peopleDiv);
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
                    if(doc.id!==auth.currentUser.email){
                    if (doc.id.includes(e.target.value)) {
                      createPeopleElement(doc);
                    }}
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
              const meets = document.getElementById("meets");
              const meet = document.createElement("div")
              const peoples = document.getElementById("peoples")
              meet.classList.add("meet");
              meet.id = "meet";

              meet.innerHTML = `<img src=${schedule} /><span>${thisUser}</span>`;

              meets.appendChild(meet)
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
                console.log(chatUser);
                const msgarea = document.getElementById("msgarea");
                const meetname = document.getElementById("meetname")
                meetname.innerHTML = `Meeting with ${chatUser.substring(0, chatUser.indexOf("@"))}`
                msgarea.innerHTML = "";
              }

              else {
                console.log(e.target)
              }
            }}
          >


            <div className="meet" id="meet">
              <img src={schedule} alt="" />
              <span>Meeting with Lorem Ipsum</span>
            </div>
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