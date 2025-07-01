
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-full flex items-center justify-center bg-slate-950 p-6">
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-white">404</h1>
          <h2 className="text-2xl font-semibold text-slate-300">Page Not Found</h2>
          <p className="text-slate-400 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved to a different location.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => window.history.back()}
            variant="outline" 
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Home className="w-4 h-4 mr-2" />
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
