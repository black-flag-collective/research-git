import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Header from "@/components/header";
import ArchiveSidebar from "@/components/archive-sidebar";
import MarkdownEditor from "@/components/markdown-editor";
import ActivitySidebar from "@/components/activity-sidebar";
import { Collection, Folder, Note } from "@shared/schema";

export default function ArchiveView() {
  const { archiveId, collectionId, folderId } = useParams();
  const [selectedBranch, setSelectedBranch] = useState("main");

  const { data: collection } = useQuery<Collection>({
    queryKey: ["/api/collections", collectionId],
    enabled: !!collectionId,
  });

  const { data: folder } = useQuery<Folder>({
    queryKey: ["/api/folders", folderId],
    enabled: !!folderId,
  });

  const { data: note } = useQuery<Note>({
    queryKey: ["/api/folders", folderId, "notes", selectedBranch],
    enabled: !!folderId && !!selectedBranch,
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="flex h-screen">
        <ArchiveSidebar 
          archiveId={archiveId}
          collectionId={collectionId}
          selectedBranch={selectedBranch}
          onBranchChange={setSelectedBranch}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Content Header */}
          <div className="bg-white border-b border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-2">
                  <span>{collection?.name || "Collection"}</span>
                  <span>/</span>
                  <span className="text-slate-900 font-medium">
                    {folder?.name || "Folder"}
                  </span>
                </nav>
                <h1 className="text-xl font-semibold text-slate-900">
                  {note?.title || folder?.name || "New Note"}
                </h1>
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          <div className="bg-white border-b border-slate-200">
            <nav className="flex space-x-8 px-4">
              <a href="#" className="py-3 px-1 border-b-2 border-blue-600 text-sm font-medium text-blue-600">
                Notes
              </a>
              <a href="#" className="py-3 px-1 border-b-2 border-transparent text-sm font-medium text-slate-600 hover:text-slate-900">
                History
              </a>
              <a href="#" className="py-3 px-1 border-b-2 border-transparent text-sm font-medium text-slate-600 hover:text-slate-900">
                Contributors
              </a>
            </nav>
          </div>

          {/* Editor and Activity */}
          <div className="flex-1 flex overflow-hidden">
            <MarkdownEditor 
              folderId={folderId}
              branchName={selectedBranch}
              note={note}
            />
            <ActivitySidebar 
              folderId={folderId}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
