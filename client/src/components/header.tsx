import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SearchModal from "./search-modal";

export default function Header() {
  const { user } = useAuth();
  const [showSearch, setShowSearch] = useState(false);

  const initials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}` 
    : user?.email?.[0]?.toUpperCase() || 'AR';

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.5a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"/>
                  <path d="M3 8.5a1 1 0 011-1h16a1 1 0 011 1V19a1 1 0 01-1 1H4a1 1 0 01-1-1V8.5z"/>
                </svg>
              </div>
              <span className="text-xl font-semibold text-slate-900">ArchiveShare</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="/" className="text-slate-600 hover:text-slate-900 font-medium">
                Archives
              </a>
              <a href="#" className="text-slate-600 hover:text-slate-900 font-medium">
                Pull Requests
              </a>
              <Button 
                variant="ghost" 
                className="text-slate-600 hover:text-slate-900 font-medium p-0 h-auto"
                onClick={() => setShowSearch(true)}
              >
                Search
              </Button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-500 hover:text-slate-700 relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-4-4 4-4h-5m-6 0H4l4 4-4 4h5m6-8a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </button>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-slate-600">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user?.email || 'Alex Researcher'
                }
              </span>
              <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center text-sm font-medium text-slate-600">
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
