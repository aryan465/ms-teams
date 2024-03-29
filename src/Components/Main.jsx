import { useState } from 'react';
import { Link, useHistory, Redirect } from 'react-router-dom';
import '../CSS/Main.css';
import titlelogo from '../Logo/video-call (1).png';
import chatlogo from '../Logo/chatlogo.png';
import schedule from '../Logo/schedule.png';
import send from '../Logo/send.png';
import vclogo from '../Logo/vclogo.png';
import logout from '../Logo/logout.png';
import { auth, firestore } from '../config/fbConfig';


function Main() {

  const [message, setMessage] = useState('');
  const [people, setPeople] = useState('');
  const [done, setDone] = useState(false);
  const [currentchatuser, SetCurrentchatuser] = useState('');
  const [chatlength, setChatlength] = useState(null);
  const [testuser, setTestuser] = useState("");


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



  firestore.collection("users").doc(auth.currentUser.email).onSnapshot(snapshot => {

    const me = auth.currentUser.email
    const minMe = me.substring(0, me.indexOf("@"))
    const minChatuser = currentchatuser.substring(0, currentchatuser.indexOf("@"));

    let changes = snapshot.data()

    try {

      if (minChatuser !== testuser || chatlength !== changes[minChatuser].length) {

        const msgarea = document.getElementById("msgarea");
        msgarea.innerHTML = "";

        changes[minChatuser].forEach(chatinfo => {

          if (chatinfo.user === minMe) {
            let mymsg = document.createElement("div")
            mymsg.classList.add("mymsg")

            let user = document.createElement("div")
            user.classList.add("user");
            user.innerHTML = "you"

            let msg = document.createElement("div")
            msg.classList.add("msg");
            msg.innerHTML = chatinfo.chat

            mymsg.appendChild(user)
            mymsg.appendChild(msg)

            msgarea.appendChild(mymsg)
            msgarea.scrollTop = msgarea.scrollHeight
          }

          else {
            let sendermsg = document.createElement("div")
            sendermsg.classList.add("sendermsg")

            let user = document.createElement("div")
            user.classList.add("user");
            user.innerHTML = chatinfo.user

            let msg = document.createElement("div")
            msg.classList.add("msg");
            msg.innerHTML = chatinfo.chat

            sendermsg.appendChild(user)
            sendermsg.appendChild(msg)

            msgarea.appendChild(sendermsg)
            msgarea.scrollTop = msgarea.scrollHeight


          }

        })
        setChatlength(changes[minChatuser].length);
        setTestuser(minChatuser);

      }


    }
    catch (err) {

    }

  })



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


              const thisUser = e.target.innerHTML;

              firestore.collection("users").doc(auth.currentUser.email).get()
                .then(snapshot => {
                  const chatusers = snapshot.data()["chatusers"]
                  const mycalls = snapshot.data()["mycalls"]
                  if (chatusers.includes(thisUser)) {
                    console.log("Already chatting!")
                  }

                  else {

                    createMeetUser(thisUser);

                    chatusers.push(thisUser);
                    mycalls[thisUser.substring(0, thisUser.indexOf('@'))] = "";

                    firestore.collection("users").doc(auth.currentUser.email).update({
                      chatusers: chatusers,
                      [thisUser.substring(0, thisUser.indexOf('@'))]: [],
                      mycalls: mycalls
                    })

                    firestore.collection("users").doc(thisUser).get().then(e => {
                      const clientchatusers = e.data()["chatusers"]
                      const clientcalls = e.data()["mycalls"]
                      clientchatusers.push((auth.currentUser.email));
                      clientcalls[auth.currentUser.email.substring(0, auth.currentUser.email.indexOf('@'))] = "";

                      firestore.collection("users").doc(thisUser).update({
                        chatusers: clientchatusers,
                        [auth.currentUser.email.substring(0, auth.currentUser.email.indexOf('@'))]: [],
                        mycalls: clientcalls
                      })
                    })

                  }

                })


              const peoples = document.getElementById("peoples")
              setPeople('')
              peoples.style.display = "none"
            }}
          >
            {/* div with class "people" */}

          </div>
        </div>


        <div className="avatar">{auth.currentUser.displayName.slice(0, 1)}</div>
        <button id="logout"
          onClick={(e) => {
            e.preventDefault();
            auth.signOut().then(() => {

              console.log('Signed Out')
              history.push('/');
            })
          }}
        >
          <img src={logout} alt="" />
        </button>

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

          </div>

          <div className="meets" id="meets"
            onClick={(e) => {

              if (e.target.id === "") {

                const chatUser = e.target.innerHTML
                SetCurrentchatuser(chatUser);

                const minChatuser = chatUser.substring(0, chatUser.indexOf("@"));
                const me = auth.currentUser.email
                const minMe = me.substring(0, me.indexOf("@"));
                const msgarea = document.getElementById("msgarea");
                const meetname = document.getElementById("meetname")
                meetname.innerHTML = `Meeting with ${minChatuser}`;
                msgarea.innerHTML = "";

                document.getElementById("vclogo").style.display = "block";

                firestore.collection("users").doc(auth.currentUser.email).get().then(snapshot => {
                  const currentchats = snapshot.data()[minChatuser]

                  currentchats.forEach(chatinfo => {
                    if (chatinfo.user === minMe) {
                      let mymsg = document.createElement("div")
                      mymsg.classList.add("mymsg")

                      let user = document.createElement("div")
                      user.classList.add("user");
                      user.innerHTML = "you"

                      let msg = document.createElement("div")
                      msg.classList.add("msg");
                      msg.innerHTML = chatinfo.chat

                      mymsg.appendChild(user)
                      mymsg.appendChild(msg)

                      msgarea.appendChild(mymsg)
                      msgarea.scrollTop = msgarea.scrollHeight

                    }

                    else {
                      let sendermsg = document.createElement("div")
                      sendermsg.classList.add("sendermsg")

                      let user = document.createElement("div")
                      user.classList.add("user");
                      user.innerHTML = chatinfo.user

                      let msg = document.createElement("div")
                      msg.classList.add("msg");
                      msg.innerHTML = chatinfo.chat

                      sendermsg.appendChild(user)
                      sendermsg.appendChild(msg)

                      msgarea.appendChild(sendermsg)
                      msgarea.scrollTop = msgarea.scrollHeight


                    }
                  })
                })

                firestore.collection("users").doc(auth.currentUser.email).update({
                  currentuser: e.target.innerHTML
                })
              }


            }}
          >

          </div>
        </div>


        <div className="right">

          <div className="rhead">
            <div className="meettitle">
              <img src={schedule} alt="" />
              <h3 className="meetname" id="meetname">Create Your Meetings</h3>
            </div>


            <div className="rheadlogos">
              <Link to='/chat/vc'><img id="vclogo" src={vclogo} alt=""

              /></Link>
            </div>
          </div>

          <div id="msgarea" className="msgarea">

            <div className="welcome">You are all set to go..<br />
              Open a chat stream to start chatting.</div>

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
              </div>

              <img id="send" className="send" src={send} alt=""
                onClick={() => {


                  setMessage('');

                  const me = auth.currentUser.email;
                  const minMe = me.substring(0, me.indexOf("@"))

                  const minChatuser = currentchatuser.substring(0, currentchatuser.indexOf("@"))

                  if (minChatuser !== "") {
                    if (message.trim() !== "") {


                      firestore.collection("users").doc(me).get().then(
                        snapshot => {
                          let mychat = snapshot.data()[minChatuser]
                          mychat.push({
                            user: minMe,
                            chat: message
                          })
                          firestore.collection("users").doc(me).update({
                            [minChatuser]: mychat
                          })


                          firestore.collection("users").doc(currentchatuser).get().then(e => {
                            let userchat = e.data()[minMe]
                            userchat.push({
                              user: minMe,
                              chat: message

                            })

                            firestore.collection("users").doc(currentchatuser).update({
                              [minMe]: userchat
                            })

                          })

                        })
                    }
                  }

                  else{
                    alert("Open a chat stream.")
                  }
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

