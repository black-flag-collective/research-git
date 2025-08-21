import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Archives table
export const archives = pgTable("archives", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  institution: varchar("institution", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Collections table
export const collections = pgTable("collections", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  archiveId: uuid("archive_id").notNull().references(() => archives.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Boxes table
export const boxes = pgTable("boxes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  collectionId: uuid("collection_id").notNull().references(() => collections.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Folders table
export const folders = pgTable("folders", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  boxId: uuid("box_id").notNull().references(() => boxes.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Branches table
export const branches = pgTable("branches", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  collectionId: uuid("collection_id").notNull().references(() => collections.id),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  parentBranch: varchar("parent_branch", { length: 100 }),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notes table
export const notes = pgTable("notes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  folderId: uuid("folder_id").notNull().references(() => folders.id),
  branchName: varchar("branch_name", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  authorId: varchar("author_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Pull Requests table
export const pullRequests = pgTable("pull_requests", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  folderId: uuid("folder_id").notNull().references(() => folders.id),
  sourceBranch: varchar("source_branch", { length: 100 }).notNull(),
  targetBranch: varchar("target_branch", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  authorId: varchar("author_id").notNull().references(() => users.id),
  status: varchar("status", { length: 20 }).notNull().default("open"), // open, merged, closed
  reviewerId: varchar("reviewer_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const archivesRelations = relations(archives, ({ many }) => ({
  collections: many(collections),
}));

export const collectionsRelations = relations(collections, ({ one, many }) => ({
  archive: one(archives, {
    fields: [collections.archiveId],
    references: [archives.id],
  }),
  boxes: many(boxes),
  branches: many(branches),
}));

export const boxesRelations = relations(boxes, ({ one, many }) => ({
  collection: one(collections, {
    fields: [boxes.collectionId],
    references: [collections.id],
  }),
  folders: many(folders),
}));

export const foldersRelations = relations(folders, ({ one, many }) => ({
  box: one(boxes, {
    fields: [folders.boxId],
    references: [boxes.id],
  }),
  notes: many(notes),
  pullRequests: many(pullRequests),
}));

export const branchesRelations = relations(branches, ({ one }) => ({
  collection: one(collections, {
    fields: [branches.collectionId],
    references: [collections.id],
  }),
  createdByUser: one(users, {
    fields: [branches.createdBy],
    references: [users.id],
  }),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  folder: one(folders, {
    fields: [notes.folderId],
    references: [folders.id],
  }),
  author: one(users, {
    fields: [notes.authorId],
    references: [users.id],
  }),
}));

export const pullRequestsRelations = relations(pullRequests, ({ one }) => ({
  folder: one(folders, {
    fields: [pullRequests.folderId],
    references: [folders.id],
  }),
  author: one(users, {
    fields: [pullRequests.authorId],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [pullRequests.reviewerId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertArchiveSchema = createInsertSchema(archives).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCollectionSchema = createInsertSchema(collections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBoxSchema = createInsertSchema(boxes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFolderSchema = createInsertSchema(folders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBranchSchema = createInsertSchema(branches).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPullRequestSchema = createInsertSchema(pullRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Archive = typeof archives.$inferSelect;
export type InsertArchive = z.infer<typeof insertArchiveSchema>;
export type Collection = typeof collections.$inferSelect;
export type InsertCollection = z.infer<typeof insertCollectionSchema>;
export type Box = typeof boxes.$inferSelect;
export type InsertBox = z.infer<typeof insertBoxSchema>;
export type Folder = typeof folders.$inferSelect;
export type InsertFolder = z.infer<typeof insertFolderSchema>;
export type Branch = typeof branches.$inferSelect;
export type InsertBranch = z.infer<typeof insertBranchSchema>;
export type Note = typeof notes.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type PullRequest = typeof pullRequests.$inferSelect;
export type InsertPullRequest = z.infer<typeof insertPullRequestSchema>;
