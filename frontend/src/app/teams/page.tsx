'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users, UserPlus, Settings as SettingsIcon } from 'lucide-react';
import { TeamsList } from '@/components/teams/teams-list';
import { TeamMembers } from '@/components/teams/team-members';
import { TeamSettings } from '@/components/teams/team-settings';
import { TeamInvitations } from '@/components/teams/team-invitations';
import { useTeamStore } from '@/stores/team-store';
import { CreateTeamDialog } from '@/components/teams/create-team-dialog';
import { RequiresAuth } from '@/components/auth/requires-auth';
import { Skeleton } from '@/components/ui/skeleton';

export default function TeamsPage() {
  const [activeTab, setActiveTab] = useState('teams');
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const { 
    teams, 
    currentTeam, 
    invitations, 
    isLoading, 
    fetchTeams, 
    fetchInvitations, 
    selectTeam 
  } = useTeamStore();

  useEffect(() => {
    fetchTeams();
    fetchInvitations();
  }, [fetchTeams, fetchInvitations]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <RequiresAuth>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground dark:text-foreground">Team Management</h1>
            <p className="text-foreground/80 dark:text-foreground/80 mt-1">
              Create and manage teams for collaborative tool development
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateTeamOpen(true)}
            className="mt-4 md:mt-0"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Team
          </Button>
        </div>

        {isLoading && !teams.length ? (
          <TeamsSkeleton />
        ) : (
          <>
            {teams.length === 0 ? (
              <EmptyTeamState onCreateTeam={() => setIsCreateTeamOpen(true)} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Teams sidebar */}
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold">Your Teams</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TeamsList 
                        teams={teams} 
                        currentTeam={currentTeam} 
                        onSelectTeam={selectTeam} 
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Team details */}
                <div className="md:col-span-3">
                  {currentTeam ? (
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-xl font-bold">{currentTeam.name}</CardTitle>
                            <CardDescription className="mt-1">{currentTeam.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Tabs value={activeTab} onValueChange={handleTabChange}>
                          <TabsList className="mb-4">
                            <TabsTrigger value="members">
                              <Users className="h-4 w-4 mr-2" />
                              Members
                            </TabsTrigger>
                            <TabsTrigger value="invitations">
                              <UserPlus className="h-4 w-4 mr-2" />
                              Invitations
                            </TabsTrigger>
                            <TabsTrigger value="settings">
                              <SettingsIcon className="h-4 w-4 mr-2" />
                              Settings
                            </TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="members">
                            <TeamMembers teamId={currentTeam.id} members={currentTeam.members} />
                          </TabsContent>
                          
                          <TabsContent value="invitations">
                            <TeamInvitations 
                              teamId={currentTeam.id} 
                              invitations={invitations.filter(inv => 
                                inv.teamId === currentTeam.id && inv.status === 'pending'
                              )} 
                            />
                          </TabsContent>
                          
                          <TabsContent value="settings">
                            <TeamSettings team={currentTeam} />
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="py-10">
                        <div className="text-center">
                          <p className="text-muted-foreground">Select a team to view details</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <CreateTeamDialog 
        open={isCreateTeamOpen}
        onOpenChange={setIsCreateTeamOpen}
      />
    </RequiresAuth>
  );
}

function EmptyTeamState({ onCreateTeam }: { onCreateTeam: () => void }) {
  return (
    <Card className="p-8">
      <div className="flex flex-col items-center justify-center text-center">
        <Users className="h-12 w-12 text-primary mb-4" />
        <h2 className="text-xl font-bold text-foreground dark:text-foreground mb-2">No Teams Yet</h2>
        <p className="text-foreground/80 dark:text-foreground/80 mb-6 max-w-md">
          Teams allow you to collaborate with others on tool development and management.
          Create your first team to get started.
        </p>
        <Button onClick={onCreateTeam}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Your First Team
        </Button>
      </div>
    </Card>
  );
}

function TeamsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full mb-2" />
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-3">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-6">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-full mb-4" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 