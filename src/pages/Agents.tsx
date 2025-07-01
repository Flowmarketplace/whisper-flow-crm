
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, Settings, Plus, Search, Activity, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Agents = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [agents, setAgents] = useState([
    {
      id: 1,
      name: "Customer Support Agent",
      description: "Handles customer inquiries and support tickets",
      status: "running",
      webhookUrl: "https://n8n.example.com/webhook/customer-support",
      lastTriggered: "2 minutes ago",
      messagesHandled: 145,
    },
    {
      id: 2,
      name: "Lead Generation",
      description: "Processes new leads and qualification",
      status: "paused",
      webhookUrl: "https://n8n.example.com/webhook/lead-gen",
      lastTriggered: "1 hour ago",
      messagesHandled: 67,
    },
    {
      id: 3,
      name: "Sales Follow-up",
      description: "Automated follow-up sequences for prospects",
      status: "running",
      webhookUrl: "https://n8n.example.com/webhook/sales-followup",
      lastTriggered: "15 minutes ago",
      messagesHandled: 89,
    },
    {
      id: 4,
      name: "Appointment Scheduler",
      description: "Manages meeting bookings and calendar sync",
      status: "stopped",
      webhookUrl: "https://n8n.example.com/webhook/scheduler",
      lastTriggered: "3 hours ago",
      messagesHandled: 23,
    },
  ]);

  const toggleAgent = async (agentId: number) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    console.log(`Toggling agent ${agent.name} from ${agent.status}`);
    
    try {
      // Simulate API call to n8n webhook
      const newStatus = agent.status === "running" ? "paused" : "running";
      
      setAgents(prev => prev.map(a => 
        a.id === agentId 
          ? { ...a, status: newStatus, lastTriggered: newStatus === "running" ? "Just now" : a.lastTriggered }
          : a
      ));

      toast({
        title: "Agent Updated",
        description: `${agent.name} is now ${newStatus}`,
      });
    } catch (error) {
      console.error("Error toggling agent:", error);
      toast({
        title: "Error",
        description: "Failed to update agent status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "paused": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "stopped": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running": return <Activity className="w-3 h-3" />;
      case "paused": return <Pause className="w-3 h-3" />;
      case "stopped": return <AlertCircle className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Agent Management</h1>
          <p className="text-slate-400">Control and monitor your n8n workflow agents</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Agent</DialogTitle>
              <DialogDescription className="text-slate-400">
                Connect a new n8n workflow to your CRM
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="agentName" className="text-slate-300">Agent Name</Label>
                <Input id="agentName" placeholder="e.g., Customer Support Bot" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label htmlFor="description" className="text-slate-300">Description</Label>
                <Textarea id="description" placeholder="What does this agent do?" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label htmlFor="webhookUrl" className="text-slate-300">Webhook URL</Label>
                <Input id="webhookUrl" placeholder="https://n8n.example.com/webhook/..." className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label htmlFor="initialStatus" className="text-slate-300">Initial Status</Label>
                <Select>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="running">Running</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Add Agent
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          placeholder="Search agents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-slate-900/50 border-slate-800 text-white placeholder-slate-400"
        />
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAgents.map((agent) => (
          <Card key={agent.id} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CardTitle className="text-white">{agent.name}</CardTitle>
                  <Badge className={getStatusColor(agent.status)}>
                    {getStatusIcon(agent.status)}
                    <span className="ml-1 capitalize">{agent.status}</span>
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-slate-400 hover:text-white"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
              <CardDescription className="text-slate-400">
                {agent.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Last Triggered</p>
                  <p className="text-white font-medium">{agent.lastTriggered}</p>
                </div>
                <div>
                  <p className="text-slate-400">Messages Handled</p>
                  <p className="text-white font-medium">{agent.messagesHandled}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-800">
                <div className="flex space-x-2">
                  <Button
                    onClick={() => toggleAgent(agent.id)}
                    className={
                      agent.status === "running"
                        ? "flex-1 bg-red-600 hover:bg-red-700"
                        : "flex-1 bg-green-600 hover:bg-green-700"
                    }
                  >
                    {agent.status === "running" ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Agents;
