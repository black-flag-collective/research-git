import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PullRequest } from "@shared/schema";

interface ActivitySidebarProps {
  folderId?: string;
}

export default function ActivitySidebar({ folderId }: ActivitySidebarProps) {
  const { data: pullRequests, isLoading } = useQuery<PullRequest[]>({
    queryKey: ["/api/folders", folderId, "pull-requests"],
    enabled: !!folderId,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-amber-100 text-amber-800";
      case "merged":
        return "bg-emerald-100 text-emerald-800";
      case "closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return "w-2 h-2 bg-amber-500 rounded-full";
      case "merged":
        return "w-2 h-2 bg-emerald-500 rounded-full";
      case "closed":
        return "w-2 h-2 bg-red-500 rounded-full";
      default:
        return "w-2 h-2 bg-slate-500 rounded-full";
    }
  };

  return (
    <div className="w-80 bg-slate-50 border-l border-slate-200 overflow-y-auto">
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 mb-4">Recent Activity</h3>
        
        {/* Pull Requests */}
        <div className="space-y-3 mb-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white p-3 rounded-md border border-slate-200">
                <div className="flex items-start space-x-3">
                  <Skeleton className="w-2 h-2 rounded-full mt-2" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              </div>
            ))
          ) : pullRequests && pullRequests.length > 0 ? (
            pullRequests.map((pr) => (
              <div key={pr.id} className="bg-white p-3 rounded-md border border-slate-200">
                <div className="flex items-start space-x-3">
                  <div className={`${getStatusIcon(pr.status)} mt-2 flex-shrink-0`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{pr.title}</p>
                    <p className="text-xs text-slate-600 mb-2">
                      {pr.sourceBranch} → {pr.targetBranch}
                    </p>
                    {pr.description && (
                      <p className="text-xs text-slate-600 mb-2">{pr.description}</p>
                    )}
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getStatusColor(pr.status)}`}
                      >
                        {pr.status === "open" ? "Review Pending" : 
                         pr.status === "merged" ? "Merged" : "Closed"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-6 rounded-md border border-slate-200 text-center">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-4-4 4-4h-5m-6 0H4l4 4-4 4h5m6-8a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <p className="text-sm text-slate-600">No pull requests yet</p>
            </div>
          )}
        </div>

        {/* Contributors Section - Placeholder */}
        <div className="mb-6">
          <h4 className="font-medium text-slate-900 mb-3">Contributors</h4>
          <div className="bg-white p-4 rounded-md border border-slate-200 text-center">
            <p className="text-sm text-slate-600">Contributor data will appear here</p>
          </div>
        </div>

        {/* Branch Comparison - Placeholder */}
        <div>
          <h4 className="font-medium text-slate-900 mb-3">Branch Differences</h4>
          <div className="bg-white p-4 rounded-md border border-slate-200 text-center">
            <p className="text-sm text-slate-600">Branch comparison will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
