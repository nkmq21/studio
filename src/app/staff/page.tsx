
"use client";

import { useEffect } from 'react';
// import MainLayout from '@/components/layout/main-layout'; // Removed
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ClipboardList, Wrench, MessageCircle, UserCheck } from 'lucide-react'; // Example icons

export default function StaffPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace('/auth/login?redirect=/staff');
      } else if (user?.role !== 'staff' && user?.role !== 'admin') { // Admins can also access staff
        router.replace('/');
      }
    }
  }, [user, isAuthenticated, loading, router]);

  if (loading || !isAuthenticated || (user?.role !== 'staff' && user?.role !== 'admin')) {
    return (
        <div className="flex justify-center items-center h-full">
          <p>Loading or unauthorized...</p>
        </div>
    );
  }

  return (
      <div className="space-y-8">
        <div className="mb-8 p-6 bg-card rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-primary mb-2 flex items-center">
            <UserCheck className="w-10 h-10 mr-3" /> Staff Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">Manage rentals, customer support, and bike maintenance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Rentals</CardTitle>
              <ClipboardList className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Placeholder</div>
              <p className="text-xs text-muted-foreground">View and manage active rentals.</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bike Maintenance</CardTitle>
              <Wrench className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Placeholder</div>
              <p className="text-xs text-muted-foreground">Schedule and track bike maintenance.</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customer Support Tickets</CardTitle>
              <MessageCircle className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Placeholder</div>
              <p className="text-xs text-muted-foreground">Respond to customer inquiries.</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Staff Responsibilities Overview</CardTitle>
                <CardDescription>This section is a placeholder for staff-specific tools and information.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    Staff members would typically handle bike check-ins/check-outs, verify customer documentation,
                    perform basic bike inspections, and address immediate customer concerns. This dashboard would
                    provide tools for these tasks.
                </p>
            </CardContent>
        </Card>

      </div>
  );
}
