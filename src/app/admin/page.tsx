"use client";

import { useEffect } from 'react';
import MainLayout from '@/components/layout/main-layout';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldAlert, Users, Settings, BarChart3 } from 'lucide-react'; // Example icons

export default function AdminPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace('/auth/login?redirect=/admin');
      } else if (user?.role !== 'admin') {
        // Redirect to home or an unauthorized page if not admin
        router.replace('/'); 
      }
    }
  }, [user, isAuthenticated, loading, router]);

  if (loading || !isAuthenticated || user?.role !== 'admin') {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-full">
          <p>Loading or unauthorized...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="mb-8 p-6 bg-card rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-primary mb-2 flex items-center">
            <ShieldAlert className="w-10 h-10 mr-3 text-destructive" /> Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">Manage users, bikes, rentals, and site settings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Manage Users</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Placeholder</div>
              <p className="text-xs text-muted-foreground">View, edit, and manage user accounts.</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bike Catalog Management</CardTitle>
              <BikeIcon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Placeholder</div>
              <p className="text-xs text-muted-foreground">Add, edit, and remove bikes.</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rental Operations</CardTitle>
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Placeholder</div>
              <p className="text-xs text-muted-foreground">Oversee all rental activities.</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Site Settings</CardTitle>
              <Settings className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Placeholder</div>
              <p className="text-xs text-muted-foreground">Configure platform settings.</p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Admin Actions Overview</CardTitle>
                <CardDescription>This section is a placeholder for more detailed admin functionalities.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    Future enhancements could include user role management, bike availability calendars, rental analytics,
                    dispute resolution tools, and integration with payment gateways for financial reporting.
                </p>
            </CardContent>
        </Card>

      </div>
    </MainLayout>
  );
}

// Minimal BikeIcon for placeholder
const BikeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="5.5" cy="17.5" r="3.5"/>
    <circle cx="18.5" cy="17.5" r="3.5"/>
    <path d="M15 6l-4 6h2l-2 4h3l1-5h3v-2h-4.6L15 6zM9 6l-1 2h3l1-2H9z"/>
  </svg>
);
