
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // Redirect to appropriate dashboard based on role
        navigate(user.role === "admin" ? "/admin" : "/dashboard");
      } else {
        // Redirect to login if not authenticated
        navigate("/login");
      }
    }
  }, [user, isLoading, navigate]);

  // Show loading state while checking auth
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-primary font-bold text-3xl mb-8">SalaryBox</div>
      <div className="h-12 w-12 rounded-full border-4 border-t-primary border-primary/30 animate-spin" />
      <p className="mt-4 text-muted-foreground">Loading...</p>
    </div>
  );
};

export default Index;
