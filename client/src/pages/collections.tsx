import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, FolderOpen } from "lucide-react";
import Header from "../components/header";
import { Collection } from "@shared/schema";

export default function Collections() {
  const { archiveId } = useParams<{ archiveId: string }>();
  
  const { data: collections, isLoading } = useQuery<Collection[]>({
    queryKey: [`/api/archives/${archiveId}/collections`],
  });

  const { data: archive } = useQuery<{ name: string }>({
    queryKey: [`/api/archives/${archiveId}`],
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Archives
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {archive?.name || "Archive"} Collections
          </h1>
          <p className="text-muted-foreground">
            Browse collections to explore folders and research notes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))
          ) : collections && collections.length > 0 ? (
            collections.map((collection) => (
              <Card key={collection.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <FolderOpen className="w-5 h-5 mr-2 text-primary" />
                    {collection.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {collection.description || "No description available"}
                  </p>
                  <Link href={`/archives/${archiveId}/collections/${collection.id}`}>
                    <Button variant="outline" className="w-full">
                      Browse Folders
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card>
                <CardContent className="text-center py-16">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FolderOpen className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No Collections Available</h3>
                  <p className="text-muted-foreground mb-4">
                    Collections will appear here once they are added to this archive.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}