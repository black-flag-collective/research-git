import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Note } from "@shared/schema";
import PullRequestDialog from "./pull-request-dialog";

interface MarkdownEditorProps {
  folderId?: string;
  branchName: string;
  note?: Note;
}

export default function MarkdownEditor({ folderId, branchName, note }: MarkdownEditorProps) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [showPRDialog, setShowPRDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (note) {
      setContent(note.content || "");
      setTitle(note.title || "");
    } else {
      setContent("");
      setTitle("");
    }
  }, [note]);

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [content]);

  const saveNoteMutation = useMutation({
    mutationFn: async () => {
      if (!folderId) throw new Error("Folder ID is required");
      
      if (note) {
        await apiRequest("PUT", `/api/notes/${note.id}`, {
          content,
          title,
        });
      } else {
        await apiRequest("POST", "/api/notes", {
          folderId,
          branchName,
          title: title || "Untitled Note",
          content,
        });
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Note saved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/folders", folderId, "notes", branchName] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to save note",
        variant: "destructive",
      });
    },
  });

  const handleBoldClick = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      if (selectedText) {
        const boldText = `**${selectedText}**`;
        range.deleteContents();
        range.insertNode(document.createTextNode(boldText));
      }
    }
  };

  const handleItalicClick = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      if (selectedText) {
        const italicText = `*${selectedText}*`;
        range.deleteContents();
        range.insertNode(document.createTextNode(italicText));
      }
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-col">
        {/* Editor Toolbar */}
        <div className="bg-slate-50 border-b border-slate-200 p-2">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBoldClick}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white"
              title="Bold"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"/>
                <path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"/>
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleItalicClick}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white"
              title="Italic"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M19 4h-9m4 16H5m6-16l-4 16"/>
              </svg>
            </Button>
            <div className="w-px h-6 bg-slate-300 mx-2"></div>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white"
              title="Heading"
            >
              <span className="text-sm font-bold">H1</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white"
              title="Bullet List"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white"
              title="Link"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
              </svg>
            </Button>
          </div>
        </div>

        {/* Title Input */}
        <div className="bg-white border-b border-slate-200 p-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="w-full text-2xl font-bold text-slate-900 bg-transparent border-none outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Editor Content */}
        <div className="flex-1 p-4 bg-white overflow-y-auto">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your research notes..."
            className="w-full h-full resize-none border-none outline-none text-slate-900 placeholder:text-slate-400 font-mono text-sm leading-relaxed"
          />
        </div>

        {/* Editor Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-3 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-slate-600">
            <span>{wordCount} words</span>
            <span>Saved 2 minutes ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              Preview
            </Button>
            <Button 
              size="sm" 
              onClick={() => saveNoteMutation.mutate()}
              disabled={saveNoteMutation.isPending}
            >
              {saveNoteMutation.isPending ? "Saving..." : "Save"}
            </Button>
            <Button 
              size="sm"
              onClick={() => setShowPRDialog(true)}
              disabled={!content.trim()}
            >
              Propose Changes
            </Button>
          </div>
        </div>
      </div>

      <PullRequestDialog 
        folderId={folderId}
        sourceBranch={branchName}
        open={showPRDialog}
        onOpenChange={setShowPRDialog}
      />
    </>
  );
}
