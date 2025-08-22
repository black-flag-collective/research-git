import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Search, GitPullRequest, Archive } from "lucide-react";
import SearchModal from "./search-modal";
import { ThemeSwitcher } from "./theme-switcher";

export default function Header() {
  const { user } = useAuth();
  const [showSearch, setShowSearch] = useState(false);

  const initials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}` 
    : user?.email?.[0]?.toUpperCase() || 'AR';

  return (
    <>
      <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Archive className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">Share</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a 
                href="/" 
                className="text-muted-foreground hover:text-foreground font-medium transition-colors flex items-center space-x-2"
              >
                <Archive className="w-4 h-4" />
                <span>Archives</span>
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-foreground font-medium transition-colors flex items-center space-x-2"
              >
                <GitPullRequest className="w-4 h-4" />
                <span>Pull Requests</span>
              </a>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-muted-foreground hover:text-foreground font-medium"
                onClick={() => setShowSearch(true)}
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user?.email || 'Alex Researcher'
                }
              </span>
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-medium text-muted-foreground border border-border">
                {initials}
              </div>
            </div>
          </div>
        </div>
      </header>

      <SearchModal 
        open={showSearch}
        onOpenChange={setShowSearch}
      />
    </>
  );
}
