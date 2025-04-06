import { create } from 'zustand';
import { toast } from '@/components/ui/use-toast';

// Team member with role
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  avatarUrl?: string;
  joinedAt: string;
}

// Team interface
export interface Team {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  members: TeamMember[];
}

// Invitation interface
export interface Invitation {
  id: string;
  teamId: string;
  teamName: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  invitedBy: string;
  invitedAt: string;
  status: 'pending' | 'accepted' | 'declined';
}

// Team store interface
interface TeamState {
  teams: Team[];
  currentTeam: Team | null;
  invitations: Invitation[];
  isLoading: boolean;
  error: string | null;
  
  // Team management
  createTeam: (name: string, description: string) => Promise<Team>;
  updateTeam: (teamId: string, data: Partial<Team>) => Promise<Team>;
  deleteTeam: (teamId: string) => Promise<void>;
  selectTeam: (teamId: string) => void;
  
  // Team member management
  inviteTeamMember: (teamId: string, email: string, role: 'admin' | 'editor' | 'viewer') => Promise<void>;
  updateMemberRole: (teamId: string, memberId: string, role: 'admin' | 'editor' | 'viewer') => Promise<void>;
  removeTeamMember: (teamId: string, memberId: string) => Promise<void>;
  
  // Invitation management
  acceptInvitation: (invitationId: string) => Promise<void>;
  declineInvitation: (invitationId: string) => Promise<void>;
  
  fetchTeams: () => Promise<void>;
  fetchInvitations: () => Promise<void>;
  clearError: () => void;
}

// Mock data for demo
const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Engineering Team',
    description: 'Main engineering team for MCPCloudTools',
    createdAt: '2023-05-15T10:00:00.000Z',
    members: [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'owner',
        joinedAt: '2023-05-15T10:00:00.000Z',
      },
      {
        id: '2',
        name: 'Regular User',
        email: 'user@example.com',
        role: 'editor',
        joinedAt: '2023-05-16T10:00:00.000Z',
      },
    ],
  },
];

const mockInvitations: Invitation[] = [
  {
    id: '1',
    teamId: '1',
    teamName: 'Engineering Team',
    email: 'newuser@example.com',
    role: 'viewer',
    invitedBy: 'Admin User',
    invitedAt: '2023-06-01T10:00:00.000Z',
    status: 'pending',
  },
];

