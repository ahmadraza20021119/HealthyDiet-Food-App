import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import "../styles/Chatbot.css";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hey there! I am your AI Personal Trainer. Ready to crush some diet or workout goals today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        const userProfile = JSON.parse(localStorage.getItem('userInfo')) || {};

        try {
            const response = await axios.post('http://localhost:5000/api/ai/recommend', {
                message: input,
                userProfile: userProfile
            });

            const aiMessage = { 
                role: 'assistant', 
                content: response.data.reply,
                cached: response.data.cached || false
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Chat error:", error);

            let errorContent;
            if (error.response && error.response.status === 503) {
                // Rate limit / all models exhausted
                const data = error.response.data;
                errorContent = `⚠️ **AI Quota Reached**\n\n${data.message || 'The AI service has reached its daily limit.'}\n\n⏳ Estimated reset in: **${data.retryAfter || 'a few hours'}**\n\n💡 *Tip: Try again after the reset, or ask a question you've asked before — cached responses still work!*`;
            } else {
                errorContent = 'Sorry, I am having some trouble connecting to my brain right now. Please try again in a moment! 🔄';
            }

            setMessages(prev => [...prev, { role: 'assistant', content: errorContent, isError: true }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`chatbot-wrapper ${isOpen ? 'open' : ''}`}>
            {!isOpen && (
                <button className="chat-trigger" onClick={() => setIsOpen(true)}>
                    <i className="fas fa-drumstick-bite"></i>
                    <span>Personal Trainer</span>
                </button>
            )}

            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <div className="header-info">
                            <i className="fas fa-drumstick-bite"></i>
                            <div>
                                <h4>Personal Trainer</h4>
                                <span>Always active for you</span>
                            </div>
                        </div>
                        <button className="close-chat" onClick={() => setIsOpen(false)}>×</button>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.role} ${msg.isError ? 'error-message' : ''}`}>
                                <div className="message-content">
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    {msg.cached && (
                                        <span className="cached-badge" title="This response was served from cache">⚡ Instant</span>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="message assistant">
                                <div className="typing-indicator">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chat-input-area" onSubmit={handleSend}>
                        <input
                            type="text"
                            placeholder="Ask about meal plans or workouts..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button type="submit" disabled={loading}>
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
