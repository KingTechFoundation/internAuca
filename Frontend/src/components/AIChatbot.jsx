import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Minimize2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const businessInfo = `
You are an AI assistant for the Adventist University of Central Africa (AUCA) Laboratory Management System.

IMPORTANT INFORMATION:
- University Name: Adventist University of Central Africa (AUCA)
- Lab Manager: Mutiganda Elisa
- Contact: +250 781 462 608
- Locations: Masoro and Gishushu campuses
- Operating Hours: Sunday to Friday (Open)
- Saturday: CLOSED - Sabbath day, no lab access allowed for students
- System Name: LabMaster

YOUR ROLE:
- Help students and faculty with lab-related questions
- Provide information about booking labs and equipment
- Explain system features and how to use them
- Answer questions about lab schedules and availability
- Guide users through registration and login processes
- Provide support for maintenance requests

IMPORTANT RULES:
- Always be helpful, professional, and concise
- If asked about Saturday access, clearly state that labs are closed for Sabbath observance
- For technical issues beyond your knowledge, direct users to contact Lab Manager Elisa at +250 781 462 608
- Encourage users to use the system features for bookings and equipment management
- Be friendly and use a conversational tone

Remember: You represent AUCA and should maintain a professional yet approachable demeanor.
`;

const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: '👋 Hi! I\'m your AUCA Lab Assistant. How can I help you today?',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const chatRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const quickQuestions = [
        'How do I book a lab?',
        'What are the lab hours?',
        'How do I register?',
        'Can I access labs on Saturday?'
    ];

    const sendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            role: 'user',
            content: inputMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const model = genAI.getGenerativeModel({
                model: 'gemini-2.5-flash',
                systemInstruction: businessInfo,
            });

            const chat = model.startChat({
                history: messages.slice(1).map(msg => ({
                    role: msg.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: msg.content }]
                }))
            });

            const result = await chat.sendMessage(inputMessage);
            const response = await result.response;
            const text = response.text();

            const assistantMessage = {
                role: 'assistant',
                content: text,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again or contact Lab Manager Elisa at +250 781 462 608 for assistance.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickQuestion = (question) => {
        setInputMessage(question);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 left-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 animate-slide-up flex flex-col h-[600px]">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-t-2xl flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center">
                                    <Bot className="h-7 w-7 text-blue-600" />
                                </div>
                                <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 border-2 border-white rounded-full"></div>
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">AUCA Lab Assistant</h3>
                                <p className="text-blue-100 text-sm">AI-powered support</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                            >
                                <Minimize2 className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div ref={chatRef} className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl p-4 ${message.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                                        {formatTime(message.timestamp)}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none p-4 shadow-sm border border-gray-100">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Questions */}
                    {messages.length === 1 && (
                        <div className="px-4 py-2 bg-white border-t border-gray-200">
                            <p className="text-xs text-gray-500 font-medium mb-2">Quick questions:</p>
                            <div className="grid grid-cols-2 gap-2">
                                {quickQuestions.map((question, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleQuickQuestion(question)}
                                        className="text-left p-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs text-blue-700 transition-all"
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Ask me anything..."
                                disabled={isLoading}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-100"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!inputMessage.trim() || isLoading}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-full transition-colors shadow-lg hover:shadow-xl"
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            Powered by Google AI • AUCA LabMaster
                        </p>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 left-6 h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-110 z-50 flex items-center justify-center group"
            >
                {isOpen ? (
                    <X className="h-7 w-7" />
                ) : (
                    <>
                        <Bot className="h-7 w-7" />
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            AI
                        </span>
                    </>
                )}

                {/* Tooltip */}
                {!isOpen && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Chat with AI Assistant
                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                )}
            </button>
        </>
    );
};
