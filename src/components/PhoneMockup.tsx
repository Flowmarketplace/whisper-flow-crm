import React from 'react';
import { MessageCircle, User, Bot } from 'lucide-react';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

interface PhoneMockupProps {
  messages: Message[];
  agentName: string;
}

const PhoneMockup: React.FC<PhoneMockupProps> = ({ messages, agentName }) => {
  return (
    <div className="relative mx-auto bg-gray-900 rounded-[2.5rem] border-8 border-gray-800 shadow-2xl max-w-[300px]">
      {/* Phone Frame */}
      <div className="relative bg-black rounded-[2rem] overflow-hidden">
        {/* Status Bar */}
        <div className="bg-black px-6 py-2 flex justify-between items-center text-white text-sm">
          <span>9:41</span>
          <span className="flex items-center space-x-1">
            <div className="w-4 h-2 bg-white rounded-sm"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </span>
        </div>
        
        {/* Chat Header */}
        <div className="bg-emerald-600 px-4 py-3 flex items-center space-x-3">
          <div className="w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-emerald-900" />
          </div>
          <div>
            <h3 className="text-white font-medium text-sm">{agentName}</h3>
            <p className="text-emerald-100 text-xs">En línea</p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="bg-gray-50 h-96 p-4 space-y-3 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-3 py-2 ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
              <span className="text-gray-500 text-sm">Escribe un mensaje...</span>
            </div>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneMockup;