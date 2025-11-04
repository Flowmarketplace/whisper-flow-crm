
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Bot, 
  MessageCircle, 
  Webhook, 
  Key, 
  Activity,
  GitBranch,
  LogOut,
  User
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Agents", url: "/agents", icon: Bot },
  { title: "WhatsApp", url: "/whatsapp", icon: MessageCircle },
  { title: "Pipeline", url: "/pipeline", icon: GitBranch },
  { title: "Webhooks", url: "/webhooks", icon: Webhook },
  { title: "Credentials", url: "/credentials", icon: Key },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium shadow-lg" 
      : "hover:bg-sidebar-accent text-sidebar-foreground hover:text-primary transition-all duration-200";

  return (
    <Sidebar className={`${collapsed ? "w-16" : "w-64"} bg-sidebar border-r border-sidebar-border`}>
      <SidebarContent className="p-2">
        <div className="mb-8 px-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="text-sidebar-foreground font-bold text-lg">n8n CRM</h2>
                <p className="text-muted-foreground text-xs">Control Panel</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground text-xs uppercase tracking-wider mb-2">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="p-0">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${getNavCls({ isActive: isActive(item.url) })}`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        {!collapsed && (
          <>
            <div className="flex items-center gap-2 mb-2 text-sidebar-foreground">
              <User size={16} />
              <span className="text-sm truncate">{user?.email}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={signOut}
              className="w-full border-sidebar-border text-sidebar-foreground hover:text-primary hover:bg-sidebar-accent"
            >
              <LogOut size={16} className="mr-2" />
              Cerrar Sesión
            </Button>
          </>
        )}
        {collapsed && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={signOut}
            className="w-full border-sidebar-border text-sidebar-foreground hover:text-primary hover:bg-sidebar-accent p-2"
          >
            <LogOut size={16} />
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
