import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  age: int().notNull(),
  email: text().notNull().unique(),
});

export const STATUS_ENUM = ["PENDING", "APPROVED", "REJECTED"] as const;
export const USER_ROLE = ["USER", "ADMIN"] as const;
export const BORROW_STATUS = ["RETURNED", "BORROWED"] as const;

// export const STATUS_ENUM = pgEnum("status", [
//   "PENDING",
//   "APPROVED",
//   "REJECTED",
// ]);
// export const ROLE_ENUM = pgEnum("role", ["USER", "ADMIN"]);
// export const BORROW_STATUS_ENUM = pgEnum("borrow_status", [
//   "BORROWED",
//   "RETURNED",
// ]);

// export const users = pgTable("users", {
//   id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
//   fullName: varchar("full_name", { length: 255 }).notNull(),
//   email: text("email").notNull().unique(),
//   universityId: integer("university_id").notNull().unique(),
//   password: text("password").notNull(),
//   universityCard: text("university_card").notNull(),
//   status: STATUS_ENUM("status").default("PENDING"),
//   role: ROLE_ENUM("role").default("USER"),
//   lastActivityDate: date("last_activity_date").defaultNow(),
//   createdAt: timestamp("created_at", {
//     withTimezone: true,
//   }).defaultNow(),
// });

export const authUsersTable = sqliteTable("auth_users", {
  id: int("id").primaryKey({ autoIncrement: true }),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  universityId: int("university_id").notNull().unique(),
  password: text("password").notNull(),
  universityCard: text("university_card").notNull(),
  status: text("status")
    .$type<`${(typeof STATUS_ENUM)[number]}`>()
    .notNull()
    .default("PENDING"),
  role: text("role")
    .$type<`${(typeof USER_ROLE)[number]}`>()
    .notNull()
    .default("USER"),
  lastActivityDate: text("last_activity_date").default(sql`(CURRENT_DATE)`),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

// export const books = pgTable("books", {
//   id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
//   title: varchar("title", { length: 255 }).notNull(),
//   author: varchar("author", { length: 255 }).notNull(),
//   genre: text("genre").notNull(),
//   rating: integer("rating").notNull(),
//   coverUrl: text("cover_url").notNull(),
//   coverColor: varchar("cover_color", { length: 7 }).notNull(),
//   description: text("description").notNull(),
//   totalCopies: integer("total_copies").notNull().default(1),
//   availableCopies: integer("available_copies").notNull().default(0),
//   videoUrl: text("video_url").notNull(),
//   summary: varchar("summary").notNull(),
//   createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
// });

export const books = sqliteTable("books", {
  id: int("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  author: text("author").notNull(),
  genre: text("genre").notNull(),
  rating: int("rating").notNull(),
  coverUrl: text("cover_url").notNull(),
  coverColor: text("cover_color").notNull(),
  description: text("description").notNull(),
  totalCopies: int("total_copies").notNull().default(1),
  availableCopies: int("available_copies").notNull().default(0),
  videoUrl: text("video_url").notNull(),
  summary: text("summary").notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

// export const borrowRecords = pgTable("borrow_records", {
//   id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
//   userId: uuid("user_id")
//     .references(() => users.id)
//     .notNull(),
//   bookId: uuid("book_id")
//     .references(() => books.id)
//     .notNull(),
//   borrowDate: timestamp("borrow_date", { withTimezone: true })
//     .defaultNow()
//     .notNull(),
//   dueDate: date("due_date").notNull(),
//   returnDate: date("return_date"),
//   status: BORROW_STATUS_ENUM("status").default("BORROWED").notNull(),
//   createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
// });

export const borrowRecords = sqliteTable("borrow_records", {
  id: int("id").primaryKey({ autoIncrement: true }),
  userId: int("user_id")
    .references(() => authUsersTable.id)
    .notNull(),
  bookId: int("book_id")
    .references(() => books.id)
    .notNull(),
  borrowDate: text("borrow_date")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  dueDate: text("due_date").notNull(),
  returnDate: text("return_date"),
  status: text("status")
    .$type<`${(typeof BORROW_STATUS)[number]}`>()
    .default("BORROWED")
    .notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});
