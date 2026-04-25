import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
// import { getCommunityMessages } from '../services/api'; // Deprecated
import { ArrowLeft, Send } from 'lucide-react';

const socket = io('http://localhost:5001');

const Chat = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  
  const currentUserId = 'u1';
  const currentUserName = 'Raman';

  useEffect(() => {
    // Load historical messages
    // getCommunityMessages(id).then(res => setMessages(res.data));

    // Join room
    socket.emit('join_community', id);

    // Listen for new messages
    socket.on('receive_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const msgData = {
      communityId: id,
      senderId: currentUserId,
      senderName: currentUserName,
      messageText: input
    };

    socket.emit('send_message', msgData);
    setInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-dark)' }}>
      <header style={{ 
        padding: '1rem', 
        borderBottom: '1px solid var(--glass-border)', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem',
        background: 'var(--glass)',
        backdropFilter: 'blur(10px)'
      }}>
        <ArrowLeft onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
        <div>
          <h2 style={{ fontSize: '1.1rem' }}>{location.state?.name || 'Community Chat'}</h2>
          <p style={{ fontSize: '0.7rem', color: 'var(--success)' }}>Online</p>
        </div>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {messages.map((msg, idx) => {
          const isMe = msg.senderId === currentUserId;
          const time = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

          return (
            <div key={idx} style={{ 
              alignSelf: isMe ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: isMe ? 'flex-end' : 'flex-start'
            }}>
              {!isMe && <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginLeft: '8px', marginBottom: '4px' }}>{msg.senderName}</span>}
              <div style={{ 
                padding: '10px 14px', 
                borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: isMe ? 'var(--primary)' : 'var(--glass-border)',
                color: 'white',
                fontSize: '0.9rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                {msg.messageText}
              </div>
              {time && (
                <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
                  {time}
                </span>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} style={{ padding: '1rem', background: 'var(--glass)', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '0.5rem' }}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ 
            flex: 1, 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid var(--glass-border)', 
            borderRadius: '12px', 
            padding: '12px', 
            color: 'white',
            outline: 'none'
          }}
        />
        <button type="submit" style={{ 
          background: 'var(--primary)', 
          border: 'none', 
          width: '45px', 
          height: '45px', 
          borderRadius: '50%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          color: 'white'
        }}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default Chat;
