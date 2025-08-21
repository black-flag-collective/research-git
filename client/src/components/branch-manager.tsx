import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Branch } from "@shared/schema";

interface BranchManagerProps {
  collectionId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BranchManager({ collectionId, open, onOpenChange }: BranchManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: branches } = useQuery<Branch[]>({
    queryKey: ["/api/collections", collectionId, "branches"],
    enabled: !!collectionId && open,
  });

  const createBranchMutation = useMutation({
    mutationFn: async () => {
      if (!collectionId) throw new Error("Collection ID is required");
      
      await apiRequest("POST", "/api/branches", {
        collectionId,
        name,
        description,
        parentBranch: "main",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Branch created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/collections", collectionId, "branches"] });
      setShowCreateForm(false);
      setName("");
      setDescription("");
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
        description: "Failed to create branch",
        variant: "destructive",
      });
    },
  });

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please provide a branch name",
        variant: "destructive",
      });
      return;
    }
    createBranchMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Branches</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Existing Branches */}
          <div>
            <h3 className="font-medium text-slate-900 mb-3">Existing Branches</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
                <div>
                  <span className="font-medium text-slate-900">main</span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Default
                  </Badge>
                </div>
              </div>
              {branches?.map((branch) => (
                <div key={branch.id} className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-md">
                  <div>
                    <span className="font-medium text-slate-900">{branch.name}</span>
                    {branch.description && (
                      <p className="text-sm text-slate-600 mt-1">{branch.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Create New Branch */}
          {!showCreateForm ? (
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="w-full"
            >
              Create New Branch
            </Button>
          ) : (
            <form onSubmit={handleCreateBranch} className="space-y-4 border-t border-slate-200 pt-4">
              <div>
                <Label htmlFor="branch-name" className="text-sm font-medium text-slate-700">
                  Branch Name
                </Label>
                <Input
                  id="branch-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., feminist-perspectives"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="branch-description" className="text-sm font-medium text-slate-700">
                  Description (optional)
                </Label>
                <Textarea
                  id="branch-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the purpose of this branch..."
                  rows={2}
                  className="mt-1"
                />
              </div>
              
              <div className="flex items-center justify-end space-x-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowCreateForm(false);
                    setName("");
                    setDescription("");
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createBranchMutation.isPending}
                >
                  {createBranchMutation.isPending ? "Creating..." : "Create Branch"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
