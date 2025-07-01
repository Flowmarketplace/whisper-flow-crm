
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Activity, Bot, MessageCircle, Webhook, Play, Pause, AlertCircle, CheckCircle2 } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeAgents: 5,
    totalAgents: 8,
    messagesPerHour: 24,
    webhooksConnected: 3,
    totalWebhooks: 4,
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: "agent", message: "Customer Support Agent activated", time: "2 minutes ago", status: "success" },
    { id: 2, type: "whatsapp", message: "New WhatsApp message received", time: "5 minutes ago", status: "info" },
    { id: 3, type: "webhook", message: "Lead Generation webhook triggered", time: "8 minutes ago", status: "success" },
    { id: 4, type: "agent", message: "Sales Follow-up Agent paused", time: "12 minutes ago", status: "warning" },
  ]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "agent": return <Bot className="w-4 h-4" />;
      case "whatsapp": return <MessageCircle className="w-4 h-4" />;
      case "webhook": return <Webhook className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "text-green-400";
      case "warning": return "text-yellow-400";
      case "error": return "text-red-400";
      default: return "text-blue-400";
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Overview of your n8n workflow management system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Active Agents</CardTitle>
            <Bot className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">{stats.activeAgents}</div>
            <div className="flex items-center space-x-2">
              <Progress value={(stats.activeAgents / stats.totalAgents) * 100} className="flex-1 h-2" />
              <span className="text-xs text-slate-400">{stats.totalAgents} total</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Messages/Hour</CardTitle>
            <MessageCircle className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">{stats.messagesPerHour}</div>
            <p className="text-xs text-slate-400">WhatsApp activity</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Webhooks</CardTitle>
            <Webhook className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">{stats.webhooksConnected}</div>
            <div className="flex items-center space-x-2">
              <Progress value={(stats.webhooksConnected / stats.totalWebhooks) * 100} className="flex-1 h-2" />
              <span className="text-xs text-slate-400">{stats.totalWebhooks} configured</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">System Status</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400 mb-1">Online</div>
            <p className="text-xs text-slate-400">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-slate-400">
              Common tasks and controls
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              <Play className="w-4 h-4 mr-2" />
              Start All Agents
            </Button>
            <Button variant="outline" className="w-full justify-start border-slate-700 text-slate-300 hover:bg-slate-800">
              <Pause className="w-4 h-4 mr-2" />
              Pause All Agents
            </Button>
            <Button variant="outline" className="w-full justify-start border-slate-700 text-slate-300 hover:bg-slate-800">
              <MessageCircle className="w-4 h-4 mr-2" />
              View WhatsApp Chat
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-slate-400">
              Latest system events and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-800/50">
                  <div className={`mt-0.5 ${getStatusColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">{activity.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
