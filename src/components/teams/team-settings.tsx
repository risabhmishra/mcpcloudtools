'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Team } from '@/stores/team-store';
import { useTeamStore } from '@/stores/team-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, AlertTriangle } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
} from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';
import { formatDate } from '@/lib/utils';

interface TeamSettingsProps {
  team: Team;
}

const teamSettingsSchema = z.object({
  name: z.string().min(1, { message: 'Team name is required' }),
  description: z.string(),
});

type TeamSettingsValues = z.infer<typeof teamSettingsSchema>;

export function TeamSettings({ team }: TeamSettingsProps) {
  const { updateTeam, deleteTeam, isLoading } = useTeamStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const form = useForm<TeamSettingsValues>({
    resolver: zodResolver(teamSettingsSchema),
    defaultValues: {
      name: team.name,
      description: team.description,
    },
  });

  const onSubmit = async (values: TeamSettingsValues) => {
    try {
      await updateTeam(team.id, values);
      toast({
        title: "Team updated",
        description: "Your team settings have been updated successfully.",
        variant: "success",
      });
    } catch (error) {
      // Error handling is managed by the store
    }
  };

  const handleDeleteTeam = async () => {
    try {
      await deleteTeam(team.id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      // Error handling is managed by the store
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-6">Team Settings</h3>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Describe the purpose of this team" 
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="pt-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      
      <div className="border-t pt-6">
        <div className="flex flex-col space-y-2">
          <h3 className="font-semibold text-lg">Team Information</h3>
          <p className="text-sm text-muted-foreground">
            Created on {formatDate(team.createdAt)}
          </p>
          <p className="text-sm text-muted-foreground">
            {team.members.length} {team.members.length === 1 ? 'member' : 'members'}
          </p>
        </div>
      </div>
      
      <div className="border-t pt-6">
        <div className="flex flex-col space-y-2">
          <h3 className="font-semibold text-lg text-destructive">Danger Zone</h3>
          <p className="text-sm text-muted-foreground">
            This action is permanent and cannot be undone. This will delete the team, all of its data,
            and remove all team members.
          </p>
          <div className="pt-2">
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  Delete Team
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Delete Team
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete <span className="font-semibold">{team.name}</span>?
                    This action cannot be undone. This will permanently delete the team and remove
                    all team members.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteTeam}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      'Delete Team'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
} 