import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, FileText, FolderOpen } from "lucide-react";
import Header from "../components/header";
import { Box, Folder } from "@shared/schema";

export default function Folders() {
  const { archiveId, collectionId } = useParams<{ archiveId: string; collectionId: string }>();
  
  const { data: boxes, isLoading } = useQuery<Box[]>({
    queryKey: [`/api/collections/${collectionId}/boxes`],
  });

  const { data: collection } = useQuery<{ name: string }>({
    queryKey: [`/api/collections/${collectionId}`],
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Link href={`/archives/${archiveId}/collections`}>
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Collections
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {collection?.name || "Collection"} - Boxes & Folders
          </h1>
          <p className="text-muted-foreground">
            Browse boxes and folders to explore research notes.
          </p>
        </div>

        <div className="space-y-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))
          ) : boxes && boxes.length > 0 ? (
            boxes.map((box) => (
              <Card key={box.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <CardTitle className="text-lg flex items-center">
                    <FolderOpen className="w-5 h-5 mr-2 text-primary" />
                    {box.name}
                  </CardTitle>
                  {box.description && (
                    <p className="text-sm text-muted-foreground mt-1">{box.description}</p>
                  )}
                </CardHeader>
                <CardContent className="pt-4">
                  <FoldersList boxId={box.id} archiveId={archiveId} collectionId={collectionId} />
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-16">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FolderOpen className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No Boxes Available</h3>
                <p className="text-muted-foreground">
                  Boxes and folders will appear here once they are added to this collection.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function FoldersList({ boxId, archiveId, collectionId }: { boxId: string; archiveId: string; collectionId: string }) {
  const { data: folders, isLoading } = useQuery<Folder[]>({
    queryKey: [`/api/boxes/${boxId}/folders`],
  });

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  if (!folders || folders.length === 0) {
    return <p className="text-sm text-muted-foreground">No folders in this box</p>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-3">
      {folders.map((folder) => (
        <Link
          key={folder.id}
          href={`/archives/${archiveId}/collections/${collectionId}/folders/${folder.id}`}
        >
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{folder.name}</p>
                  {folder.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {folder.description}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}