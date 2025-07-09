import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners, useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, Filter, Settings, MessageCircle, User, Clock, Phone, Tag, MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Conversation {
  id: string;
  customerName: string;
  phone: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  tags: string[];
  priority: "high" | "medium" | "low";
  source: string;
}

interface PipelineStage {
  id: string;
  name: string;
  color: string;
  conversations: Conversation[];
}

const SortableConversation = ({ conversation }: { conversation: Conversation }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: conversation.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-3 cursor-grab active:cursor-grabbing hover:bg-slate-800/70 transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
            {conversation.avatar}
          </div>
          <div>
            <h4 className="text-white font-medium text-sm">{conversation.customerName}</h4>
            <p className="text-slate-400 text-xs flex items-center">
              <Phone className="w-3 h-3 mr-1" />
              {conversation.phone}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Badge className={getPriorityColor(conversation.priority)}>
            {conversation.priority}
          </Badge>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-slate-400 hover:text-white">
            <MoreVertical className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      <div className="mb-3">
        <p className="text-slate-300 text-sm overflow-hidden" style={{ 
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {conversation.lastMessage}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {conversation.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs border-slate-600 text-slate-300">
              <Tag className="w-2 h-2 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center text-slate-400 text-xs">
          <Clock className="w-3 h-3 mr-1" />
          {conversation.timestamp}
        </div>
      </div>
    </div>
  );
};

const DroppableStageColumn = ({ stage, children }: { stage: PipelineStage; children: React.ReactNode }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`transition-colors duration-200 ${isOver ? 'bg-slate-800/30' : ''}`}
    >
      {children}
    </div>
  );
};

const Pipeline = () => {
  const { toast } = useToast();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [stages, setStages] = useState<PipelineStage[]>([
    {
      id: "initial-contact",
      name: "Contacto Inicial",
      color: "purple",
      conversations: [
        {
          id: "conv-1",
          customerName: "María García",
          phone: "+1 (555) 123-4567",
          avatar: "MG",
          lastMessage: "Hola, estoy interesada en sus servicios de automatización",
          timestamp: "5m ago",
          tags: ["nuevo", "automatización"],
          priority: "high",
          source: "WhatsApp",
        },
        {
          id: "conv-2",
          customerName: "Carlos López",
          phone: "+1 (555) 987-6543",
          avatar: "CL",
          lastMessage: "¿Pueden ayudarme con la integración de n8n?",
          timestamp: "12m ago",
          tags: ["n8n", "integración"],
          priority: "medium",
          source: "WhatsApp",
        },
      ],
    },
    {
      id: "qualification",
      name: "Calificación",
      color: "blue",
      conversations: [
        {
          id: "conv-3",
          customerName: "Ana Martínez",
          phone: "+1 (555) 456-7890",
          avatar: "AM",
          lastMessage: "Tengo un presupuesto de $5000 para automatización",
          timestamp: "30m ago",
          tags: ["presupuesto", "calificado"],
          priority: "high",
          source: "WhatsApp",
        },
      ],
    },
    {
      id: "proposal",
      name: "Propuesta",
      color: "orange",
      conversations: [
        {
          id: "conv-4",
          customerName: "Roberto Silva",
          phone: "+1 (555) 321-0987",
          avatar: "RS",
          lastMessage: "La propuesta se ve bien, ¿cuándo podemos empezar?",
          timestamp: "1h ago",
          tags: ["propuesta", "interesado"],
          priority: "high",
          source: "WhatsApp",
        },
      ],
    },
    {
      id: "negotiation",
      name: "Negociación",
      color: "yellow",
      conversations: [],
    },
    {
      id: "closed-won",
      name: "Cerrado Ganado",
      color: "green",
      conversations: [],
    },
    {
      id: "closed-lost",
      name: "Cerrado Perdido",
      color: "red",
      conversations: [],
    },
  ]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the source stage and conversation
    const sourceStage = stages.find(stage => 
      stage.conversations.some(conv => conv.id === activeId)
    );
    
    const conversation = sourceStage?.conversations.find(conv => conv.id === activeId);
    
    if (!conversation || !sourceStage) {
      setActiveId(null);
      return;
    }

    // Find target stage
    const targetStage = stages.find(stage => stage.id === overId);
    
    if (!targetStage || sourceStage.id === targetStage.id) {
      setActiveId(null);
      return;
    }

    // Update stages
    setStages(prevStages => {
      return prevStages.map(stage => {
        if (stage.id === sourceStage.id) {
          return {
            ...stage,
            conversations: stage.conversations.filter(conv => conv.id !== activeId)
          };
        }
        if (stage.id === targetStage.id) {
          return {
            ...stage,
            conversations: [...stage.conversations, conversation]
          };
        }
        return stage;
      });
    });

    toast({
      title: "Conversación Movida",
      description: `${conversation.customerName} movido a ${targetStage.name}`,
    });

    setActiveId(null);
  };

  const activeConversation = activeId ? 
    stages.flatMap(stage => stage.conversations).find(conv => conv.id === activeId) : 
    null;

  const getStageColor = (color: string) => {
    const colors = {
      purple: "border-t-purple-500",
      blue: "border-t-blue-500",
      orange: "border-t-orange-500",
      yellow: "border-t-yellow-500",
      green: "border-t-green-500",
      red: "border-t-red-500",
    };
    return colors[color as keyof typeof colors] || "border-t-slate-500";
  };

  return (
    <div className="p-6 bg-slate-950 min-h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Pipeline de Conversaciones</h1>
          <p className="text-slate-400">Gestiona el flujo de conversaciones de WhatsApp</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                <Settings className="w-4 h-4 mr-2" />
                Configurar Etapas
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Configurar Etapas del Pipeline</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Personaliza las etapas de tu pipeline de ventas
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stageName" className="text-slate-300">Nombre de la Etapa</Label>
                    <Input id="stageName" placeholder="e.g., Seguimiento" className="bg-slate-800 border-slate-700 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="stageColor" className="text-slate-300">Color</Label>
                    <Select>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue placeholder="Seleccionar color" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="purple">Púrpura</SelectItem>
                        <SelectItem value="blue">Azul</SelectItem>
                        <SelectItem value="green">Verde</SelectItem>
                        <SelectItem value="orange">Naranja</SelectItem>
                        <SelectItem value="red">Rojo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Etapa
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <DndContext 
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {stages.map((stage) => (
            <DroppableStageColumn key={stage.id} stage={stage}>
              <Card 
                className={`bg-slate-900/50 border-slate-800 backdrop-blur-sm border-t-4 ${getStageColor(stage.color)} min-h-[600px]`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">{stage.name}</CardTitle>
                    <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                      {stage.conversations.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <SortableContext 
                    items={stage.conversations.map(conv => conv.id)} 
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {stage.conversations.map((conversation) => (
                        <SortableConversation key={conversation.id} conversation={conversation} />
                      ))}
                    </div>
                  </SortableContext>
                  {stage.conversations.length === 0 && (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-500 text-sm">No hay conversaciones</p>
                      <p className="text-slate-600 text-xs">Arrastra conversaciones aquí</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </DroppableStageColumn>
          ))}
        </div>

        <DragOverlay>
          {activeConversation ? (
            <div className="bg-slate-800/90 border border-slate-600 rounded-lg p-4 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {activeConversation.avatar}
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">{activeConversation.customerName}</h4>
                  <p className="text-slate-400 text-xs">{activeConversation.phone}</p>
                </div>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Pipeline;