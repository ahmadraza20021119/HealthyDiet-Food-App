import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import "../styles/Chatbot.css";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hey there! I am your Personal Trainer. Ready to crush some diet goals today?' }
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

            const aiMessage = { role: 'assistant', content: response.data.reply };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having some trouble connecting to my brain right now.' }]);
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
                            <div key={index} className={`message ${msg.role}`}>
                                <div className="message-content">
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            </div>
                        ))}
                        {loading && <div className="message assistant">Typing...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chat-input-area" onSubmit={handleSend}>
                        <input
                            type="text"
                            placeholder="Ask about meal plans..."
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
