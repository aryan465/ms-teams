import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import '../CSS/Main.css';
import titlelogo from '../Logo/video-call (1).png';
import vclogo from '../Logo/vclogo.png';
import { auth, firestore } from '../config/fbConfig';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  deleteField,
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LogoutIcon from '@mui/icons-material/Logout';
import ChatIcon from '@mui/icons-material/Chat';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Main() {
  const [message, setMessage] = useState('');
  const [searchPeople, setSearchPeople] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [chatUsers, setChatUsers] = useState([]);
  const [currentChatUser, setCurrentChatUser] = useState('');
  const [messages, setMessages] = useState([]);
  const [sendingMsg, setSendingMsg] = useState(false);
  // mobile: 'list' | 'chat'
  const [mobileView, setMobileView] = useState('list');
  const [incomingCall, setIncomingCall] = useState(null);

  const navigate = useNavigate();
  const msgAreaRef = useRef(null);
  const searchRef = useRef(null);
  const unsubscribeRef = useRef(null);
  const ringIntervalRef = useRef(null);

  const currentUser = auth.currentUser;
  const minEmail = (email) => email.substring(0, email.indexOf('@'));
  const myMinEmail = currentUser ? minEmail(currentUser.email) : '';

  // Load chat users list on mount
  useEffect(() => {
    if (!currentUser) return;
    const userDocRef = doc(firestore, 'users', currentUser.email);
    const unsub = onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        setChatUsers(snapshot.data().chatusers || []);
        setIncomingCall(snapshot.data().incomingCall || null);
      }
    });
    return () => unsub();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Subscribe to live messages for the selected chat user
  useEffect(() => {
    if (!currentUser || !currentChatUser) return;
    if (unsubscribeRef.current) unsubscribeRef.current();

    const minChatUser = minEmail(currentChatUser);
    const userDocRef = doc(firestore, 'users', currentUser.email);
    const unsub = onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const chatData = snapshot.data()[minChatUser];
        if (Array.isArray(chatData)) setMessages(chatData);
      }
    });
    unsubscribeRef.current = unsub;
    return () => unsub();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChatUser]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (msgAreaRef.current) {
      msgAreaRef.current.scrollTop = msgAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
        setSearchResults([]);
        setSearchPeople('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ring tone when there's an incoming call
  useEffect(() => {
    if (!incomingCall) {
      if (ringIntervalRef.current) {
        clearInterval(ringIntervalRef.current);
        ringIntervalRef.current = null;
      }
      return;
    }
    const playRing = () => {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        [0, 0.45].forEach((delay) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.connect(g);
          g.connect(ctx.destination);
          osc.type = 'sine';
          osc.frequency.value = 480;
          g.gain.setValueAtTime(0.25, ctx.currentTime + delay);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.35);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 0.36);
        });
        setTimeout(() => ctx.close().catch(() => {}), 1200);
      } catch (_) {}
    };
    playRing();
    ringIntervalRef.current = setInterval(playRing, 2000);
    return () => {
      if (ringIntervalRef.current) {
        clearInterval(ringIntervalRef.current);
        ringIntervalRef.current = null;
      }
    };
  }, [incomingCall]);

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  const handlePeopleSearch = async (value) => {
    setSearchPeople(value);
    if (value.length < 2) { setSearchResults([]); return; }
    const snapshot = await getDocs(collection(firestore, 'users'));
    const results = [];
    snapshot.docs.forEach((d) => {
      if (d.id !== currentUser.email && d.id.includes(value)) results.push(d.id);
    });
    setSearchResults(results);
  };

  const addChatUser = async (targetUser) => {
    setShowSearch(false);
    setSearchResults([]);
    setSearchPeople('');

    const myRef = doc(firestore, 'users', currentUser.email);
    const mySnap = await getDoc(myRef);
    const myData = mySnap.data();
    if (myData.chatusers.includes(targetUser)) return;

    const minTarget = minEmail(targetUser);
    await updateDoc(myRef, {
      chatusers: [...myData.chatusers, targetUser],
      [minTarget]: [],
      mycalls: { ...myData.mycalls, [minTarget]: '' },
    });

    const theirRef = doc(firestore, 'users', targetUser);
    const theirSnap = await getDoc(theirRef);
    const theirData = theirSnap.data();
    await updateDoc(theirRef, {
      chatusers: [...theirData.chatusers, currentUser.email],
      [myMinEmail]: [],
      mycalls: { ...theirData.mycalls, [myMinEmail]: '' },
    });
  };

  const openChat = async (chatUser) => {
    setCurrentChatUser(chatUser);
    setMessages([]);
    setMobileView('chat');
    await updateDoc(doc(firestore, 'users', currentUser.email), { currentuser: chatUser });
  };

  const sendMessage = async () => {
    if (!currentChatUser || message.trim() === '') return;
    setSendingMsg(true);
    const minChatUser = minEmail(currentChatUser);

    const myRef = doc(firestore, 'users', currentUser.email);
    const mySnap = await getDoc(myRef);
    const myChat = [...(mySnap.data()[minChatUser] || [])];
    myChat.push({ user: myMinEmail, chat: message.trim() });
    await updateDoc(myRef, { [minChatUser]: myChat });

    const theirRef = doc(firestore, 'users', currentChatUser);
    const theirSnap = await getDoc(theirRef);
    const theirChat = [...(theirSnap.data()[myMinEmail] || [])];
    theirChat.push({ user: myMinEmail, chat: message.trim() });
    await updateDoc(theirRef, { [myMinEmail]: theirChat });

    setMessage('');
    setSendingMsg(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const acceptCall = async () => {
    const { from } = incomingCall;
    setIncomingCall(null);
    await updateDoc(doc(firestore, 'users', currentUser.email), {
      incomingCall: deleteField(),
      currentuser: from,
    });
    navigate('/chat/vc', { state: { autoStart: true } });
  };

  const declineCall = async () => {
    const { callId } = incomingCall;
    setIncomingCall(null);
    await updateDoc(doc(firestore, 'users', currentUser.email), {
      incomingCall: deleteField(),
    });
    if (callId) {
      try {
        await updateDoc(doc(firestore, 'calls', callId), { callDeclined: true });
      } catch (_) {}
    }
  };

  const avatarLetter = currentUser.displayName
    ? currentUser.displayName.charAt(0).toUpperCase()
    : currentUser.email.charAt(0).toUpperCase();

  return (
    <div className="chat-app">
      {/* Incoming call overlay */}
      {incomingCall && (
        <div className="incoming-call-overlay">
          <div className="incoming-call-card">
            <div className="incoming-call-avatar">
              {incomingCall.callerName?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="incoming-call-info">
              <span className="incoming-call-label">Incoming video call</span>
              <span className="incoming-call-name">{incomingCall.callerName}</span>
            </div>
            <div className="incoming-call-actions">
              <IconButton
                onClick={acceptCall}
                title="Accept"
                sx={{ bgcolor: '#38a169', color: 'white', '&:hover': { bgcolor: '#2f9158' } }}
              >
                <CallIcon />
              </IconButton>
              <IconButton
                onClick={declineCall}
                title="Decline"
                sx={{ bgcolor: '#e53e3e', color: 'white', '&:hover': { bgcolor: '#c53030' } }}
              >
                <CallEndIcon />
              </IconButton>
            </div>
          </div>
        </div>
      )}
      <header className="chat-header">
        {/* Mobile back button when viewing chat */}
        {mobileView === 'chat' && (
          <IconButton
            className="chat-back-btn"
            size="small"
            sx={{ color: 'white', mr: 0.5, display: { sm: 'none' } }}
            onClick={() => setMobileView('list')}
          >
            <ArrowBackIcon />
          </IconButton>
        )}

        <Link to="/" className="chat-brand">
          <img src={titlelogo} alt="" className="chat-logo" />
          <span className="chat-brand-name">Microsoft Teams</span>
        </Link>

        <div className="chat-search-wrapper" ref={searchRef}>
          <div className="chat-search-input-wrap">
            <SearchIcon className="chat-search-icon" />
            <input
              type="search"
              placeholder="Search people..."
              className="chat-search-input"
              value={searchPeople}
              onChange={(e) => handlePeopleSearch(e.target.value)}
              onFocus={() => setShowSearch(true)}
            />
          </div>
          {showSearch && searchResults.length > 0 && (
            <div className="chat-search-dropdown">
              {searchResults.map((user) => (
                <div key={user} className="chat-search-result" onClick={() => addChatUser(user)}>
                  <div className="result-avatar">{user.charAt(0).toUpperCase()}</div>
                  <span>{user}</span>
                  <PersonAddIcon className="result-add-icon" fontSize="small" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="chat-header-right">
          <Tooltip title={currentUser.displayName || currentUser.email}>
            <div className="chat-avatar">{avatarLetter}</div>
          </Tooltip>
          <Tooltip title="Sign out">
            <IconButton onClick={handleLogout} size="small" sx={{ color: 'white' }}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </div>
      </header>

      <div className="chat-body">
        <aside className="chat-sidebar">
          <Tooltip title="Chat" placement="right">
            <div className="sidebar-item sidebar-item--active">
              <ChatIcon />
              <span>Chat</span>
            </div>
          </Tooltip>
        </aside>

        {/* List panel — hidden on mobile when viewing a chat */}
        <div className={`chat-list-panel ${mobileView === 'chat' ? 'chat-list-panel--hidden-mobile' : ''}`}>
          <div className="chat-list-header">
            <h2>Chat</h2>
          </div>
          <div className="chat-list">
            {chatUsers.length === 0 ? (
              <div className="chat-list-empty">
                <SearchIcon sx={{ fontSize: 40, color: '#aaa', mb: 1 }} />
                <p>Search for people above to start a conversation</p>
              </div>
            ) : (
              chatUsers.map((user) => {
                const isActive = user === currentChatUser;
                return (
                  <div
                    key={user}
                    className={`chat-list-item ${isActive ? 'chat-list-item--active' : ''}`}
                    onClick={() => openChat(user)}
                  >
                    <div className="chat-list-avatar">{user.charAt(0).toUpperCase()}</div>
                    <div className="chat-list-info">
                      <span className="chat-list-name">{minEmail(user)}</span>
                      <span className="chat-list-email">{user}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Message panel — hidden on mobile when viewing list */}
        <div className={`chat-msg-panel ${mobileView === 'list' ? 'chat-msg-panel--hidden-mobile' : ''}`}>
          {currentChatUser ? (
            <>
              <div className="chat-msg-header">
                <div className="chat-msg-title">
                  <div className="chat-msg-header-avatar">{currentChatUser.charAt(0).toUpperCase()}</div>
                  <div>
                    <div className="chat-msg-header-name">{minEmail(currentChatUser)}</div>
                    <div className="chat-msg-header-email">{currentChatUser}</div>
                  </div>
                </div>
                <Tooltip title="Start video call">
                  <IconButton
                    color="primary"
                    className="vc-button"
                    onClick={() => navigate('/chat/vc', { state: { autoStart: true } })}
                  >
                    <VideoCallIcon />
                  </IconButton>
                </Tooltip>
              </div>

              <div className="chat-msg-area" ref={msgAreaRef}>
                {messages.length === 0 && (
                  <div className="chat-msg-welcome">
                    Say hello to <strong>{minEmail(currentChatUser)}</strong> 👋
                  </div>
                )}
                {messages.map((item, idx) => {
                  const isMe = item.user === myMinEmail;
                  return (
                    <div key={idx} className={`msg-bubble-wrap ${isMe ? 'msg-mine' : 'msg-theirs'}`}>
                      <div className="msg-sender-label">{isMe ? 'You' : item.user}</div>
                      <div className={`msg-bubble ${isMe ? 'msg-bubble--mine' : 'msg-bubble--theirs'}`}>
                        {item.chat}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="chat-msg-input-area">
                <input
                  type="text"
                  className="chat-msg-input"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <IconButton
                  onClick={sendMessage}
                  disabled={sendingMsg || message.trim() === ''}
                  color="primary"
                  className="chat-send-btn"
                >
                  <SendIcon />
                </IconButton>
              </div>
            </>
          ) : (
            <div className="chat-msg-placeholder">
              <img src={vclogo} alt="" className="placeholder-icon" />
              <h3>Open a conversation</h3>
              <p>Select a person from the list or search to start chatting.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Main;
