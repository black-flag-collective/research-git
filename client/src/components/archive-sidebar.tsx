import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Archive, Collection, Box, Folder, Branch } from "@shared/schema";
import BranchManager from "./branch-manager";

interface ArchiveSidebarProps {
  archiveId?: string;
  collectionId?: string;
  selectedBranch: string;
  onBranchChange: (branch: string) => void;
}

export default function ArchiveSidebar({ 
  archiveId, 
  collectionId, 
  selectedBranch, 
  onBranchChange 
}: ArchiveSidebarProps) {
  const [showBranchManager, setShowBranchManager] = useState(false);

  const { data: archive } = useQuery<Archive>({
    queryKey: ["/api/archives", archiveId],
    enabled: !!archiveId,
  });

  const { data: collection } = useQuery<Collection>({
    queryKey: ["/api/collections", collectionId],
    enabled: !!collectionId,
  });

  const { data: branches } = useQuery<Branch[]>({
    queryKey: ["/api/collections", collectionId, "branches"],
    enabled: !!collectionId,
  });

  const { data: boxes } = useQuery<Box[]>({
    queryKey: ["/api/collections", collectionId, "boxes"],
    enabled: !!collectionId,
  });

  return (
    <>
      <aside className="w-80 bg-white border-r border-slate-200 overflow-y-auto">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-900">Current Archive</h2>
            <button className="p-1 text-slate-500 hover:text-slate-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
              </svg>
            </button>
          </div>
          
          {archive ? (
            <>
              <div className="text-sm text-slate-600 mb-2">{archive.institution}</div>
              <div className="text-lg font-medium text-slate-900 mb-4">
                {collection?.name || archive.name}
              </div>
            </>
          ) : (
            <>
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-6 w-3/4 mb-4" />
            </>
          )}
          
          {/* Branch Switcher */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">Branch</label>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-xs text-blue-600 hover:underline p-0 h-auto"
                onClick={() => setShowBranchManager(true)}
              >
                Manage
              </Button>
            </div>
            {branches ? (
              <Select value={selectedBranch} onValueChange={onBranchChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">main</SelectItem>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.name}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Skeleton className="h-9 w-full" />
            )}
          </div>
        </div>
        
        {/* Archive Hierarchy */}
        <div className="p-4">
          <div className="space-y-1">
            {boxes ? (
              boxes.map((box) => (
                <BoxItem key={box.id} box={box} />
              ))
            ) : (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            )}
          </div>
        </div>
      </aside>

      <BranchManager 
        collectionId={collectionId}
        open={showBranchManager}
        onOpenChange={setShowBranchManager}
      />
    </>
  );
}

function BoxItem({ box }: { box: Box }) {
  const { data: folders } = useQuery<Folder[]>({
    queryKey: ["/api/boxes", box.id, "folders"],
  });

  return (
    <div className="group">
      <div className="flex items-center space-x-2 py-2 px-2 rounded-md hover:bg-slate-50 cursor-pointer">
        <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
        </svg>
        <span className="text-sm text-slate-700">{box.name}</span>
      </div>
      {folders && (
        <div className="ml-6 space-y-1">
          {folders.map((folder) => (
            <div key={folder.id} className="flex items-center space-x-2 py-1 px-2 rounded-md hover:bg-slate-50 cursor-pointer">
              <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span className="text-sm text-slate-600">{folder.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
