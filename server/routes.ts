import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
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
  // Mock user for prototyping
  const mockUser = {
    id: "mock-user-1",
    email: "researcher@university.edu",
    firstName: "Alex",
    lastName: "Researcher",
    profileImageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Initialize mock data
  await initializeMockData();

  // Mock auth route for frontend
  app.get('/api/auth/user', async (req, res) => {
    res.json(mockUser);
  });

  async function initializeMockData() {
    try {
      // Check if data already exists
      const existingArchives = await storage.getArchives();
      if (existingArchives.length > 0) return;

      // Create mock user first
      await storage.upsertUser(mockUser);

      // Create mock archive
      const archive = await storage.createArchive({
        name: "National Museum of American History",
        institution: "Smithsonian Institution",
        description: "The National Museum of American History collects, preserves, and displays the heritage of the United States."
      });

      // Create mock collection
      const collection = await storage.createCollection({
        archiveId: archive.id,
        name: "InBae Yoon Papers",
        description: "Personal and professional papers of Dr. InBae Yoon, inventor of the contraceptive device known as the Fallope Ring."
      });

      // Create mock box
      const box = await storage.createBox({
        collectionId: collection.id,
        name: "Box 1: Personal Correspondence and Clinical Studies",
        description: "Contains personal letters and early clinical trial documentation."
      });

      // Create mock folders
      const folder1 = await storage.createFolder({
        boxId: box.id,
        name: "Folder 1: Clinical Trial Data",
        description: "Original clinical study data and patient records from Fallope Ring trials."
      });

      const folder2 = await storage.createFolder({
        boxId: box.id,
        name: "Folder 2: Patent Documents",
        description: "Patent applications and related legal documentation."
      });

      // Create mock branches
      await storage.createBranch({
        collectionId: collection.id,
        name: "feminist-health-perspectives",
        description: "Interpreting the collection through the lens of women's health and reproductive rights.",
        parentBranch: "main",
        createdBy: mockUser.id
      });

      await storage.createBranch({
        collectionId: collection.id,
        name: "business-medicine",
        description: "Focus on the commercial and medical innovation aspects of the contraceptive development.",
        parentBranch: "main",
        createdBy: mockUser.id
      });

      // Create mock notes
      await storage.createNote({
        folderId: folder1.id,
        branchName: "main",
        title: "Clinical Trial Overview",
        content: "# Clinical Trial Data\n\nThis folder contains comprehensive clinical study data from the Fallope Ring contraceptive device trials conducted between 1965-1970.\n\n## Key Findings\n- Trial included 2,000 participants across 5 clinical sites\n- Efficacy rate of 97.2% over 2-year study period\n- Minimal side effects reported in less than 3% of participants\n\n## Documentation Includes\n- Individual patient charts\n- Statistical analysis reports\n- Regulatory submission documents\n\n*Note: All patient data has been de-identified in accordance with privacy regulations.*",
        authorId: mockUser.id
      });

      await storage.createNote({
        folderId: folder1.id,
        branchName: "feminist-health-perspectives",
        title: "Women's Agency in Contraceptive Research",
        content: "# Reframing the Clinical Data: Women's Autonomy\n\nReviewing these clinical trials through a feminist health lens reveals important insights about women's reproductive autonomy in the 1960s.\n\n## Participant Agency\nWhile the original documentation focuses on medical efficacy, examining the informed consent processes and participant feedback reveals:\n\n- Women actively sought long-term contraceptive options\n- Participants expressed desire for methods they could control\n- Many reported relief at having a reversible, non-hormonal option\n\n## Historical Context\nThis research occurred during a critical period when:\n- Birth control access was still restricted in many states\n- Women had limited contraceptive choices\n- The women's liberation movement was gaining momentum\n\n## Research Questions for Further Investigation\n- How did participants learn about the trial?\n- What were their motivations for participating?\n- How did socioeconomic factors influence access to the trial?",
        authorId: mockUser.id
      });

      console.log("Mock data initialized successfully");
    } catch (error) {
      console.error("Error initializing mock data:", error);
    }
  }

  // Archive routes
  app.get("/api/archives", async (req, res) => {
    try {
      const archives = await storage.getArchives();
      res.json(archives);
    } catch (error) {
      console.error("Error fetching archives:", error);
      res.status(500).json({ message: "Failed to fetch archives" });
    }
  });

  app.get("/api/archives/:archiveId", async (req, res) => {
    try {
      const archive = await storage.getArchive(req.params.archiveId);
      if (!archive) {
        return res.status(404).json({ message: "Archive not found" });
      }
      res.json(archive);
    } catch (error) {
      console.error("Error fetching archive:", error);
      res.status(500).json({ message: "Failed to fetch archive" });
    }
  });

  app.get("/api/archives/:archiveId/collections", async (req, res) => {
    try {
      const collections = await storage.getCollectionsByArchive(req.params.archiveId);
      res.json(collections);
    } catch (error) {
      console.error("Error fetching collections:", error);
      res.status(500).json({ message: "Failed to fetch collections" });
    }
  });

  app.post("/api/archives", async (req, res) => {
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

  app.get("/api/collections/:id", async (req, res) => {
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

  app.post("/api/collections", async (req, res) => {
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
  app.get("/api/collections/:collectionId/boxes", async (req, res) => {
    try {
      const boxes = await storage.getBoxesByCollection(req.params.collectionId);
      res.json(boxes);
    } catch (error) {
      console.error("Error fetching boxes:", error);
      res.status(500).json({ message: "Failed to fetch boxes" });
    }
  });

  app.post("/api/boxes", async (req, res) => {
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
  app.get("/api/boxes/:boxId/folders", async (req, res) => {
    try {
      const folders = await storage.getFoldersByBox(req.params.boxId);
      res.json(folders);
    } catch (error) {
      console.error("Error fetching folders:", error);
      res.status(500).json({ message: "Failed to fetch folders" });
    }
  });

  app.post("/api/folders", async (req, res) => {
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
  app.get("/api/collections/:collectionId/branches", async (req, res) => {
    try {
      const branches = await storage.getBranchesByCollection(req.params.collectionId);
      res.json(branches);
    } catch (error) {
      console.error("Error fetching branches:", error);
      res.status(500).json({ message: "Failed to fetch branches" });
    }
  });

  app.post("/api/branches", async (req, res) => {
    try {
      const validatedData = insertBranchSchema.parse({
        ...req.body,
        createdBy: mockUser.id,
      });
      const branch = await storage.createBranch(validatedData);
      res.json(branch);
    } catch (error) {
      console.error("Error creating branch:", error);
      res.status(400).json({ message: "Invalid branch data" });
    }
  });

  // Note routes
  app.get("/api/folders/:folderId/notes/:branchName", async (req, res) => {
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

  app.post("/api/notes", async (req, res) => {
    try {
      const validatedData = insertNoteSchema.parse({
        ...req.body,
        authorId: mockUser.id,
      });
      const note = await storage.createNote(validatedData);
      res.json(note);
    } catch (error) {
      console.error("Error creating note:", error);
      res.status(400).json({ message: "Invalid note data" });
    }
  });

  app.put("/api/notes/:id", async (req, res) => {
    try {
      const { content, title } = req.body;
      const note = await storage.updateNote(req.params.id, content, title);
      res.json(note);
    } catch (error) {
      console.error("Error updating note:", error);
      res.status(500).json({ message: "Failed to update note" });
    }
  });

  app.get("/api/search/notes", async (req, res) => {
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
  app.get("/api/folders/:folderId/pull-requests", async (req, res) => {
    try {
      const pullRequests = await storage.getPullRequestsByFolder(req.params.folderId);
      res.json(pullRequests);
    } catch (error) {
      console.error("Error fetching pull requests:", error);
      res.status(500).json({ message: "Failed to fetch pull requests" });
    }
  });

  app.post("/api/pull-requests", async (req, res) => {
    try {
      const validatedData = insertPullRequestSchema.parse({
        ...req.body,
        authorId: mockUser.id,
      });
      const pullRequest = await storage.createPullRequest(validatedData);
      res.json(pullRequest);
    } catch (error) {
      console.error("Error creating pull request:", error);
      res.status(400).json({ message: "Invalid pull request data" });
    }
  });

  app.patch("/api/pull-requests/:id", async (req, res) => {
    try {
      const { status } = req.body;
      const reviewerId = mockUser.id;
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
