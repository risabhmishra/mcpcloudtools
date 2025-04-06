'use client';

import { useState } from 'react';
import { TeamMember } from '@/stores/team-store';
import { useTeamStore } from '@/stores/team-store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserPlus, MoreHorizontal, Shield, ShieldCheck, Eye, Edit3, Trash2 } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { InviteMemberDialog } from './invite-member-dialog';
import { formatDate } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TeamMembersProps {
  teamId: string;
  members: TeamMember[];
}

export function TeamMembers({ teamId, members }: TeamMembersProps) {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);
  const { removeTeamMember, updateMemberRole } = useTeamStore();
  const { user } = useAuthStore();

  const isCurrentUserOwner = members.some(
    member => member.email === user?.email && member.role === 'owner'
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return (
          <Badge variant="outline" className="bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900/30 dark:border-purple-500 dark:text-purple-300">
            <ShieldCheck className="h-3 w-3 mr-1" />
            Owner
          </Badge>
        );
      case 'admin':
        return (
          <Badge variant="outline" className="bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-300">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        );
      case 'editor':
        return (
          <Badge variant="outline" className="bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-500 dark:text-green-300">
            <Edit3 className="h-3 w-3 mr-1" />
            Editor
          </Badge>
        );
      case 'viewer':
        return (
          <Badge variant="outline" className="bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300">
            <Eye className="h-3 w-3 mr-1" />
            Viewer
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleRemoveMember = async () => {
    if (memberToRemove) {
      await removeTeamMember(teamId, memberToRemove.id);
      setMemberToRemove(null);
    }
  };

  const handleRoleChange = async (memberId: string, role: 'admin' | 'editor' | 'viewer') => {
    await updateMemberRole(teamId, memberId, role);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg">Team Members</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsInviteDialogOpen(true)}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

      <div className="space-y-4">
        {members.map((member) => (
          <div 
            key={member.id} 
            className="flex items-center justify-between p-3 rounded-md border bg-card"
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={member.avatarUrl} />
                <AvatarFallback>{member.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{member.name}</div>
                <div className="text-sm text-muted-foreground">{member.email}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {getRoleBadge(member.role)}
              
              <div className="text-xs text-muted-foreground">
                Joined {formatDate(member.joinedAt)}
              </div>
              
              {isCurrentUserOwner && member.role !== 'owner' && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleRoleChange(member.id, 'admin')}
                      disabled={member.role === 'admin'}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Make Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleRoleChange(member.id, 'editor')}
                      disabled={member.role === 'editor'}
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Make Editor
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleRoleChange(member.id, 'viewer')}
                      disabled={member.role === 'viewer'}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Make Viewer
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => setMemberToRemove(member)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove from Team
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        ))}
      </div>

      <InviteMemberDialog 
        teamId={teamId}
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
      />

      <AlertDialog open={!!memberToRemove} onOpenChange={() => setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {memberToRemove?.name} from this team?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveMember} className="bg-destructive text-destructive-foreground">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 