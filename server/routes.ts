import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertArchiveSchema,
  insertCollectionSchema,
  insertBoxSchema,
  insertFolderSchema,
  insertBranchSchema,
  insertNoteSchema,
  insertPullRequestSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Archive routes
  app.get("/api/archives", isAuthenticated, async (req, res) => {
    try {
      const archives = await storage.getArchives();
      res.json(archives);
    } catch (error) {
      console.error("Error fetching archives:", error);
      res.status(500).json({ message: "Failed to fetch archives" });
    }
  });

  app.get("/api/archives/:id", isAuthenticated, async (req, res) => {
    try {
      const archive = await storage.getArchive(req.params.id);
      if (!archive) {
        return res.status(404).json({ message: "Archive not found" });
      }
      res.json(archive);
    } catch (error) {
      console.error("Error fetching archive:", error);
      res.status(500).json({ message: "Failed to fetch archive" });
    }
  });

  app.post("/api/archives", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertArchiveSchema.parse(req.body);
      const archive = await storage.createArchive(validatedData);
      res.json(archive);
    } catch (error) {
      console.error("Error creating archive:", error);
      res.status(400).json({ message: "Invalid archive data" });
    }
  });

  // Collection routes
  app.get("/api/archives/:archiveId/collections", isAuthenticated, async (req, res) => {
    try {
      const collections = await storage.getCollectionsByArchive(req.params.archiveId);
      res.json(collections);
    } catch (error) {
      console.error("Error fetching collections:", error);
      res.status(500).json({ message: "Failed to fetch collections" });
    }
  });

  app.get("/api/collections/:id", isAuthenticated, async (req, res) => {
    try {
      const collection = await storage.getCollection(req.params.id);
      if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
      }
      res.json(collection);
    } catch (error) {
      console.error("Error fetching collection:", error);
      res.status(500).json({ message: "Failed to fetch collection" });
    }
  });

  app.post("/api/collections", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertCollectionSchema.parse(req.body);
      const collection = await storage.createCollection(validatedData);
      res.json(collection);
    } catch (error) {
      console.error("Error creating collection:", error);
      res.status(400).json({ message: "Invalid collection data" });
    }
  });

  // Box routes
  app.get("/api/collections/:collectionId/boxes", isAuthenticated, async (req, res) => {
    try {
      const boxes = await storage.getBoxesByCollection(req.params.collectionId);
      res.json(boxes);
    } catch (error) {
      console.error("Error fetching boxes:", error);
      res.status(500).json({ message: "Failed to fetch boxes" });
    }
  });

  app.post("/api/boxes", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertBoxSchema.parse(req.body);
      const box = await storage.createBox(validatedData);
      res.json(box);
    } catch (error) {
      console.error("Error creating box:", error);
      res.status(400).json({ message: "Invalid box data" });
    }
  });

  // Folder routes
  app.get("/api/boxes/:boxId/folders", isAuthenticated, async (req, res) => {
    try {
      const folders = await storage.getFoldersByBox(req.params.boxId);
      res.json(folders);
    } catch (error) {
      console.error("Error fetching folders:", error);
      res.status(500).json({ message: "Failed to fetch folders" });
    }
  });

  app.post("/api/folders", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertFolderSchema.parse(req.body);
      const folder = await storage.createFolder(validatedData);
      res.json(folder);
    } catch (error) {
      console.error("Error creating folder:", error);
      res.status(400).json({ message: "Invalid folder data" });
    }
  });

  // Branch routes
  app.get("/api/collections/:collectionId/branches", isAuthenticated, async (req, res) => {
    try {
      const branches = await storage.getBranchesByCollection(req.params.collectionId);
      res.json(branches);
    } catch (error) {
      console.error("Error fetching branches:", error);
      res.status(500).json({ message: "Failed to fetch branches" });
    }
  });

  app.post("/api/branches", isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertBranchSchema.parse({
        ...req.body,
        createdBy: req.user.claims.sub,
      });
      const branch = await storage.createBranch(validatedData);
      res.json(branch);
    } catch (error) {
      console.error("Error creating branch:", error);
      res.status(400).json({ message: "Invalid branch data" });
    }
  });

  // Note routes
  app.get("/api/folders/:folderId/notes/:branchName", isAuthenticated, async (req, res) => {
    try {
      const note = await storage.getNoteByFolderAndBranch(req.params.folderId, req.params.branchName);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json(note);
    } catch (error) {
      console.error("Error fetching note:", error);
      res.status(500).json({ message: "Failed to fetch note" });
    }
  });

  app.post("/api/notes", isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertNoteSchema.parse({
        ...req.body,
        authorId: req.user.claims.sub,
      });
      const note = await storage.createNote(validatedData);
      res.json(note);
    } catch (error) {
      console.error("Error creating note:", error);
      res.status(400).json({ message: "Invalid note data" });
    }
  });

  app.put("/api/notes/:id", isAuthenticated, async (req, res) => {
    try {
      const { content, title } = req.body;
      const note = await storage.updateNote(req.params.id, content, title);
      res.json(note);
    } catch (error) {
      console.error("Error updating note:", error);
      res.status(500).json({ message: "Failed to update note" });
    }
  });

  app.get("/api/search/notes", isAuthenticated, async (req, res) => {
    try {
      const { query, archiveId, branchName } = req.query;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: "Query parameter is required" });
      }
      
      const notes = await storage.searchNotes(
        query, 
        archiveId as string, 
        branchName as string
      );
      res.json(notes);
    } catch (error) {
      console.error("Error searching notes:", error);
      res.status(500).json({ message: "Failed to search notes" });
    }
  });

  // Pull Request routes
  app.get("/api/folders/:folderId/pull-requests", isAuthenticated, async (req, res) => {
    try {
      const pullRequests = await storage.getPullRequestsByFolder(req.params.folderId);
      res.json(pullRequests);
    } catch (error) {
      console.error("Error fetching pull requests:", error);
      res.status(500).json({ message: "Failed to fetch pull requests" });
    }
  });

  app.post("/api/pull-requests", isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertPullRequestSchema.parse({
        ...req.body,
        authorId: req.user.claims.sub,
      });
      const pullRequest = await storage.createPullRequest(validatedData);
      res.json(pullRequest);
    } catch (error) {
      console.error("Error creating pull request:", error);
      res.status(400).json({ message: "Invalid pull request data" });
    }
  });

  app.patch("/api/pull-requests/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { status } = req.body;
      const reviewerId = req.user.claims.sub;
      const pullRequest = await storage.updatePullRequestStatus(req.params.id, status, reviewerId);
      res.json(pullRequest);
    } catch (error) {
      console.error("Error updating pull request:", error);
      res.status(500).json({ message: "Failed to update pull request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
