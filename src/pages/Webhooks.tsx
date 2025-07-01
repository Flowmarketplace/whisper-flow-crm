
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Webhook, Plus, Send, Settings, Activity, AlertCircle, CheckCircle2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Webhooks = () => {
  const { toast } = useToast();
  const [webhooks, setWebhooks] = useState([
    {
      id: 1,
      name: "Customer Support Webhook",
      url: "https://n8n.example.com/webhook/customer-support",
      description: "Handles customer inquiry triggers",
      status: "active",
      lastTriggered: "2 minutes ago",
      totalTriggers: 145,
      method: "POST",
    },
    {
      id: 2,
      name: "Lead Generation Webhook",
      url: "https://n8n.example.com/webhook/lead-generation",
      description: "Processes new lead notifications",
      status: "active",
      lastTriggered: "15 minutes ago",
      totalTriggers: 89,
      method: "POST",
    },
    {
      id: 3,
      name: "Sales Pipeline Webhook",
      url: "https://n8n.example.com/webhook/sales-pipeline",
      description: "Updates sales pipeline status",
      status: "inactive",
      lastTriggered: "2 hours ago",
      totalTriggers: 67,
      method: "POST",
    },
  ]);

  const [testPayload, setTestPayload] = useState(`{
  "credentials": {
    "apiKey": "test-api-key",
    "token": "test-token"
  },
  "prompt": "You are a helpful customer support assistant. Respond professionally and helpfully to customer inquiries.",
  "context": {
    "source": "CRM",
    "timestamp": "${new Date().toISOString()}"
  }
}`);

  const testWebhook = async (webhook: any) => {
    console.log(`Testing webhook: ${webhook.name}`, webhook.url);
    
    try {
      const response = await fetch(webhook.url, {
        method: webhook.method,
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: testPayload,
      });

      toast({
        title: "Webhook Triggered",
        description: `Test payload sent to ${webhook.name}`,
      });

      // Update last triggered time
      setWebhooks(prev => prev.map(w => 
        w.id === webhook.id 
          ? { ...w, lastTriggered: "Just now", totalTriggers: w.totalTriggers + 1 }
          : w
      ));

    } catch (error) {
      console.error("Error testing webhook:", error);
      toast({
        title: "Test Failed",
        description: "Failed to trigger webhook. Please check the URL and try again.",
        variant: "destructive",
      });
    }
  };

  const copyWebhookUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Copied!",
      description: "Webhook URL copied to clipboard",
    });
  };

  const toggleWebhookStatus = (webhookId: number) => {
    setWebhooks(prev => prev.map(w => 
      w.id === webhookId 
        ? { ...w, status: w.status === "active" ? "inactive" : "active" }
        : w
    ));
    
    const webhook = webhooks.find(w => w.id === webhookId);
    toast({
      title: "Status Updated",
      description: `${webhook?.name} is now ${webhook?.status === "active" ? "inactive" : "active"}`,
    });
  };

  const getStatusColor = (status: string) => {
    return status === "active" 
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : "bg-slate-500/20 text-slate-400 border-slate-500/30";
  };

  const getStatusIcon = (status: string) => {
    return status === "active" 
      ? <CheckCircle2 className="w-3 h-3" />
      : <AlertCircle className="w-3 h-3" />;
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Webhook Management</h1>
          <p className="text-slate-400">Configure and test your n8n webhook connections</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Webhook</DialogTitle>
              <DialogDescription className="text-slate-400">
                Connect a new n8n webhook to your CRM system
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="webhookName" className="text-slate-300">Webhook Name</Label>
                  <Input id="webhookName" placeholder="e.g., Lead Processing" className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div>
                  <Label htmlFor="method" className="text-slate-300">HTTP Method</Label>
                  <Select>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="webhookUrl" className="text-slate-300">Webhook URL</Label>
                <Input id="webhookUrl" placeholder="https://n8n.example.com/webhook/..." className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label htmlFor="description" className="text-slate-300">Description</Label>
                <Textarea id="description" placeholder="What does this webhook do?" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label htmlFor="initialPayload" className="text-slate-300">Initial Payload (JSON)</Label>
                <Textarea 
                  id="initialPayload" 
                  placeholder='{"key": "value"}' 
                  className="bg-slate-800 border-slate-700 text-white font-mono text-sm"
                  rows={6}
                />
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Add Webhook
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Test Payload Configuration */}
      <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Global Test Payload
          </CardTitle>
          <CardDescription className="text-slate-400">
            Configure the default payload sent when testing webhooks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Label htmlFor="testPayload" className="text-slate-300">JSON Payload</Label>
            <Textarea
              id="testPayload"
              value={testPayload}
              onChange={(e) => setTestPayload(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white font-mono text-sm"
              rows={8}
            />
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              Save Payload Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Webhooks List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {webhooks.map((webhook) => (
          <Card key={webhook.id} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Webhook className="w-5 h-5 text-blue-400" />
                  <CardTitle className="text-white">{webhook.name}</CardTitle>
                </div>
                <Badge className={getStatusColor(webhook.status)}>
                  {getStatusIcon(webhook.status)}
                  <span className="ml-1 capitalize">{webhook.status}</span>
                </Badge>
              </div>
              <CardDescription className="text-slate-400">
                {webhook.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-800/50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      {webhook.method}
                    </Badge>
                    <code className="text-sm text-slate-300 truncate max-w-[200px]">
                      {webhook.url}
                    </code>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => copyWebhookUrl(webhook.url)}
                    className="text-slate-400 hover:text-white"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Last Triggered</p>
                  <p className="text-white font-medium">{webhook.lastTriggered}</p>
                </div>
                <div>
                  <p className="text-slate-400">Total Triggers</p>
                  <p className="text-white font-medium">{webhook.totalTriggers}</p>
                </div>
              </div>

              <div className="flex space-x-2 pt-4 border-t border-slate-800">
                <Button
                  onClick={() => testWebhook(webhook)}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Test
                </Button>
                <Button
                  onClick={() => toggleWebhookStatus(webhook.id)}
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  {webhook.status === "active" ? (
                    <>
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Disable
                    </>
                  ) : (
                    <>
                      <Activity className="w-4 h-4 mr-2" />
                      Enable
                    </>
                  )}
                </Button>
                <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Webhooks;
