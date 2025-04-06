'use client';

import { useState } from 'react';
import { Invitation } from '@/stores/team-store';
import { useTeamStore } from '@/stores/team-store';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Clock, Mail } from 'lucide-react';
import { InviteMemberDialog } from './invite-member-dialog';
import { Card, CardContent } from '@/components/ui/card';

interface TeamInvitationsProps {
  teamId: string;
  invitations: Invitation[];
}

export function TeamInvitations({ teamId, invitations }: TeamInvitationsProps) {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="outline" className="bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-300">Admin</Badge>;
      case 'editor':
        return <Badge variant="outline" className="bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-500 dark:text-green-300">Editor</Badge>;
      case 'viewer':
        return <Badge variant="outline" className="bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300">Viewer</Badge>;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg">Pending Invitations</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsInviteDialogOpen(true)}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {invitations.length > 0 ? (
        <div className="space-y-4">
          {invitations.map((invitation) => (
            <Card key={invitation.id}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <div className="font-medium">{invitation.email}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3.5 w-3.5" />
                        Invited {formatDate(invitation.invitedAt)} by {invitation.invitedBy}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getRoleBadge(invitation.role)}
                    <Badge variant="outline" className="bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-500 dark:text-yellow-300">
                      Pending
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border rounded-md bg-card">
          <Mail className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <h4 className="font-medium mb-1">No pending invitations</h4>
          <p className="text-sm text-muted-foreground mb-4">There are no pending invitations for this team</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsInviteDialogOpen(true)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </div>
      )}

      <InviteMemberDialog 
        teamId={teamId}
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
      />
    </div>
  );
} 