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
