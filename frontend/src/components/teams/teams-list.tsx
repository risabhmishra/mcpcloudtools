'use client';

import { useState } from 'react';
import { Team } from '@/stores/team-store';
import { cn } from '@/lib/utils';
import { Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TeamsListProps {
  teams: Team[];
  currentTeam: Team | null;
  onSelectTeam: (teamId: string) => void;
}

export function TeamsList({ teams, currentTeam, onSelectTeam }: TeamsListProps) {
  const handleTeamClick = (teamId: string) => {
    onSelectTeam(teamId);
  };

  if (teams.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground text-sm">No teams found</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-1">
        {teams.map((team) => (
          <div
            key={team.id}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm cursor-pointer",
              currentTeam?.id === team.id
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent/50 hover:text-accent-foreground/90"
            )}
            onClick={() => handleTeamClick(team.id)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{team.name}</span>
              <span className="text-xs text-muted-foreground">{team.members.length} members</span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
} 