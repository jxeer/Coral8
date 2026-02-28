/**
 * Governance Section Component
 * Displays active community governance proposals and lets authenticated users vote.
 *
 * How it works:
 *   1. Fetches proposals from GET /api/proposals via React Query
 *   2. Each proposal card shows its title, description, status badge,
 *      a support percentage progress bar, and Yes/No vote buttons
 *   3. Submitting a vote hits POST /api/proposals/:id/vote
 *   4. On success the proposals list is refetched so vote counts update live
 *
 * Voting rules (enforced server-side):
 *   - Each user can only vote once per proposal
 *   - Attempting to vote twice returns an error shown via toast
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { useToast } from "../hooks/use-toast";
import { apiRequest } from "../lib/queryClient";
import { GovernanceProposal } from "@shared/schema";

export function GovernanceSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all active proposals — React Query handles caching and re-fetching
  const { data: proposals, isLoading } = useQuery<GovernanceProposal[]>({
    queryKey: ["/api/proposals"],
  });

  /**
   * Vote mutation — sends a boolean vote (true = Yes, false = No) to the API.
   * On success: shows a confirmation toast and invalidates the proposals cache
   *             so the updated vote counts are fetched immediately.
   * On error: shows the server error message (e.g. "already voted").
   */
  const voteMutation = useMutation({
    mutationFn: async ({ proposalId, vote }: { proposalId: string; vote: boolean }) => {
      return apiRequest("POST", `/api/proposals/${proposalId}/vote`, { vote });
    },
    onSuccess: () => {
      toast({
        title: "Vote Recorded",
        description: "Your vote has been successfully submitted to the governance system.",
      });
      // Invalidate so the proposal list refetches with updated tallies
      queryClient.invalidateQueries({ queryKey: ["/api/proposals"] });
    },
    onError: (error: any) => {
      toast({
        title: "Vote Failed",
        description: error.message || "Failed to record vote. You may have already voted on this proposal.",
        variant: "destructive",
      });
    },
  });

  /** Trigger a vote — passed directly to the Yes/No button onClick handlers */
  const handleVote = (proposalId: string, vote: boolean) => {
    voteMutation.mutate({ proposalId, vote });
  };

  /**
   * Converts a proposal's endTime into a human-readable countdown string.
   * Returns "Ended" if the deadline has already passed.
   */
  const formatTimeLeft = (endTime: string) => {
    const end = new Date(endTime);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days <= 0) return "Ended";
    return `${days} day${days === 1 ? '' : 's'} left`;
  };

  /**
   * Calculates the percentage of Yes votes out of total votes cast.
   * Returns 0 if no votes have been cast yet (avoids division by zero).
   */
  const getSupportPercentage = (proposal: GovernanceProposal) => {
    const totalVotes = (proposal.votesYes || 0) + (proposal.votesNo || 0);
    if (totalVotes === 0) return 0;
    return Math.round(((proposal.votesYes || 0) / totalVotes) * 100);
  };

  // Show skeleton cards while proposals are loading
  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-deep-navy">Governance Proposals</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-moon-gray/20 rounded mb-2"></div>
              <div className="h-12 bg-moon-gray/20 rounded mb-4"></div>
              <div className="h-8 bg-moon-gray/20 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-deep-navy">Governance Proposals</h3>
        <Button variant="ghost" className="text-ocean-blue hover:text-ocean-teal">
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {proposals?.map((proposal) => {
          const supportPercentage = getSupportPercentage(proposal);
          const totalVotes = (proposal.votesYes || 0) + (proposal.votesNo || 0);
          
          return (
            <Card key={proposal.id} className="p-6 border border-ocean-teal/20">
              {/* Proposal header: title, description, meta info, status badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-deep-navy mb-2">{proposal.title}</h4>
                  <p className="text-sm text-moon-gray mb-3">{proposal.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-moon-gray">
                    <span>{formatTimeLeft(proposal.endTime.toString())}</span>
                    <span>{totalVotes} votes</span>
                  </div>
                </div>
                {/* Green for active, blue for voting/other statuses */}
                <Badge 
                  variant={proposal.status === 'active' ? 'default' : 'secondary'}
                  className={proposal.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}
                >
                  {proposal.status}
                </Badge>
              </div>
              
              {/* Support percentage progress bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-moon-gray">Support</span>
                  <span className="text-deep-navy font-medium">{supportPercentage}%</span>
                </div>
                <Progress 
                  value={supportPercentage} 
                  className="h-2"
                />
              </div>
              
              {/* Vote buttons — disabled while a vote request is in flight */}
              <div className="flex space-x-3">
                <Button
                  onClick={() => handleVote(proposal.id, true)}
                  disabled={voteMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-ocean-blue to-ocean-teal text-pearl-white hover:shadow-md transition-all"
                  size="sm"
                >
                  Vote Yes
                </Button>
                <Button
                  onClick={() => handleVote(proposal.id, false)}
                  disabled={voteMutation.isPending}
                  variant="outline"
                  className="flex-1 border-moon-gray/30 text-deep-navy hover:bg-moon-gray/10"
                  size="sm"
                >
                  Vote No
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
