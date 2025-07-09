
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Dashboard from "./pages/Dashboard";
import Agents from "./pages/Agents";
import WhatsApp from "./pages/WhatsApp";
import Webhooks from "./pages/Webhooks";
import Credentials from "./pages/Credentials";
import Pipeline from "./pages/Pipeline";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-slate-950">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                <div className="flex items-center h-16 px-6">
                  <SidebarTrigger className="text-slate-400 hover:text-white" />
                  <div className="ml-4">
                    <h1 className="text-xl font-semibold text-white">n8n CRM Control Panel</h1>
                  </div>
                </div>
              </header>
              <main className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/agents" element={<Agents />} />
                  <Route path="/whatsapp" element={<WhatsApp />} />
                  <Route path="/webhooks" element={<Webhooks />} />
                  <Route path="/credentials" element={<Credentials />} />
                  <Route path="/pipeline" element={<Pipeline />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
