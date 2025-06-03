
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users as UsersIcon, MessageSquare, CalendarDays } from 'lucide-react'; 
import { MOCK_USERS } from '@/lib/mock-data';
import type { User } from '@/lib/types';
import { formatDistanceToNow, format } from 'date-fns';

export default function StaffUserDirectoryPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Sort users by name for consistent display
    setUsers([...MOCK_USERS].sort((a, b) => a.name.localeCompare(b.name)));
  }, []);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center">
            <UsersIcon className="h-7 w-7 mr-2 text-primary" /> Customer Directory
          </CardTitle>
          <CardDescription>View customer details and their interaction history.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[220px]">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Registered On</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="w-[150px]">Feedback</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {user.createdAt ? format(new Date(user.createdAt), 'PP') : 'N/A'}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {user.lastLogin ? `${formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true })}` : 'N/A'}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {user.feedbackCount !== undefined && user.feedbackCount > 0 ? (
                          <div className="flex items-center">
                              <MessageSquare className="h-3.5 w-3.5 mr-1.5 text-muted-foreground/70"/>
                              {`${user.feedbackCount} item(s)`}
                          </div>
                      ) : (
                         <span className="text-muted-foreground/60">None</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
