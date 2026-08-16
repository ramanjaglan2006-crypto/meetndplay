import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, Paperclip, ChevronDown, CheckCheck, Trash2, Calendar, Trophy } from 'lucide-react';
import { getCommunityChatMessages, sendCommunityChatMessage, deleteCommunityChatMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useNavigate } from 'react-router-dom';

const CommunityChat = ({ community }) => {
    const { user } = useAuth();
    const { socket } = useSocket();
    const navigate = useNavigate();
    
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [composerText, setComposerText] = useState('');
    const [isAtBottom, setIsAtBottom] = useState(true);
    
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    
    const isMember = community.membership && community.membership.status === 'active';

    // Fetch initial messages
    useEffect(() => {
        const fetchMessages = async () => {
            if (!isMember && community.privacy !== 'public') {
                setLoading(false);
                return;
            }
            
            try {
                const res = await getCommunityChatMessages(community._id);
                setMessages(res.data);
                setTimeout(scrollToBottom, 100);
            } catch (error) {
                console.error("Failed to load chat", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, [community._id, isMember, community.privacy]);

    // Socket Setup
    useEffect(() => {
        if (!user || !isMember || !socket) return;
        
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        };
        const token = getCookie('meet_session') || localStorage.getItem('token');
        
        socket.emit('join_community', { communityId: community._id, token });

        const handleNewMessage = (message) => {
            setMessages(prev => [...prev, message]);
            if (isAtBottom) setTimeout(scrollToBottom, 100);
        };
        
        const handleDeleteMessage = (messageId) => {
            setMessages(prev => prev.map(m => m._id === messageId ? { ...m, isDeleted: true, text: '' } : m));
        };

        socket.on('new_community_message', handleNewMessage);
        socket.on('delete_community_message', handleDeleteMessage);

        return () => {
            socket.emit('leave_community', community._id);
            socket.off('new_community_message', handleNewMessage);
            socket.off('delete_community_message', handleDeleteMessage);
        };
    }, [community._id, user, isMember, isAtBottom, socket]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        const isBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 50;
        setIsAtBottom(isBottom);
    };

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        
        if (!composerText.trim() || !isMember) return;

        const text = composerText;
        setComposerText('');
        
        // Optimistic UI update could go here, but let's wait for server response to keep it simple and accurate
        
        try {
            await sendCommunityChatMessage(community._id, { text });
            // The socket will receive the message and update state
        } catch (error) {
            console.error(error);
            setComposerText(text); // Restore text on failure
            alert("Failed to send message");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleDelete = async (messageId) => {
        if (window.confirm("Delete this message?")) {
            try {
                await deleteCommunityChatMessage(community._id, messageId);
            } catch (error) {
                alert("Failed to delete message");
            }
        }
    };

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading chat...</div>;
    }

    if (!isMember && community.privacy !== 'public') {
        return (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                <h3>Private Chat</h3>
                <p style={{ color: 'var(--text-muted)' }}>You must join the community to view and participate in the chat.</p>
            </div>
        );
    }

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '600px', 
            background: 'var(--surface-color)', 
            borderRadius: '16px', 
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Chat Area */}
            <div 
                ref={chatContainerRef}
                onScroll={handleScroll}
                style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
                {messages.length === 0 ? (
                    <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>👋</div>
                        <p>Welcome to {community.name} chat!</p>
                        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Be the first to say hello.</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isOwn = msg.sender?._id === user?._id;
                        const isSystem = msg.type === 'system';
                        
                        if (isSystem) {
                            return (
                                <div key={msg._id || index} style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
                                    <div style={{ 
                                        background: 'rgba(99, 102, 241, 0.1)', 
                                        border: '1px solid rgba(99, 102, 241, 0.2)',
                                        padding: '12px 20px',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        maxWidth: '80%'
                                    }}>
                                        <div style={{ color: 'var(--primary)' }}>
                                            {msg.systemData?.action === 'match_created' ? <Trophy size={20} /> : <Calendar size={20} />}
                                        </div>
                                        <div>
                                            <span style={{ fontWeight: 600 }}>{msg.sender?.name}</span> {msg.text}
                                            {msg.systemData?.link && (
                                                <button 
                                                    onClick={() => navigate(msg.systemData.link)}
                                                    className="btn-secondary"
                                                    style={{ marginLeft: '12px', padding: '4px 12px', fontSize: '0.8rem' }}
                                                >
                                                    View
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        
                        return (
                            <div key={msg._id || index} style={{ 
                                display: 'flex', 
                                flexDirection: isOwn ? 'row-reverse' : 'row',
                                gap: '12px',
                                alignItems: 'flex-end',
                                alignSelf: isOwn ? 'flex-end' : 'flex-start',
                                maxWidth: '80%'
                            }}>
                                {!isOwn && (
                                    <div style={{ 
                                        width: '32px', height: '32px', borderRadius: '50%', 
                                        background: 'var(--primary-dark)', color: 'white', 
                                        display: 'flex', justifyContent: 'center', alignItems: 'center', 
                                        fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0 
                                    }}>
                                        {msg.sender?.name?.charAt(0) || 'U'}
                                    </div>
                                )}
                                
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: isOwn ? 'flex-end' : 'flex-start' }}>
                                    {!isOwn && (
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', marginLeft: '4px' }}>
                                            {msg.sender?.name}
                                        </div>
                                    )}
                                    
                                    <div style={{
                                        background: msg.isDeleted ? 'transparent' : (isOwn ? 'var(--primary)' : 'var(--background-color)'),
                                        color: msg.isDeleted ? 'var(--text-muted)' : 'white',
                                        border: msg.isDeleted ? '1px solid var(--border-color)' : 'none',
                                        fontStyle: msg.isDeleted ? 'italic' : 'normal',
                                        padding: '12px 16px',
                                        borderRadius: '16px',
                                        borderBottomRightRadius: isOwn ? '4px' : '16px',
                                        borderBottomLeftRadius: !isOwn ? '4px' : '16px',
                                        position: 'relative',
                                        group: 'true'
                                    }} className="chat-bubble">
                                        {msg.isDeleted ? 'This message was deleted' : msg.text}
                                        
                                        {/* Hover Actions */}
                                        {!msg.isDeleted && (isOwn || (community.membership?.role === 'admin')) && (
                                            <div className="chat-actions" style={{
                                                position: 'absolute',
                                                top: '-15px',
                                                right: isOwn ? 'auto' : '-10px',
                                                left: isOwn ? '-10px' : 'auto',
                                                background: 'var(--surface-color)',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '8px',
                                                padding: '4px',
                                                display: 'none', // Shown via CSS
                                                gap: '4px'
                                            }}>
                                                <button onClick={() => handleDelete(msg._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {isOwn && <CheckCheck size={12} color="var(--primary)" />}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Floating New Messages Indicator */}
            {!isAtBottom && (
                <button 
                    onClick={scrollToBottom}
                    style={{
                        position: 'absolute',
                        bottom: '90px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        zIndex: 10
                    }}
                >
                    <ChevronDown size={16} /> Latest messages
                </button>
            )}

            {/* Composer */}
            {isMember ? (
                <div style={{ 
                    padding: '1rem 1.5rem', 
                    borderTop: '1px solid var(--border-color)', 
                    background: 'var(--surface-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex' }} className="hover-bg">
                        <Paperclip size={20} />
                    </button>
                    
                    <textarea 
                        value={composerText}
                        onChange={(e) => setComposerText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Message the community..."
                        style={{
                            flex: 1,
                            background: 'var(--background-color)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '24px',
                            padding: '12px 20px',
                            color: 'white',
                            resize: 'none',
                            maxHeight: '100px',
                            minHeight: '45px',
                            fontFamily: 'inherit'
                        }}
                        rows={1}
                    />
                    
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex' }} className="hover-bg">
                        <Smile size={20} />
                    </button>
                    
                    <button 
                        onClick={handleSendMessage}
                        disabled={!composerText.trim()}
                        style={{ 
                            background: composerText.trim() ? 'var(--primary)' : 'var(--background-color)', 
                            border: 'none', 
                            color: composerText.trim() ? 'white' : 'var(--text-muted)', 
                            cursor: composerText.trim() ? 'pointer' : 'default', 
                            padding: '12px', 
                            borderRadius: '50%', 
                            display: 'flex',
                            transition: 'background 0.2s'
                        }}
                    >
                        <Send size={18} style={{ marginLeft: '2px' }} />
                    </button>
                </div>
            ) : (
                <div style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--background-color)', borderTop: '1px solid var(--border-color)' }}>
                    <p style={{ color: 'var(--text-muted)' }}>You must join the community to send messages.</p>
                </div>
            )}
            
            {/* Add styles for chat bubble hover actions */}
            <style>{`
                .chat-bubble:hover .chat-actions {
                    display: flex !important;
                }
                .hover-bg:hover {
                    background: rgba(255,255,255,0.05);
                }
            `}</style>
        </div>
    );
};

export default CommunityChat;
