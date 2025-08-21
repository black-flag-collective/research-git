import {
  users,
  archives,
  collections,
  boxes,
  folders,
  branches,
  notes,
  pullRequests,
  type User,
  type UpsertUser,
  type Archive,
  type InsertArchive,
  type Collection,
  type InsertCollection,
  type Box,
  type InsertBox,
  type Folder,
  type InsertFolder,
  type Branch,
  type InsertBranch,
  type Note,
  type InsertNote,
  type PullRequest,
  type InsertPullRequest,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, like, or } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Archive operations
  getArchives(): Promise<Archive[]>;
  getArchive(id: string): Promise<Archive | undefined>;
  createArchive(archive: InsertArchive): Promise<Archive>;
  
  // Collection operations
  getCollectionsByArchive(archiveId: string): Promise<Collection[]>;
  getCollection(id: string): Promise<Collection | undefined>;
  createCollection(collection: InsertCollection): Promise<Collection>;
  
  // Box operations
  getBoxesByCollection(collectionId: string): Promise<Box[]>;
  getBox(id: string): Promise<Box | undefined>;
  createBox(box: InsertBox): Promise<Box>;
  
  // Folder operations
  getFoldersByBox(boxId: string): Promise<Folder[]>;
  getFolder(id: string): Promise<Folder | undefined>;
  createFolder(folder: InsertFolder): Promise<Folder>;
  
  // Branch operations
  getBranchesByCollection(collectionId: string): Promise<Branch[]>;
  getBranch(collectionId: string, name: string): Promise<Branch | undefined>;
  createBranch(branch: InsertBranch): Promise<Branch>;
  
  // Note operations
  getNoteByFolderAndBranch(folderId: string, branchName: string): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: string, content: string, title: string): Promise<Note>;
  searchNotes(query: string, archiveId?: string, branchName?: string): Promise<Note[]>;
  
  // Pull Request operations
  getPullRequestsByFolder(folderId: string): Promise<PullRequest[]>;
  getPullRequest(id: string): Promise<PullRequest | undefined>;
  createPullRequest(pr: InsertPullRequest): Promise<PullRequest>;
  updatePullRequestStatus(id: string, status: string, reviewerId?: string): Promise<PullRequest>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Archive operations
  async getArchives(): Promise<Archive[]> {
    return await db.select().from(archives).orderBy(archives.name);
  }

  async getArchive(id: string): Promise<Archive | undefined> {
    const [archive] = await db.select().from(archives).where(eq(archives.id, id));
    return archive;
  }

  async createArchive(archive: InsertArchive): Promise<Archive> {
    const [newArchive] = await db.insert(archives).values(archive).returning();
    return newArchive;
  }

  // Collection operations
  async getCollectionsByArchive(archiveId: string): Promise<Collection[]> {
    return await db.select().from(collections).where(eq(collections.archiveId, archiveId)).orderBy(collections.name);
  }

  async getCollection(id: string): Promise<Collection | undefined> {
    const [collection] = await db.select().from(collections).where(eq(collections.id, id));
    return collection;
  }

  async createCollection(collection: InsertCollection): Promise<Collection> {
    const [newCollection] = await db.insert(collections).values(collection).returning();
    return newCollection;
  }

  // Box operations
  async getBoxesByCollection(collectionId: string): Promise<Box[]> {
    return await db.select().from(boxes).where(eq(boxes.collectionId, collectionId)).orderBy(boxes.name);
  }

  async getBox(id: string): Promise<Box | undefined> {
    const [box] = await db.select().from(boxes).where(eq(boxes.id, id));
    return box;
  }

  async createBox(box: InsertBox): Promise<Box> {
    const [newBox] = await db.insert(boxes).values(box).returning();
    return newBox;
  }

  // Folder operations
  async getFoldersByBox(boxId: string): Promise<Folder[]> {
    return await db.select().from(folders).where(eq(folders.boxId, boxId)).orderBy(folders.name);
  }

  async getFolder(id: string): Promise<Folder | undefined> {
    const [folder] = await db.select().from(folders).where(eq(folders.id, id));
    return folder;
  }

  async createFolder(folder: InsertFolder): Promise<Folder> {
    const [newFolder] = await db.insert(folders).values(folder).returning();
    return newFolder;
  }

  // Branch operations
  async getBranchesByCollection(collectionId: string): Promise<Branch[]> {
    return await db.select().from(branches).where(eq(branches.collectionId, collectionId)).orderBy(branches.name);
  }

  async getBranch(collectionId: string, name: string): Promise<Branch | undefined> {
    const [branch] = await db.select().from(branches).where(
      and(eq(branches.collectionId, collectionId), eq(branches.name, name))
    );
    return branch;
  }

  async createBranch(branch: InsertBranch): Promise<Branch> {
    const [newBranch] = await db.insert(branches).values(branch).returning();
    return newBranch;
  }

  // Note operations
  async getNoteByFolderAndBranch(folderId: string, branchName: string): Promise<Note | undefined> {
    const [note] = await db.select().from(notes).where(
      and(eq(notes.folderId, folderId), eq(notes.branchName, branchName))
    );
    return note;
  }

  async createNote(note: InsertNote): Promise<Note> {
    const [newNote] = await db.insert(notes).values(note).returning();
    return newNote;
  }

  async updateNote(id: string, content: string, title: string): Promise<Note> {
    const [updatedNote] = await db
      .update(notes)
      .set({ content, title, updatedAt: new Date() })
      .where(eq(notes.id, id))
      .returning();
    return updatedNote;
  }

  async searchNotes(query: string, archiveId?: string, branchName?: string): Promise<Note[]> {
    let searchQuery = db.select().from(notes);
    
    const conditions = [
      or(
        like(notes.title, `%${query}%`),
        like(notes.content, `%${query}%`)
      )
    ];

    if (branchName) {
      conditions.push(eq(notes.branchName, branchName));
    }

    // @ts-ignore - we'll handle the archive filter in the application layer for now
    return await searchQuery.where(and(...conditions)).orderBy(desc(notes.updatedAt));
  }

  // Pull Request operations
  async getPullRequestsByFolder(folderId: string): Promise<PullRequest[]> {
    return await db.select().from(pullRequests).where(eq(pullRequests.folderId, folderId)).orderBy(desc(pullRequests.createdAt));
  }

  async getPullRequest(id: string): Promise<PullRequest | undefined> {
    const [pr] = await db.select().from(pullRequests).where(eq(pullRequests.id, id));
    return pr;
  }

  async createPullRequest(pr: InsertPullRequest): Promise<PullRequest> {
    const [newPR] = await db.insert(pullRequests).values(pr).returning();
    return newPR;
  }

  async updatePullRequestStatus(id: string, status: string, reviewerId?: string): Promise<PullRequest> {
    const [updatedPR] = await db
      .update(pullRequests)
      .set({ status, reviewerId, updatedAt: new Date() })
      .where(eq(pullRequests.id, id))
      .returning();
    return updatedPR;
  }
}

export const storage = new DatabaseStorage();
