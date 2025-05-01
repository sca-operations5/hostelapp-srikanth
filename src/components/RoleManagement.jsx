
      import React, { useState, useEffect } from 'react';
      import { supabase } from '@/lib/supabaseClient';
      import { motion } from 'framer-motion';
      import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
      import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
      import { Skeleton } from "@/components/ui/skeleton";
      import { useToast } from "@/components/ui/use-toast";
      import { ShieldCheck, CheckCircle, XCircle } from 'lucide-react';
      import { useAuth } from '@/contexts/AuthContext'; // Import useAuth to check admin role

      const RoleManagement = () => {
          const [roles, setRoles] = useState([]);
          const [permissions, setPermissions] = useState([]);
          const [isLoading, setIsLoading] = useState(true);
          const { toast } = useToast();
          const { user } = useAuth(); // Get user info

          useEffect(() => {
              const fetchData = async () => {
                  setIsLoading(true);
                  try {
                      // Fetch Roles
                      const { data: rolesData, error: rolesError } = await supabase
                          .from('roles')
                          .select('*')
                          .order('name');
                      if (rolesError) throw rolesError;
                      setRoles(rolesData || []);

                      // Fetch Permissions
                      const { data: permissionsData, error: permissionsError } = await supabase
                          .from('role_permissions')
                          .select(`
                              *,
                              roles ( name )
                          `)
                          .order('role_id')
                          .order('module');
                      if (permissionsError) throw permissionsError;
                      setPermissions(permissionsData || []);

                  } catch (error) {
                      toast({
                          title: "Error fetching role data",
                          description: error.message,
                          variant: "destructive",
                      });
                      setRoles([]);
                      setPermissions([]);
                  } finally {
                      setIsLoading(false);
                  }
              };

              // Only fetch data if user is admin (basic check for now)
              if (user?.role === 'admin') {
                 fetchData();
              } else {
                 setIsLoading(false); // Don't load if not admin
              }
          }, [toast, user]);

           // Group permissions by role for easier display
           const permissionsByRole = permissions.reduce((acc, perm) => {
               const roleName = perm.roles.name;
               if (!acc[roleName]) {
                   acc[roleName] = [];
               }
               acc[roleName].push(perm);
               return acc;
           }, {});

           if (user?.role !== 'admin') {
              return (
                 <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                    className="container mx-auto p-4 md:p-6"
                 >
                    <Card className="border-destructive bg-destructive/10">
                         <CardHeader>
                             <CardTitle className="text-destructive">Access Denied</CardTitle>
                             <CardDescription>You do not have permission to manage roles.</CardDescription>
                         </CardHeader>
                     </Card>
                 </motion.div>
               );
           }

          return (
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="container mx-auto p-4 md:p-6 space-y-6"
              >
                  <h1 className="text-3xl font-bold text-primary flex items-center">
                     <ShieldCheck className="mr-3 h-8 w-8"/> Role Management (Admin View)
                  </h1>
                  <CardDescription>View roles and their assigned permissions. Editing functionality coming soon.</CardDescription>

                  {isLoading ? (
                      <Skeleton className="h-64 w-full" />
                  ) : Object.keys(permissionsByRole).length === 0 ? (
                       <p className="text-center text-muted-foreground py-4">No roles or permissions found.</p>
                  ) : (
                      roles.map(role => (
                          <Card key={role.id} className="shadow-lg border-none">
                              <CardHeader>
                                  <CardTitle className="text-xl text-primary">{role.name}</CardTitle>
                                   <CardDescription>{role.description || 'No description'}</CardDescription>
                              </CardHeader>
                              <CardContent>
                                  {permissionsByRole[role.name] && permissionsByRole[role.name].length > 0 ? (
                                      <div className="overflow-x-auto">
                                          <Table>
                                              <TableHeader>
                                                  <TableRow>
                                                      <TableHead>Module</TableHead>
                                                      <TableHead className="text-center">Read</TableHead>
                                                      <TableHead className="text-center">Create</TableHead>
                                                      <TableHead className="text-center">Update</TableHead>
                                                      <TableHead className="text-center">Delete</TableHead>
                                                  </TableRow>
                                              </TableHeader>
                                              <TableBody>
                                                  {permissionsByRole[role.name].map(perm => (
                                                      <TableRow key={perm.id}>
                                                          <TableCell className="font-medium capitalize">{perm.module.replace(/_/g, ' ')}</TableCell>
                                                          <TableCell className="text-center">{perm.can_read ? <CheckCircle className="h-5 w-5 text-green-500 inline" /> : <XCircle className="h-5 w-5 text-red-500 inline" />}</TableCell>
                                                          <TableCell className="text-center">{perm.can_create ? <CheckCircle className="h-5 w-5 text-green-500 inline" /> : <XCircle className="h-5 w-5 text-red-500 inline" />}</TableCell>
                                                          <TableCell className="text-center">{perm.can_update ? <CheckCircle className="h-5 w-5 text-green-500 inline" /> : <XCircle className="h-5 w-5 text-red-500 inline" />}</TableCell>
                                                          <TableCell className="text-center">{perm.can_delete ? <CheckCircle className="h-5 w-5 text-green-500 inline" /> : <XCircle className="h-5 w-5 text-red-500 inline" />}</TableCell>
                                                      </TableRow>
                                                  ))}
                                              </TableBody>
                                          </Table>
                                      </div>
                                  ) : (
                                      <p className="text-sm text-muted-foreground">No specific permissions assigned to this role.</p>
                                  )}
                              </CardContent>
                          </Card>
                      ))
                  )}
              </motion.div>
          );
      };

      export default RoleManagement;
  