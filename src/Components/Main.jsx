import {useState} from 'react';

import '../CSS/Main.css';
import titlelogo from '../Logo/video-call (1).png';
import chatlogo from '../Logo/chatlogo.png';
import search from '../Logo/search.png';
import schedule from '../Logo/schedule.png';
import send from '../Logo/send.png';
import attach from '../Logo/attach.png';

function Main() {

  const [message,setMessage] = useState('');

  return (
    <>
      <header>

        <img src={titlelogo} alt="" />
        <div className="name">Microsoft Teams</div>

        <input type="text" placeholder="Search" />
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
              <img src={search} alt="" />
            </div>
          </div>
        </div>


        <div className="right">

          <div className="rhead">
            <div className="meettitle">
              <img src={schedule} alt="" />
              <h3 className="meetname">Meeting with Lorem Ipsum</h3>
            </div>
            <div className="files">
              <ul>
                <li>Chat</li>
                <li>Files</li>
              </ul>
            </div>
          </div>

          <div id = "msgarea" className="msgarea">
            <div className="mymsg">
              Hi! How are you
            </div>
            <div className="mymsg">
              Hi! How are you
            </div>
            <div className="mymsg">
              Hi! How are you
            </div>
          </div>

          <div className="rfoot">

            <input className="msg" type="text" placeholder="Type a new message.." 
              value = {message} onChange={(e)=>{
                setMessage(e.target.value)
              }}

              onKeyDown = {(e)=>{

                if(e.key === 'Enter'){
                  (document.getElementById("send")).click()
                }
              }}
            />

            <div className="ficons">
              <div className="attach">
                <img src={attach} alt="" />
              </div>

              <img id="send" className="send" src={send} alt=""
                onClick={()=>{
                  
                  var container = document.getElementById('msgarea');
                  var msg = document.createElement("div");
                  msg.classList.add('mymsg');
                  msg.innerHTML=message;
                  container.appendChild(msg);
                  container.scrollTop = container.scrollHeight;
                  setMessage('');
                  
                }}
              />

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;