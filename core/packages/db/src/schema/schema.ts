import {
	pgTable,
	serial,
	varchar,
	text,
	integer,
	boolean,
	timestamp,
	bigint,
	uniqueIndex,
	index,
	unique,
	check,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { userId } from "./utils";

export const hacker = pgTable(
	"hacker",
	{
		id: serial("id").primaryKey(),
    userId: userId(),
		telegramUsername: bigint("telegram_userName", { mode: "number" }).notNull().unique(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => {
		return {
			telegramIdIdx: uniqueIndex("user_telegram_username_idx").on(table.telegramUsername)
		};
	},
);

export const challenges = pgTable(
	"challenges",
	{
		id: serial("id").primaryKey(),
		slug: varchar("slug", { length: 100 }).notNull().unique(),
		title: varchar("title", { length: 255 }).notNull(),
		description: text("description").notNull(),
		category: varchar("category", { length: 50 }),
		points: integer("points"),
		flag: varchar("correct_flag", { length: 255 }).notNull(),
		isActive: boolean("is_active").default(true).notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => {
		return {
			slugIdx: uniqueIndex("challenges_slug_idx").on(table.slug),
			categoryIdx: index("challenges_category_idx").on(table.category),
			pointsCheck: check(
				"challenges_points_check",
				sql`${table.points} IS NULL OR ${table.points} >= 0`,
			),
		};
	},
);

export const flagSubmissions = pgTable(
	"flag_submissions",
	{
		id: serial("id").primaryKey(),
		userId: userId(),
		challengeId: integer("challenge_id")
			.notNull()
			.references(() => challenges.id, { onDelete: "set null" }),
		submittedFlag: text("submitted_flag").notNull(),
		isCorrect: boolean("is_correct").default(false),
		submittedAt: timestamp("submitted_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		telegramChatId: bigint("telegram_chat_id", { mode: "number" }).notNull(),
	},
	(table) => {
		return {
			userIdx: index("submissions_user_id_idx").on(table.userId),
			challengeIdx: index("submissions_challenge_id_idx").on(table.challengeId),
			uniqueUserChallengeSubmission: unique(
				"submissions_user_challenge_unique",
			).on(table.userId, table.challengeId),
		};
	},
);

export const badges = pgTable(
	"badges",
	{
		id: serial("id").primaryKey(),
		userId: userId(),
		name: varchar("name", { length: 100 }).notNull(),
		description: text("description"),
		createdBy: varchar("created_by", { length: 100 }).notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => {
		return {
			userIdx: index("badges_user_id_idx").on(table.userId),
		};
	},
);

export const hackerRelations = relations(hacker, ({ many }) => ({
	submissions: many(flagSubmissions),
}));

export const challengesRelations = relations(challenges, ({ many }) => ({
	submissions: many(flagSubmissions),
}));

export const flagSubmissionsRelations = relations(
	flagSubmissions,
	({ one }) => ({
		user: one(hacker, {
			fields: [flagSubmissions.userId],
			references: [hacker.id],
		}),
		challenge: one(challenges, {
			fields: [flagSubmissions.challengeId],
			references: [challenges.id],
		}),
	}),
);

export const leaderboard = pgTable(
	"leaderboard",
	{
		id: serial("id").primaryKey(),
		userId: userId(),
		totalPoints: integer("total_points").default(0).notNull(),
		rank: integer("rank").default(0).notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => {
		return {
			userIdx: uniqueIndex("leaderboard_user_id_idx").on(table.userId),
		};
	},
);

export const analytics = pgTable(
	"analytics",
	{
		id: serial("id").primaryKey(),
		userId: userId(),
		challengeId: integer("challenge_id")
			.notNull()
			.references(() => challenges.id, { onDelete: "set null" }),
		attempts: integer("attempts").default(0).notNull(),
		lastAttemptAt: timestamp("last_attempt_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => {
		return {
			userChallengeIdx: uniqueIndex("analytics_user_challenge_idx").on(
				table.userId,
				table.challengeId,
			),
		};
	},
);
