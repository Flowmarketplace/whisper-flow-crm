
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Play, Pause, Settings, Search, Activity, AlertCircle, Video, Image, Power, PowerOff, ChevronDown, Zap, Send, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PhoneMockup from "@/components/PhoneMockup";
import ToolIcon from "@/components/ToolIcon";
import { supabase } from "@/integrations/supabase/client";

const Agents = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [webhookTesting, setWebhookTesting] = useState<{ [key: string]: boolean }>({});
  const [webhookResults, setWebhookResults] = useState<{ [key: string]: { success: boolean, message: string, timestamp: string } | null }>({});
  const [agents, setAgents] = useState<any[]>([]);
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load agents and credentials from Supabase
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load credentials
      const { data: credData, error: credError } = await supabase
        .from('n8n_credentials')
        .select('*')
        .eq('is_active', true);

      if (credError) throw credError;
      setCredentials(credData || []);

      // Load agents with their credentials
      const { data: agentData, error: agentError } = await supabase
        .from('n8n_agents')
        .select(`
          *,
          n8n_credentials (
            name,
            base_url
          )
        `);

      if (agentError) throw agentError;
      
      // Add mock data for demo if no data exists
      if (!agentData || agentData.length === 0) {
        setAgents([
          {
            id: 1,
            name: "Zárate Publicidad Panamá",
            description: "Asistente de atención al cliente para servicios de impresión digital. Maneja consultas sobre productos, cotizaciones y soporte técnico las 24 horas.",
            status: "running",
            webhookUrl: "https://n8n-n8n.sax8vb.easypanel.host/webhook/Zarate-panama",
            lastTriggered: "2 minutes ago",
            messagesHandled: 145,
            tools: ["WhatsApp", "OpenAI GPT-4", "Evolution API", "Postgres", "Webhook"],
            image: "/api/placeholder/400/240",
            video: "/api/placeholder/video/demo.mp4",
            phoneDemo: [
              { id: 1, content: "Hola 👋 Gracias por escribir a Zárate Publicidad Panamá 🖨", sender: "bot" as const, timestamp: "10:30" },
              { id: 2, content: "Buenos días, necesito un banner de 3x2 metros", sender: "user" as const, timestamp: "10:31" },
              { id: 3, content: "Perfecto ✅ Para ayudarte mejor, ¿es para interior o exterior?", sender: "bot" as const, timestamp: "10:31" },
              { id: 4, content: "Para exterior", sender: "user" as const, timestamp: "10:32" },
              { id: 5, content: "¡Excelente! Te envío una cotización en breve 📋", sender: "bot" as const, timestamp: "10:32" }
            ]
          },
          {
            id: 2,
            name: "Lead Qualification System",
            description: "Sistema automatizado para calificar leads entrantes. Analiza información de contacto, hace preguntas de calificación y deriva a los vendedores apropiados.",
            status: "paused",
            webhookUrl: "https://n8n.example.com/webhook/lead-gen",
            lastTriggered: "1 hour ago",
            messagesHandled: 67,
            tools: ["Google Sheets", "OpenAI GPT-4", "Gmail", "Webhook", "Zapier"],
            image: "/api/placeholder/400/240",
            video: "/api/placeholder/video/leads.mp4",
            phoneDemo: [
              { id: 1, content: "¡Hola! Veo que estás interesado en nuestros servicios", sender: "bot" as const, timestamp: "14:20" },
              { id: 2, content: "Sí, me gustaría saber más sobre sus productos", sender: "user" as const, timestamp: "14:21" },
              { id: 3, content: "¿Cuál es el tamaño de tu empresa?", sender: "bot" as const, timestamp: "14:21" },
              { id: 4, content: "Somos una empresa mediana, unos 50 empleados", sender: "user" as const, timestamp: "14:22" },
              { id: 5, content: "Perfecto, te conectaré con nuestro especialista", sender: "bot" as const, timestamp: "14:22" }
            ]
          }
        ]);
      } else {
        setAgents(agentData);
      }
      
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load agents data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Toggle agent status with Supabase integration
  const toggleAgent = async (agentId: number | string) => {
    try {
      const agent = agents.find(a => a.id === agentId);
      if (!agent) return;

      const newStatus = agent.status === "running" ? "paused" : "running";
      
      // If it's a real agent from Supabase, update the database
      if (typeof agentId === 'string') {
        const { data, error } = await supabase.functions.invoke('n8n-api', {
          body: {
            action: newStatus === "running" ? 'activate_workflow' : 'deactivate_workflow',
            credentialId: agent.credential_id,
            workflowId: agent.workflow_id
          }
        });

        if (error) throw error;

        // Update agent status in database
        const { error: updateError } = await supabase
          .from('n8n_agents')
          .update({ status: newStatus })
          .eq('id', agentId);

        if (updateError) throw updateError;
      }
      
      // Update local state
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

  // Test webhook with Supabase integration
  const testWebhook = async (agentId: number | string) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent || !agent.webhookUrl) return;

    setWebhookTesting(prev => ({ ...prev, [agentId]: true }));
    
    try {
      let response;
      
      // If it's a real agent from Supabase, use the edge function
      if (typeof agentId === 'string' && agent.credential_id) {
        const { data, error } = await supabase.functions.invoke('n8n-api', {
          body: {
            action: 'test_webhook',
            credentialId: agent.credential_id,
            workflowId: agent.workflow_id,
            data: { test: true, timestamp: new Date().toISOString() }
          }
        });

        if (error) throw error;
        
        setWebhookResults(prev => ({ 
          ...prev, 
          [agentId]: {
            success: true,
            message: "Webhook test completed successfully",
            timestamp: new Date().toLocaleString()
          }
        }));
      } else {
        // Mock webhook test for demo agents
        response = await fetch(agent.webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            test: true,
            agent_id: agentId,
            agent_name: agent.name,
            timestamp: new Date().toISOString(),
            message: "Prueba de webhook desde la plataforma"
          }),
        });

        const success = response.ok;
        const message = success ? "Webhook activado exitosamente" : `Error: ${response.status} ${response.statusText}`;
        
        setWebhookResults(prev => ({
          ...prev,
          [agentId]: {
            success,
            message,
            timestamp: new Date().toLocaleString()
          }
        }));
      }

      toast({
        title: "Webhook Test",
        description: "Webhook test completed",
      });

    } catch (error) {
      const message = `Error de conexión: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setWebhookResults(prev => ({
        ...prev,
        [agentId]: {
          success: false,
          message,
          timestamp: new Date().toLocaleString()
        }
      }));

      toast({
        title: "Error en Webhook",
        description: message,
        variant: "destructive",
      });
    } finally {
      setWebhookTesting(prev => ({ ...prev, [agentId]: false }));
    }
  };

  // Update webhook URL with Supabase integration
  const updateWebhookUrl = async (agentId: number | string, newUrl: string) => {
    try {
      // If it's a real agent from Supabase, update the database
      if (typeof agentId === 'string') {
        const { error } = await supabase
          .from('n8n_agents')
          .update({ webhook_url: newUrl })
          .eq('id', agentId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Webhook URL updated",
        });
      }

      // Update local state
      setAgents(prev => prev.map(agent => 
        agent.id === agentId 
          ? { ...agent, webhookUrl: newUrl }
          : agent
      ));

    } catch (error) {
      console.error('Error updating webhook URL:', error);
      toast({
        title: "Error",
        description: "Failed to update webhook URL",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "paused": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "stopped": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-muted text-muted-foreground border-border";
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
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Gestión de Agentes</h1>
          <p className="text-muted-foreground text-lg">
            Controla y monitorea tus agentes de automatización inteligente
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar agentes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        {/* Agents */}
        <div className="space-y-12">
          {filteredAgents.map((agent) => (
            <div key={agent.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
                
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Header with Status */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <h2 className="text-2xl font-bold text-card-foreground">{agent.name}</h2>
                        <Badge className={getStatusColor(agent.status)}>
                          {getStatusIcon(agent.status)}
                          <span className="ml-2 capitalize">{agent.status}</span>
                        </Badge>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {agent.description}
                      </p>
                    </div>
                    
                    {/* Power Switch */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <PowerOff className="w-4 h-4 text-muted-foreground" />
                        <Switch
                          checked={agent.status === "running"}
                          onCheckedChange={() => toggleAgent(agent.id)}
                        />
                        <Power className="w-4 h-4 text-emerald-500" />
                      </div>
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Tools Section */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-card-foreground flex items-center">
                      <Settings className="w-5 h-5 mr-2" />
                      Herramientas Conectadas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {agent.tools.map((tool, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-secondary px-3 py-2 rounded-lg">
                          <ToolIcon toolName={tool} className="w-4 h-4 text-secondary-foreground" />
                          <span className="text-sm font-medium text-secondary-foreground">{tool}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Media Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Image */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-card-foreground flex items-center">
                        <Image className="w-5 h-5 mr-2" />
                        Vista del Flujo
                      </h3>
                      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                        <img 
                          src={agent.image} 
                          alt={`${agent.name} workflow`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    </div>

                    {/* Video */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-card-foreground flex items-center">
                        <Video className="w-5 h-5 mr-2" />
                        Demo Explicativo
                      </h3>
                      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                        <video 
                          src={agent.video} 
                          className="w-full h-full object-cover"
                          controls
                          poster={agent.image}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Webhook Testing Section */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <Collapsible>
                      <CollapsibleTrigger className="flex items-center space-x-2 w-full">
                        <Button variant="outline" className="w-full justify-between">
                          <div className="flex items-center space-x-2">
                            <Zap className="w-4 h-4" />
                            <span>Probar Webhook N8N</span>
                          </div>
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-4 pt-4">
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-card-foreground">URL del Webhook</label>
                          <div className="flex space-x-2">
                            <Input
                              value={agent.webhookUrl}
                              onChange={(e) => updateWebhookUrl(agent.id, e.target.value)}
                              placeholder="https://tu-n8n-instance.com/webhook/tu-webhook"
                              className="flex-1"
                            />
                            <Button 
                              onClick={() => testWebhook(agent.id)}
                              disabled={webhookTesting[agent.id] || !agent.webhookUrl}
                              className="shrink-0"
                            >
                              {webhookTesting[agent.id] ? (
                                <>
                                  <Activity className="w-4 h-4 mr-2 animate-spin" />
                                  Probando...
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4 mr-2" />
                                  Probar
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        {webhookResults[agent.id] && (
                          <div className={`p-4 rounded-lg border ${
                            webhookResults[agent.id]?.success 
                              ? 'bg-emerald-500/10 border-emerald-500/20' 
                              : 'bg-red-500/10 border-red-500/20'
                          }`}>
                            <div className="flex items-start space-x-3">
                              {webhookResults[agent.id]?.success ? (
                                <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                              )}
                              <div className="flex-1">
                                <p className={`font-medium ${
                                  webhookResults[agent.id]?.success 
                                    ? 'text-emerald-700 dark:text-emerald-300' 
                                    : 'text-red-700 dark:text-red-300'
                                }`}>
                                  {webhookResults[agent.id]?.message}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {webhookResults[agent.id]?.timestamp}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-card-foreground">{agent.messagesHandled}</p>
                      <p className="text-sm text-muted-foreground">Mensajes Procesados</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-card-foreground">{agent.lastTriggered}</p>
                      <p className="text-sm text-muted-foreground">Última Actividad</p>
                    </div>
                  </div>
                </div>

                {/* Phone Mockup */}
                <div className="flex justify-center">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-card-foreground text-center">
                      Ejemplo en Vivo
                    </h3>
                    <PhoneMockup 
                      messages={agent.phoneDemo} 
                      agentName={agent.name}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Agents;
