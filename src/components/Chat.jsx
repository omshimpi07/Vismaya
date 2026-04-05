// File: Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase';
import { ref, push, onValue } from 'firebase/database';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

const Chat = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currUser) => {
      setUser(currUser);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const chatRef = ref(db, 'globalChat');
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allMessages = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
        setMessages(allMessages);
      } else {
        setMessages([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || !user) return;

    const newMessage = {
      uid: user.uid,
      name: user.displayName || user.email?.split('@')[0] || 'Anonymous',
      content: message.trim(),
      timestamp: Date.now(),
    };

    await push(ref(db, 'globalChat'), newMessage);
    setMessage('');
  };

  if (!user) {
    return <div className="text-center p-6 text-purple-600 font-semibold animate-pulse">Loading WomenConnect Chat...</div>;
  }

  return (
    <div className="w-full  flex items-center justify-center bg-gradient-to-t from-pink-50 via-purple-100 to-purple-200 ">
      <div className="w-full h-[100vh] backdrop-blur-md bg-white/60 border border-purple-300 shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <header className="bg-darkPurple border-b p-5 border-purple-300 shadow-sm flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
          FemLink
          </h1>
          <Link to="/">
            <button className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded transition duration-200">
              Back to Home
            </button>
          </Link>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-white/40">
          {messages.map((msg, idx) => {
            const isUser = msg.uid === user.uid;
            return (
              <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md px-4 py-3 rounded-2xl shadow ${isUser ? 'bg-pink-600/90 text-white' : 'bg-white border border-purple-300 text-purple-700'}`}>
                  <p className={`text-xs font-semibold mb-1 ${isUser ? 'text-pink-200' : 'text-purple-800'}`}>{msg.name}</p>
                  {isMediaLink(msg.content)
                    ? renderMedia(msg.content, isUser)
                    : <p className="text-sm leading-relaxed">{msg.content}</p>}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </main>

        {/* Input */}
        <footer className="py-3 px-6 bg-white/70 border-t border-purple-300 flex gap-3 items-center">
          <input
            type="text"
            placeholder="Type message or media link..."
            className="flex-grow px-4 py-2 rounded-xl bg-white border border-purple-300 shadow-inner text-purple-700 placeholder:text-purple-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold shadow-md transition duration-300"
          >
            Send
          </button>
        </footer>
      </div>
    </div>
  );
};

const isMediaLink = (text) => {
  const imageExtensions = /\.(jpg|jpeg|png|gif)$/i;
  const videoExtensions = /\.(mp4|webm|ogg)$/i;
  const docExtensions = /\.(pdf|docx|pptx|txt|zip|rar)$/i;
  return imageExtensions.test(text) || videoExtensions.test(text) || docExtensions.test(text);
};

const renderMedia = (url, isUser) => {
  const baseClass = 'mt-2 rounded-xl max-w-full shadow';
  const linkClass = isUser ? 'text-pink-100 underline' : 'text-purple-700 underline';

  if (url.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return <img src={url} alt="media" className={baseClass} />;
  }
  if (url.match(/\.(mp4|webm|ogg)$/i)) {
    return <video controls src={url} className={baseClass} />;
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={`${linkClass} inline-block`}>
      📎 Open File
    </a>
  );
};

export default Chat;
