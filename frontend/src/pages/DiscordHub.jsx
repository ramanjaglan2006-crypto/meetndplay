import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import { getCommunities, joinCommunity, getChannels, getMessages } from '../services/api';
import { Hash } from 'lucide-react';

const socket = io('http://localhost:5001');

const DiscordHub = () => {
  const currentUserId = 'u1';
  const currentUserName = 'Raman';

  const [activeCommId, setActiveCommId] = useState(null);
  const [activeChannelId, setActiveChannelId] = useState(null);
  
  const [messages, setMessages] = useState([]);
  const [inputStr, setInputStr] = useState('');
  const bottomRef = useRef(null);

  // 1. Fetch Communities
  const { data: communities = [], refetch: refetchComms } = useQuery({
    queryKey: ['communities'],
    queryFn: async () => { const res = await getCommunities(); return res.data; }
  });

  const activeCommunity = communities.find(c => c.id === activeCommId);
  const isMember = activeCommunity ? activeCommunity.members.includes(currentUserId) : false;

  // 2. Fetch Channels for Active Community
  const { data: channels = [] } = useQuery({
    queryKey: ['channels', activeCommId],
    queryFn: async () => { const res = await getChannels(activeCommId); return res.data; },
    enabled: !!activeCommId
  });

  const activeChannel = channels.find(c => c.id === activeChannelId);

  // Initialize Selection
  useEffect(() => {
    if (!activeCommId && communities.length > 0) setActiveCommId(communities[0].id);
  }, [communities, activeCommId]);

  useEffect(() => {
    if (channels.length > 0 && (!activeChannelId || !channels.find(c => c.id === activeChannelId))) {
      setActiveChannelId(channels[0].id);
    }
  }, [channels, activeChannelId]);

  // Load Messages + Socket Rooms
  useEffect(() => {
    if (!activeChannelId) return;
    
    // Fetch initial
    getMessages(activeChannelId).then(res => setMessages(res.data));

    // Join Socket Room
    socket.emit('joinRoom', activeChannelId);

    // Listen to new messages
    const handler = (newMsg) => {
      setMessages(prev => [...prev, newMsg]);
    };
    socket.on('receiveMessage', handler);

    return () => {
      socket.off('receiveMessage', handler);
    };
  }, [activeChannelId]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoin = async () => {
    await joinCommunity(activeCommId, currentUserId);
    refetchComms();
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputStr.trim()) return;
    socket.emit('sendMessage', {
      channelId: activeChannelId,
      senderId: currentUserId,
      senderName: currentUserName,
      content: inputStr
    });
    setInputStr('');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, zIndex: 9999, backgroundColor: '#36393f', color: 'white', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Pane 1: Server Icons */}
      <div style={{ width: '72px', backgroundColor: '#202225', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '12px' }}>
        {communities.map(c => (
          <div 
            key={c.id}
            onClick={() => setActiveCommId(c.id)}
            style={{ 
              width: '48px', height: '48px', backgroundColor: activeCommId === c.id ? '#5865F2' : '#36393f', 
              borderRadius: activeCommId === c.id ? '16px' : '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', 
              marginBottom: '8px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 'bold'
            }}
          >
            {c.icon}
          </div>
        ))}
        {/* Quick Back to App */}
        <div style={{ marginTop: 'auto', marginBottom: '20px', width: '48px', height: '48px', backgroundColor: '#ed4245', borderRadius: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', fontSize: '1.2rem' }} onClick={() => window.location.href='/'} title="Back to Mobile View">
            ←
        </div>
      </div>

      {/* Pane 2: Channels List */}
      <div style={{ width: '240px', backgroundColor: '#2f3136', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px', fontWeight: 'bold', borderBottom: '1px solid #202225', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
          {activeCommunity ? activeCommunity.name : 'Loading...'}
        </div>
        <div style={{ padding: '16px 8px', flex: 1 }}>
          {isMember ? channels.map(ch => (
             <div 
               key={ch.id} 
               onClick={() => setActiveChannelId(ch.id)}
               style={{ padding: '8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: activeChannelId === ch.id ? 'white' : '#8e9297', backgroundColor: activeChannelId === ch.id ? '#393c43' : 'transparent', marginBottom: '2px', fontWeight: '500' }}
             >
               <Hash size={18} /> {ch.name}
             </div>
          )) : (
             <div style={{ textAlign: 'center', marginTop: '20px', color: '#8e9297', fontSize: '0.9rem' }}>
                <p style={{marginBottom:'10px'}}>You must join to view channels.</p>
                <button onClick={handleJoin} style={{ padding: '8px 16px', backgroundColor: '#5865F2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Join Community</button>
             </div>
          )}
        </div>
      </div>

      {/* Pane 3: Chat Area */}
      <div style={{ flex: 1, backgroundColor: '#36393f', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px', fontWeight: 'bold', borderBottom: '1px solid #2f3136', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
          <Hash size={20} color="#8e9297" /> {activeChannel ? activeChannel.name : 'Select a channel'}
        </div>
        
        {isMember && activeChannel ? (
          <>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              {messages.map(m => (
                <div key={m.id} style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#5865F2', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
                    {m.senderName ? m.senderName[0] : '?'}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span style={{ fontWeight: '500', color: 'white' }}>{m.senderName}</span>
                      <span style={{ fontSize: '0.75rem', color: '#8e9297' }}>{new Date(m.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <div style={{ color: '#dcddde', marginTop: '4px', lineHeight: '1.4' }}>{m.content}</div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <div style={{ padding: '0 16px 20px 16px' }}>
              <form onSubmit={handleSend} style={{ display: 'flex', backgroundColor: '#40444b', borderRadius: '8px', padding: '12px 16px' }}>
                <input 
                  type="text" 
                  value={inputStr} 
                  onChange={e => setInputStr(e.target.value)} 
                  placeholder={`Message #${activeChannel.name}`} 
                  style={{ flex: 1, backgroundColor: 'transparent', border: 'none', color: '#dcddde', outline: 'none', fontSize: '1rem' }} 
                />
              </form>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#8e9297' }}>
            {isMember ? "Select a channel to start messaging." : "Join the community to unlock channels."}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscordHub;
