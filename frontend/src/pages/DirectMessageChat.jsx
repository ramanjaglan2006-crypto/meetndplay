import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { getDirectMessages, sendDirectMessage } from '../services/api';

const DirectMessageChat = () => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  
  const loggedInUser = JSON.parse(localStorage.getItem('meet_user') || '{}');
  const currentUserId = loggedInUser.id || 'u1';
  const profileName = location.state?.profileName || 'Player';
  const matchContext = location.state?.matchContext;

  useEffect(() => {
    // Set initial context message if navigating from a match context
    if (matchContext && messages.length === 0) {
      setInput(`Hey! I saw you're ${matchContext.toLowerCase()}. Can I join?`);
    }
  }, [matchContext]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await getDirectMessages(currentUserId, userId);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };
    
    fetchMessages();
    
    // Basic polling for new messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const res = await sendDirectMessage(currentUserId, userId, input, matchContext);
      setMessages(prev => [...prev, res.data]);
      setInput('');
    } catch (err) {
      console.error("Failed to send message", err);
      alert("Error sending message. Ensure you are connected first.");
    }
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
          <h2 style={{ fontSize: '1.1rem' }}>{profileName}</h2>
          <p style={{ fontSize: '0.7rem', color: 'var(--success)' }}>Connected</p>
        </div>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem', fontSize: '0.9rem' }}>
                No messages yet. Start the conversation!
            </div>
        )}
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
              <div style={{ 
                padding: '10px 14px', 
                borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: isMe ? 'var(--primary)' : 'var(--glass-border)',
                color: isMe ? 'black' : 'white',
                fontSize: '0.9rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                {msg.content}
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
          color: 'black'
        }}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default DirectMessageChat;
