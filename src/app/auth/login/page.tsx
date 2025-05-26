"use client";

import { AuthForm } from "@/components/auth/auth-form";
import MainLayout from "@/components/layout/main-layout";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push("/");
    }
  }, [isAuthenticated, loading, router]);


  const handleLogin = async (values: any) => {
    const success = await login(values.email, values.password);
    if (success) {
      toast({ title: "Login Successful", description: "Welcome back!" });
      router.push("/");
      return true;
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
      return "Invalid email or password.";
    }
  };
  
  if (loading || (!loading && isAuthenticated)) {
     return (
      <MainLayout>
        <div className="flex justify-center items-center h-full">
          <p>Loading...</p>
        </div>
      </MainLayout>
     );
  }


  return (
    <MainLayout>
      <AuthForm mode="login" onSubmit={handleLogin} />
    </MainLayout>
  );
}
