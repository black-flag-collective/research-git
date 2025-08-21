import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

interface PullRequestDialogProps {
  folderId?: string;
  sourceBranch: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PullRequestDialog({ 
  folderId, 
  sourceBranch, 
  open, 
  onOpenChange 
}: PullRequestDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetBranch, setTargetBranch] = useState("main");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createPRMutation = useMutation({
    mutationFn: async () => {
      if (!folderId) throw new Error("Folder ID is required");
      
      await apiRequest("POST", "/api/pull-requests", {
        folderId,
        sourceBranch,
        targetBranch,
        title,
        description,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Pull request created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/folders", folderId, "pull-requests"] });
      onOpenChange(false);
      setTitle("");
      setDescription("");
      setTargetBranch("main");
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
        description: "Failed to create pull request",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please provide a title for the pull request",
        variant: "destructive",
      });
      return;
    }
    createPRMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Pull Request</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="pr-title" className="text-sm font-medium text-slate-700">
              Title
            </Label>
            <Input
              id="pr-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Describe your changes..."
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="pr-description" className="text-sm font-medium text-slate-700">
              Description (optional)
            </Label>
            <Textarea
              id="pr-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more details about your changes..."
              rows={3}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-slate-700">
                From
              </Label>
              <Input
                value={sourceBranch}
                disabled
                className="mt-1 bg-slate-50"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700">
                To
              </Label>
              <Select value={targetBranch} onValueChange={setTargetBranch}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">main</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createPRMutation.isPending}
            >
              {createPRMutation.isPending ? "Creating..." : "Create Pull Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
