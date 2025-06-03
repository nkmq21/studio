
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Removed Select
import { Users as UsersIcon, Trash2, Edit3, MessageSquare } from 'lucide-react'; 
import { MOCK_USERS } from '@/lib/mock-data';
import type { User, UserRole } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatDistanceToNow } from 'date-fns';

// const USER_ROLES: UserRole[] = ['renter', 'staff', 'admin']; // Removed USER_ROLES

export default function UserManagementPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    setUsers(MOCK_USERS);
  }, []);

  // Removed handleRoleChange function

  const handleDeleteUserConfirm = (userId: string) => {
    const userName = users.find(u => u.id === userId)?.name || 'User';
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    toast({ title: "User Deleted", description: `${userName} has been removed.` });
    setUserToDelete(null);
  };

  return (
    <AlertDialog open={!!userToDelete} onOpenChange={(isOpen) => {
      if (!isOpen) {
        setUserToDelete(null);
      }
    }}>
      <div className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center">
              <UsersIcon className="h-7 w-7 mr-2 text-primary" /> User Account Management
            </CardTitle>
            <CardDescription>View user details, feedback count, and remove user accounts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead> {/* Still showing Role for context, but not editable here */}
                  <TableHead>Last Login</TableHead>
                  <TableHead className="w-[150px]">Feedback</TableHead> {/* Changed header */}
                  <TableHead className="text-right w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.role === 'admin' ? 'destructive' : user.role === 'staff' ? 'secondary' : 'outline'} 
                          className="capitalize"
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {user.lastLogin ? `${formatDistanceToNow(user.lastLogin, { addSuffix: true })}` : 'N/A'}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {user.feedbackCount !== undefined ? (
                            <div className="flex items-center">
                                <MessageSquare className="h-3.5 w-3.5 mr-1.5 text-muted-foreground/70"/>
                                {`${user.feedbackCount} item(s)`}
                            </div>
                        ) : (
                            'N/A'
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => setUserToDelete(user)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete User</span>
                          </Button>
                        </AlertDialogTrigger>
                        {/* Placeholder for Edit User button if more details are managed */}
                        {/* <Button variant="outline" size="icon" className="ml-2 h-8 w-8">
                          <Edit3 className="h-4 w-4" />
                          <span className="sr-only">Edit User</span>
                        </Button> */}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <AlertDialogContent>
        {userToDelete && (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the account for
                "{userToDelete.name}" ({userToDelete.email}).
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDeleteUserConfirm(userToDelete.id)}>
                Yes, delete user
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}

