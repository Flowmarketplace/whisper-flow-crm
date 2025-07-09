import React from 'react';
import { Bot, Calendar, FileSpreadsheet, Database, Mail, Zap, MessageSquare, Clock, Settings, Webhook } from 'lucide-react';

interface ToolIconProps {
  toolName: string;
  className?: string;
}

const ToolIcon: React.FC<ToolIconProps> = ({ toolName, className = "w-5 h-5" }) => {
  const getIcon = () => {
    const tool = toolName.toLowerCase();
    
    if (tool.includes('calendar') || tool.includes('google calendar')) {
      return <Calendar className={className} />;
    }
    if (tool.includes('sheets') || tool.includes('google sheets') || tool.includes('excel')) {
      return <FileSpreadsheet className={className} />;
    }
    if (tool.includes('openai') || tool.includes('chatgpt') || tool.includes('gpt')) {
      return <Bot className={className} />;
    }
    if (tool.includes('notion')) {
      return <Database className={className} />;
    }
    if (tool.includes('gmail') || tool.includes('email') || tool.includes('mail')) {
      return <Mail className={className} />;
    }
    if (tool.includes('zapier')) {
      return <Zap className={className} />;
    }
    if (tool.includes('whatsapp') || tool.includes('telegram') || tool.includes('discord')) {
      return <MessageSquare className={className} />;
    }
    if (tool.includes('webhook')) {
      return <Webhook className={className} />;
    }
    if (tool.includes('scheduler') || tool.includes('cron') || tool.includes('timer')) {
      return <Clock className={className} />;
    }
    
    return <Settings className={className} />;
  };

  return getIcon();
};

export default ToolIcon;