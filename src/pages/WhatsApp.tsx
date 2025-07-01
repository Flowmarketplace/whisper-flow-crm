
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, Plus, Settings, Bot, User, Phone, Video, MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WhatsApp = () => {
  const { toast } = useToast();
  const [selectedChat, setSelectedChat] = useState(1);
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chats] = useState([
    {
      id: 1,
      name: "John Smith",
      phone: "+1 (555) 123-4567",
      lastMessage: "Thanks for the quick response!",
      time: "2m ago",
      unread: 0,
      avatar: "JS",
      status: "online",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      phone: "+1 (555) 987-6543",
      lastMessage: "Can we schedule a call?",
      time: "5m ago",
      unread: 2,
      avatar: "SJ",
      status: "offline",
    },
    {
      id: 3,
      name: "Mike Wilson",
      phone: "+1 (555) 456-7890",
      lastMessage: "Perfect, see you then!",
      time: "1h ago",
      unread: 0,
      avatar: "MW",
      status: "online",
    },
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      chatId: 1,
      sender: "contact",
      message: "Hi! I'm interested in your services. Can you tell me more?",
      time: "10:30 AM",
      agentHandled: false,
    },
    {
      id: 2,
      chatId: 1,
      sender: "agent",
      message: "Customer Support Agent activated - handling inquiry",
      time: "10:31 AM",
      agentHandled: true,
      agentName: "Customer Support Agent",
    },
    {
      id: 3,
      chatId: 1,
      sender: "me",
      message: "Hello! I'd be happy to help you learn more about our services. What specific area are you most interested in?",
      time: "10:31 AM",
      agentHandled: false,
    },
    {
      id: 4,
      chatId: 1,
      sender: "contact",
      message: "I'm looking for automation solutions for my business workflow",
      time: "10:32 AM",
      agentHandled: false,
    },
    {
      id: 5,
      chatId: 1,
      sender: "me",
      message: "Great! Our n8n integration can help automate various business processes. Let me connect you with our sales team.",
      time: "10:33 AM",
      agentHandled: false,
    },
    {
      id: 6,
      chatId: 1,
      sender: "contact",
      message: "Thanks for the quick response!",
      time: "10:35 AM",
      agentHandled: false,
    },
  ]);

  const currentChat = chats.find(chat => chat.id === selectedChat);
  const currentMessages = messages.filter(msg => msg.chatId === selectedChat);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      chatId: selectedChat,
      sender: "me" as const,
      message: message.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentHandled: false,
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");

    toast({
      title: "Message Sent",
      description: "Your message has been delivered",
    });

    console.log("Sending message to WhatsApp API:", newMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="p-6 bg-slate-950 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">WhatsApp Integration</h1>
          <div className="flex items-center space-x-2">
            <Badge className={isConnected ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
            <p className="text-slate-400">Real-time messaging interface</p>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              <Settings className="w-4 h-4 mr-2" />
              Connection Settings
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-white">WhatsApp Connection</DialogTitle>
              <DialogDescription className="text-slate-400">
                Configure your WhatsApp Business API connection
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="apiToken" className="text-slate-300">API Token</Label>
                <Input id="apiToken" type="password" placeholder="Enter your WhatsApp API token" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label htmlFor="phoneNumber" className="text-slate-300">Phone Number</Label>
                <Input id="phoneNumber" placeholder="+1234567890" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label htmlFor="webhookUrl" className="text-slate-300">Webhook URL</Label>
                <Input id="webhookUrl" placeholder="https://your-webhook-url.com" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                Save Connection
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Chat List */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center justify-between">
              Conversations
              <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                {chats.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`p-4 cursor-pointer transition-colors border-b border-slate-800 hover:bg-slate-800/50 ${
                    selectedChat === chat.id ? "bg-slate-800/70 border-l-4 border-l-blue-500" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {chat.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-medium truncate">{chat.name}</h3>
                        <span className="text-xs text-slate-400">{chat.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-slate-400 text-sm truncate">{chat.lastMessage}</p>
                        {chat.unread > 0 && (
                          <Badge className="bg-blue-600 text-white text-xs">
                            {chat.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm h-full flex flex-col">
            {/* Chat Header */}
            <CardHeader className="pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                    {currentChat?.avatar}
                  </div>
                  <div>
                    <h2 className="text-white font-semibold">{currentChat?.name}</h2>
                    <p className="text-slate-400 text-sm">{currentChat?.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentMessages.map((msg) => (
                <div key={msg.id} className="space-y-2">
                  {msg.agentHandled && (
                    <div className="flex justify-center">
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        <Bot className="w-3 h-3 mr-1" />
                        {msg.agentName} activated
                      </Badge>
                    </div>
                  )}
                  <div className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender === "me"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : msg.sender === "agent"
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                          : "bg-slate-800 text-white"
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === "me" ? "text-blue-100" : 
                        msg.sender === "agent" ? "text-purple-100" : "text-slate-400"
                      }`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Message Input */}
            <div className="p-4 border-t border-slate-800">
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-800 border-slate-700 text-white placeholder-slate-400"
                />
                <Button 
                  onClick={sendMessage}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WhatsApp;
