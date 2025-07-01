
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Key, Plus, Eye, EyeOff, Edit, Trash2, Copy, Shield, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Credentials = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState<{ [key: number]: boolean }>({});
  
  const [credentials, setCredentials] = useState([
    {
      id: 1,
      name: "OpenAI API Key",
      type: "api_key",
      description: "API key for ChatGPT integration",
      value: "sk-proj-abcdef123456789...",
      agentId: 1,
      agentName: "Customer Support Agent",
      lastUsed: "2 minutes ago",
    },
    {
      id: 2,
      name: "WhatsApp Business Token",
      type: "token",
      description: "Authentication token for WhatsApp Business API",
      value: "EAAP4...xyz789",
      agentId: null,
      agentName: "Global",
      lastUsed: "1 hour ago",
    },
    {
      id: 3,
      name: "CRM Database URL",
      type: "database",
      description: "Connection string for customer database",
      value: "postgresql://user:pass@localhost:5432/crm",
      agentId: 2,
      agentName: "Lead Generation",
      lastUsed: "30 minutes ago",
    },
  ]);

  const [prompts, setPrompts] = useState([
    {
      id: 1,
      name: "Customer Support Prompt",
      description: "Default prompt for customer support interactions",
      content: "You are a professional customer support representative. Always be helpful, polite, and solution-oriented. If you cannot resolve an issue, escalate to a human agent.",
      agentId: 1,
      agentName: "Customer Support Agent",
      lastUsed: "5 minutes ago",
    },
    {
      id: 2,
      name: "Lead Qualification Prompt",
      description: "Prompt for qualifying potential leads",
      content: "You are a sales qualification assistant. Your goal is to understand the prospect's needs, budget, and timeline. Ask relevant questions to determine if they are a good fit for our services.",
      agentId: 2,
      agentName: "Lead Generation",
      lastUsed: "20 minutes ago",
    },
    {
      id: 3,
      name: "Appointment Booking Prompt",
      description: "Guide users through booking appointments",
      content: "You are an appointment scheduling assistant. Help users find available time slots and book meetings with our team. Be clear about availability and requirements.",
      agentId: 4,
      agentName: "Appointment Scheduler",
      lastUsed: "1 hour ago",
    },
  ]);

  const togglePasswordVisibility = (id: number) => {
    setShowPassword(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const deleteCredential = (id: number) => {
    setCredentials(prev => prev.filter(cred => cred.id !== id));
    toast({
      title: "Credential Deleted",
      description: "The credential has been removed from the system",
    });
  };

  const deletePrompt = (id: number) => {
    setPrompts(prev => prev.filter(prompt => prompt.id !== id));
    toast({
      title: "Prompt Deleted",
      description: "The prompt template has been removed",
    });
  };

  const getCredentialIcon = (type: string) => {
    switch (type) {
      case "api_key": return <Key className="w-4 h-4 text-blue-400" />;
      case "token": return <Shield className="w-4 h-4 text-green-400" />;
      case "database": return <Shield className="w-4 h-4 text-purple-400" />;
      default: return <Key className="w-4 h-4 text-slate-400" />;
    }
  };

  const maskValue = (value: string, show: boolean) => {
    if (show) return value;
    return value.slice(0, 8) + "..." + value.slice(-4);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Credential & Prompt Management</h1>
          <p className="text-slate-400">Manage API keys, tokens, and prompt templates for your agents</p>
        </div>
      </div>

      <Tabs defaultValue="credentials" className="space-y-6">
        <TabsList className="bg-slate-900/50 border border-slate-800">
          <TabsTrigger value="credentials" className="data-[state=active]:bg-slate-800">
            <Key className="w-4 h-4 mr-2" />
            Credentials
          </TabsTrigger>
          <TabsTrigger value="prompts" className="data-[state=active]:bg-slate-800">
            <MessageSquare className="w-4 h-4 mr-2" />
            Prompts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="credentials" className="space-y-6">
          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Credential
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-white">Add New Credential</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Store API keys, tokens, and other sensitive information securely
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="credName" className="text-slate-300">Credential Name</Label>
                      <Input id="credName" placeholder="e.g., OpenAI API Key" className="bg-slate-800 border-slate-700 text-white" />
                    </div>
                    <div>
                      <Label htmlFor="credType" className="text-slate-300">Type</Label>
                      <Select>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="api_key">API Key</SelectItem>
                          <SelectItem value="token">Token</SelectItem>
                          <SelectItem value="database">Database URL</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="credValue" className="text-slate-300">Value</Label>
                    <Input id="credValue" type="password" placeholder="Enter credential value" className="bg-slate-800 border-slate-700 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="credAgent" className="text-slate-300">Assign to Agent</Label>
                    <Select>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue placeholder="Select agent or keep global" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="global">Global (All Agents)</SelectItem>
                        <SelectItem value="1">Customer Support Agent</SelectItem>
                        <SelectItem value="2">Lead Generation</SelectItem>
                        <SelectItem value="3">Sales Follow-up</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="credDescription" className="text-slate-300">Description</Label>
                    <Textarea id="credDescription" placeholder="What is this credential used for?" className="bg-slate-800 border-slate-700 text-white" />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Add Credential
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {credentials.map((credential) => (
              <Card key={credential.id} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getCredentialIcon(credential.type)}
                      <CardTitle className="text-white">{credential.name}</CardTitle>
                    </div>
                    <Badge className="bg-slate-700 text-slate-300">
                      {credential.agentName}
                    </Badge>
                  </div>
                  <CardDescription className="text-slate-400">
                    {credential.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <code className="text-sm text-slate-300 font-mono">
                        {maskValue(credential.value, showPassword[credential.id])}
                      </code>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => togglePasswordVisibility(credential.id)}
                          className="text-slate-400 hover:text-white"
                        >
                          {showPassword[credential.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(credential.value, credential.name)}
                          className="text-slate-400 hover:text-white"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-slate-400">
                    <p>Last used: {credential.lastUsed}</p>
                  </div>

                  <div className="flex space-x-2 pt-4 border-t border-slate-800">
                    <Button variant="outline" className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      onClick={() => deleteCredential(credential.id)}
                      variant="outline" 
                      className="border-red-800 text-red-400 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="prompts" className="space-y-6">
          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Prompt Template
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-800 max-w-4xl">
                <DialogHeader>
                  <DialogTitle className="text-white">Add New Prompt Template</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Create reusable prompt templates for your n8n agents
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="promptName" className="text-slate-300">Prompt Name</Label>
                      <Input id="promptName" placeholder="e.g., Customer Support Prompt" className="bg-slate-800 border-slate-700 text-white" />
                    </div>
                    <div>
                      <Label htmlFor="promptAgent" className="text-slate-300">Assign to Agent</Label>
                      <Select>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue placeholder="Select agent" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="1">Customer Support Agent</SelectItem>
                          <SelectItem value="2">Lead Generation</SelectItem>
                          <SelectItem value="3">Sales Follow-up</SelectItem>
                          <SelectItem value="4">Appointment Scheduler</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="promptDescription" className="text-slate-300">Description</Label>
                    <Input id="promptDescription" placeholder="Brief description of this prompt's purpose" className="bg-slate-800 border-slate-700 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="promptContent" className="text-slate-300">Prompt Content</Label>
                    <Textarea 
                      id="promptContent" 
                      placeholder="Enter your prompt template here..."
                      className="bg-slate-800 border-slate-700 text-white min-h-[200px]"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Add Prompt Template
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {prompts.map((prompt) => (
              <Card key={prompt.id} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-5 h-5 text-blue-400" />
                      <CardTitle className="text-white">{prompt.name}</CardTitle>
                    </div>
                    <Badge className="bg-slate-700 text-slate-300">
                      {prompt.agentName}
                    </Badge>
                  </div>
                  <CardDescription className="text-slate-400">
                    {prompt.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {prompt.content}
                    </p>
                  </div>

                  <div className="text-sm text-slate-400">
                    <p>Last used: {prompt.lastUsed}</p>
                  </div>

                  <div className="flex space-x-2 pt-4 border-t border-slate-800">
                    <Button
                      onClick={() => copyToClipboard(prompt.content, prompt.name)}
                      variant="outline"
                      className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      onClick={() => deletePrompt(prompt.id)}
                      variant="outline" 
                      className="border-red-800 text-red-400 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Credentials;