export const useTeamStore = create<TeamState>((set, get) => ({
  teams: [],
  currentTeam: null,
  invitations: [],
  isLoading: false,
  error: null,
  
  fetchTeams: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set({ 
        teams: mockTeams,
        currentTeam: mockTeams.length > 0 ? mockTeams[0] : null,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: 'Failed to fetch teams',
      });
      
      toast({
        title: "Error",
        description: "Failed to fetch teams. Please try again later.",
        variant: "destructive",
      });
    }
  },
  
  fetchInvitations: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ 
        invitations: mockInvitations,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: 'Failed to fetch invitations',
      });
    }
  },
  
  createTeam: async (name, description) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTeam: Team = {
        id: Math.random().toString(36).substring(2, 11),
        name,
        description,
        createdAt: new Date().toISOString(),
        members: [
          {
            id: '1', // This would be the current user's ID
            name: 'Admin User', // This would be the current user's name
            email: 'admin@example.com', // This would be the current user's email
            role: 'owner',
            joinedAt: new Date().toISOString(),
          },
        ],
      };
      
      set(state => ({ 
        teams: [...state.teams, newTeam],
        currentTeam: newTeam,
        isLoading: false,
      }));
      
      toast({
        title: "Team created",
        description: `${name} team has been created successfully.`,
        variant: "success",
      });
      
      return newTeam;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: 'Failed to create team',
      });
      
      toast({
        title: "Error",
        description: "Failed to create team. Please try again later.",
        variant: "destructive",
      });
      
      throw error;
    }
  },
  
  updateTeam: async (teamId, data) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const { teams } = get();
      const teamIndex = teams.findIndex(team => team.id === teamId);
      
      if (teamIndex === -1) {
        throw new Error('Team not found');
      }
      
      const updatedTeam = {
        ...teams[teamIndex],
        ...data,
      };
      
      const updatedTeams = [...teams];
      updatedTeams[teamIndex] = updatedTeam;
      
      set({ 
        teams: updatedTeams,
        currentTeam: get().currentTeam?.id === teamId ? updatedTeam : get().currentTeam,
        isLoading: false,
      });
      
      toast({
        title: "Team updated",
        description: `${updatedTeam.name} has been updated successfully.`,
        variant: "success",
      });
      
      return updatedTeam;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: 'Failed to update team',
      });
      
      toast({
        title: "Error",
        description: "Failed to update team. Please try again later.",
        variant: "destructive",
      });
      
      throw error;
    }
  },
  
  deleteTeam: async (teamId) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { teams } = get();
      const filteredTeams = teams.filter(team => team.id !== teamId);
      
      set({ 
        teams: filteredTeams,
        currentTeam: filteredTeams.length > 0 ? filteredTeams[0] : null,
        isLoading: false,
      });
      
      toast({
        title: "Team deleted",
        description: "The team has been deleted successfully.",
        variant: "success",
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: 'Failed to delete team',
      });
      
      toast({
        title: "Error",
        description: "Failed to delete team. Please try again later.",
        variant: "destructive",
      });
      
      throw error;
    }
  },
  
  selectTeam: (teamId) => {
    const { teams } = get();
    const selectedTeam = teams.find(team => team.id === teamId) || null;
    
    set({ currentTeam: selectedTeam });
  },
  
  inviteTeamMember: async (teamId, email, role) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const { teams } = get();
      const team = teams.find(t => t.id === teamId);
      
      if (!team) {
        throw new Error('Team not found');
      }
      
      // Check if the user is already a member
      if (team.members.some(member => member.email === email)) {
        throw new Error('User is already a member of this team');
      }
      
      // In a real app, this would send an invitation email
      // For demo, we'll add to invitations
      const newInvitation: Invitation = {
        id: Math.random().toString(36).substring(2, 11),
        teamId,
        teamName: team.name,
        email,
        role,
        invitedBy: 'Admin User', // This would be the current user's name
        invitedAt: new Date().toISOString(),
        status: 'pending',
      };
      
      set(state => ({ 
        invitations: [...state.invitations, newInvitation],
        isLoading: false,
      }));
      
      toast({
        title: "Invitation sent",
        description: `Invitation has been sent to ${email}.`,
        variant: "success",
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to invite team member',
      });
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to invite team member.",
        variant: "destructive",
      });
      
      throw error;
    }
  },
  
  updateMemberRole: async (teamId, memberId, role) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const { teams } = get();
      const teamIndex = teams.findIndex(team => team.id === teamId);
      
      if (teamIndex === -1) {
        throw new Error('Team not found');
      }
      
      const team = teams[teamIndex];
      const memberIndex = team.members.findIndex(member => member.id === memberId);
      
      if (memberIndex === -1) {
        throw new Error('Member not found');
      }
      
      // Prevent changing the role of the owner
      if (team.members[memberIndex].role === 'owner') {
        throw new Error('Cannot change the role of the team owner');
      }
      
      const updatedMembers = [...team.members];
      updatedMembers[memberIndex] = {
        ...updatedMembers[memberIndex],
        role,
      };
      
      const updatedTeam = {
        ...team,
        members: updatedMembers,
      };
      
      const updatedTeams = [...teams];
      updatedTeams[teamIndex] = updatedTeam;
      
      set({ 
        teams: updatedTeams,
        currentTeam: get().currentTeam?.id === teamId ? updatedTeam : get().currentTeam,
        isLoading: false,
      });
      
      toast({
        title: "Role updated",
        description: `Member role has been updated to ${role}.`,
        variant: "success",
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to update member role',
      });
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update member role.",
        variant: "destructive",
      });
      
      throw error;
    }
  },
  
  removeTeamMember: async (teamId, memberId) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const { teams } = get();
      const teamIndex = teams.findIndex(team => team.id === teamId);
      
      if (teamIndex === -1) {
        throw new Error('Team not found');
      }
      
      const team = teams[teamIndex];
      const memberIndex = team.members.findIndex(member => member.id === memberId);
      
      if (memberIndex === -1) {
        throw new Error('Member not found');
      }
      
      // Prevent removing the owner
      if (team.members[memberIndex].role === 'owner') {
        throw new Error('Cannot remove the team owner');
      }
      
      const updatedMembers = team.members.filter(member => member.id !== memberId);
      const updatedTeam = {
        ...team,
        members: updatedMembers,
      };
      
      const updatedTeams = [...teams];
      updatedTeams[teamIndex] = updatedTeam;
      
      set({ 
        teams: updatedTeams,
        currentTeam: get().currentTeam?.id === teamId ? updatedTeam : get().currentTeam,
        isLoading: false,
      });
      
      toast({
        title: "Member removed",
        description: "Team member has been removed successfully.",
        variant: "success",
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to remove team member',
      });
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove team member.",
        variant: "destructive",
      });
      
      throw error;
    }
  },
  
  acceptInvitation: async (invitationId) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { invitations, teams } = get();
      const invitation = invitations.find(inv => inv.id === invitationId);
      
      if (!invitation) {
        throw new Error('Invitation not found');
      }
      
      // Find the team
      const teamIndex = teams.findIndex(team => team.id === invitation.teamId);
      
      if (teamIndex === -1) {
        throw new Error('Team not found');
      }
      
      // Add the user to the team
      const newMember: TeamMember = {
        id: Math.random().toString(36).substring(2, 11),
        name: 'Regular User', // This would be the current user's name
        email: invitation.email,
        role: invitation.role,
        joinedAt: new Date().toISOString(),
      };
      
      const updatedTeam = {
        ...teams[teamIndex],
        members: [...teams[teamIndex].members, newMember],
      };
      
      const updatedTeams = [...teams];
      updatedTeams[teamIndex] = updatedTeam;
      
      // Update the invitation status
      const updatedInvitations = invitations.map(inv => 
        inv.id === invitationId ? { ...inv, status: 'accepted' as const } : inv
      );
      
      set({ 
        teams: updatedTeams,
        invitations: updatedInvitations,
        currentTeam: get().currentTeam?.id === invitation.teamId ? updatedTeam : get().currentTeam,
        isLoading: false,
      });
      
      toast({
        title: "Invitation accepted",
        description: `You have joined the ${invitation.teamName} team.`,
        variant: "success",
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to accept invitation',
      });
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to accept invitation.",
        variant: "destructive",
      });
      
      throw error;
    }
  },
  
  declineInvitation: async (invitationId) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const { invitations } = get();
      
      // Update the invitation status
      const updatedInvitations = invitations.map(inv => 
        inv.id === invitationId ? { ...inv, status: 'declined' as const } : inv
      );
      
      set({ 
        invitations: updatedInvitations,
        isLoading: false,
      });
      
      toast({
        title: "Invitation declined",
        description: "You have declined the team invitation.",
        variant: "default",
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: 'Failed to decline invitation',
      });
      
      toast({
        title: "Error",
        description: "Failed to decline invitation. Please try again later.",
        variant: "destructive",
      });
      
      throw error;
    }
  },
  
  clearError: () => set({ error: null }),
})); 