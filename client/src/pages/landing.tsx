import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.5a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"/>
                <path d="M3 8.5a1 1 0 011-1h16a1 1 0 011 1V19a1 1 0 01-1 1H4a1 1 0 01-1-1V8.5z"/>
              </svg>
            </div>
            <span className="text-3xl font-bold text-slate-900">ArchiveShare</span>
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Collaborative Research Notes Platform
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            A git-like version control system for researchers to share notes and annotations 
            about archival collections. Accelerate your research by building on the work of others.
          </p>
          <Button 
            size="lg" 
            className="px-8 py-4 text-lg"
            onClick={() => window.location.href = '/api/login'}
          >
            Get Started
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <span>Collaborative Annotation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Work together to document archival collections. Share insights, build on others' research, 
                and create comprehensive guides to historical materials.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                <span>Git-like Branching</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create alternative interpretations through branching. View the same archival materials 
                through different scholarly lenses and disciplinary frameworks.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <span>Advanced Search</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Find relevant research notes across archives, branches, and contributors. 
                Save time and money by knowing what you'll find before visiting archives.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Reduce Barriers to Archival Research
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Graduate students and underfunded researchers can use existing notes to avoid redundant 
            archival visits. Identify items of interest using community notes before your visit.
          </p>
        </div>
      </div>
    </div>
  );
}
