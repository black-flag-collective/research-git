import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Archive, Note } from "@shared/schema";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedArchive, setSelectedArchive] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");

  const { data: archives } = useQuery<Archive[]>({
    queryKey: ["/api/archives"],
    enabled: open,
  });

  const { data: searchResults } = useQuery<Note[]>({
    queryKey: ["/api/search/notes", { query, archiveId: selectedArchive, branchName: selectedBranch }],
    enabled: query.length > 2,
  });

  const handleSearch = () => {
    // Search is already triggered by the query dependency
    console.log("Searching for:", query);
  };

  const clearFilters = () => {
    setQuery("");
    setSelectedArchive("");
    setSelectedBranch("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Advanced Search</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Input
              placeholder="Search notes, archives, or contributors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="archive-select" className="text-sm font-medium text-slate-700 mb-2 block">
                Archive
              </Label>
              <Select value={selectedArchive} onValueChange={setSelectedArchive}>
                <SelectTrigger>
                  <SelectValue placeholder="All Archives" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Archives</SelectItem>
                  {archives?.map((archive) => (
                    <SelectItem key={archive.id} value={archive.id}>
                      {archive.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="branch-select" className="text-sm font-medium text-slate-700 mb-2 block">
                Branch
              </Label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  <SelectItem value="main">main</SelectItem>
                  <SelectItem value="feminist-health-perspectives">feminist-health-perspectives</SelectItem>
                  <SelectItem value="business-medicine">business-medicine</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search Results */}
          {query.length > 2 && (
            <div className="mt-6">
              <h3 className="font-medium text-slate-900 mb-3">Search Results</h3>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {searchResults && searchResults.length > 0 ? (
                  searchResults.map((note) => (
                    <div key={note.id} className="p-3 border border-slate-200 rounded-md hover:bg-slate-50">
                      <h4 className="font-medium text-slate-900 mb-1">{note.title}</h4>
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {note.content.substring(0, 150)}...
                      </p>
                      <div className="text-xs text-slate-500 mt-2">
                        Branch: {note.branchName}
                      </div>
                    </div>
                  ))
                ) : query.length > 2 ? (
                  <div className="text-center py-8 text-slate-600">
                    No results found for "{query}"
                  </div>
                ) : null}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-4">
            <Button variant="ghost" onClick={clearFilters}>
              Clear filters
            </Button>
            <div className="space-x-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSearch}>
                Search
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
