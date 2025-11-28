import { useState } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';

export const WhatsAppWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const phoneNumber = '+250781462608';

    const handleSendMessage = () => {
        if (message.trim()) {
            const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            setMessage('');
            setIsOpen(false);
        }
    };

    const quickMessages = [
        'Hi! I need help with lab booking',
        'I have a question about equipment',
        'How do I register for the system?',
        'I need technical support'
    ];

    return (
        <>
            {/* Chat Playground */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 animate-slide-up">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-t-2xl flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center">
                                    <MessageCircle className="h-7 w-7 text-green-600" />
                                </div>
                                <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 border-2 border-white rounded-full"></div>
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">LabMaster Support</h3>
                                <p className="text-green-100 text-sm">Typically replies instantly</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Chat Body */}
                    <div className="p-4 h-96 overflow-y-auto bg-gray-50">
                        {/* Welcome Message */}
                        <div className="mb-4">
                            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[80%]">
                                <p className="text-gray-800 text-sm">
                                    👋 Hi there! Welcome to LabMaster Support.
                                </p>
                                <p className="text-gray-800 text-sm mt-2">
                                    How can I help you today?
                                </p>
                                <p className="text-xs text-gray-500 mt-2">Just now</p>
                            </div>
                        </div>

                        {/* Quick Reply Buttons */}
                        <div className="space-y-2 mb-4">
                            <p className="text-xs text-gray-500 font-medium mb-2">Quick replies:</p>
                            {quickMessages.map((msg, index) => (
                                <button
                                    key={index}
                                    onClick={() => setMessage(msg)}
                                    className="block w-full text-left p-3 bg-white hover:bg-green-50 border border-gray-200 hover:border-green-300 rounded-xl text-sm text-gray-700 transition-all"
                                >
                                    {msg}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!message.trim()}
                                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-full transition-colors shadow-lg hover:shadow-xl"
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            Powered by WhatsApp • {phoneNumber}
                        </p>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 h-16 w-16 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-2xl hover:shadow-green-500/50 transition-all hover:scale-110 z-50 flex items-center justify-center group"
            >
                {isOpen ? (
                    <X className="h-7 w-7" />
                ) : (
                    <>
                        <MessageCircle className="h-7 w-7" />
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                            1
                        </span>
                    </>
                )}

                {/* Tooltip */}
                {!isOpen && (
                    <div className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Chat with us on WhatsApp
                        <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                )}
            </button>
        </>
    );
};
