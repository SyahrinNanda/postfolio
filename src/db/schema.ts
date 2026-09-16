import { relations, sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

// ============================================================================
// Better Auth Tables
// ============================================================================

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .default(false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = sqliteTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)]
);

export const account = sqliteTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", {
      mode: "timestamp_ms",
    }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", {
      mode: "timestamp_ms",
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)]
);

export const verification = sqliteTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);

// ============================================================================
// Portfolio Tables
// ============================================================================

export const profiles = sqliteTable("profiles", {
  id: text("id").primaryKey(),
  fullName: text("full_name").notNull(),
  professionalTitle: text("professional_title").notNull(),
  profilePhoto: text("profile_photo"),
  shortBio: text("short_bio"),
  detailedBio: text("detailed_bio"),
  careerFocus: text("career_focus"),
  location: text("location"),
  email: text("email"),
  phone: text("phone"),
  availability: text("availability"),
  aboutHeadline: text("about_headline"),
  aboutLead: text("about_lead"),
  principles: text("principles", { mode: "json" }).$type<
    Array<{ number: string; title: string; description: string }>
  >(),
  processes: text("processes", { mode: "json" }).$type<
    Array<{ title: string; description: string }>
  >(),
  highlights: text("highlights", { mode: "json" }).$type<
    Array<{ value: string; label: string }>
  >(),
  socialLinks: text("social_links", { mode: "json" }).$type<{
    github?: string;
    linkedin?: string;
    website?: string;
    twitter?: string;
  }>(),
  cvFileUrl: text("cv_file_url"),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
});

export const projects = sqliteTable(
  "projects",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    shortDescription: text("short_description"),
    fullDescription: text("full_description"),
    projectType: text("project_type"),
    role: text("role"),
    duration: text("duration"),
    status: text("status", {
      enum: ["published", "draft", "archived"],
    }).default("draft"),
    thumbnail: text("thumbnail"),
    problem: text("problem"),
    solution: text("solution"),
    architecture: text("architecture", { mode: "json" }).$type<string[]>(),
    challenges: text("challenges", { mode: "json" }).$type<string[]>(),
    result: text("result", { mode: "json" }).$type<[string, string][]>(),
    requirements: text("requirements", { mode: "json" }).$type<
      [string, string][]
    >(),
    decisions: text("decisions", { mode: "json" }).$type<
      [string, string][]
    >(),
    tables: text("tables", { mode: "json" }).$type<[string, string[]][]>(),
    implementation: text("implementation"),
    testing: text("testing"),
    lessons: text("lessons"),
    githubUrl: text("github_url"),
    liveDemoUrl: text("live_demo_url"),
    featured: integer("featured", { mode: "boolean" }).default(false),
    order: integer("order").default(0),
    year: text("year"),
    color: text("color"),
    symbol: text("symbol"),
    num: text("num"),
    label: text("label"),
    category: text("category"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("projects_slug_idx").on(table.slug),
    index("projects_status_idx").on(table.status),
    index("projects_featured_idx").on(table.featured),
  ]
);

export const projectImages = sqliteTable(
  "project_images",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    imageUrl: text("image_url").notNull(),
    caption: text("caption"),
    order: integer("order").default(0),
  },
  (table) => [index("project_images_projectId_idx").on(table.projectId)]
);

export const projectFeatures = sqliteTable(
  "project_features",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    order: integer("order").default(0),
  },
  (table) => [index("project_features_projectId_idx").on(table.projectId)]
);

export const technologies = sqliteTable("technologies", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon"),
  category: text("category"),
  color: text("color"),
  website: text("website"),
  status: text("status", { enum: ["active", "inactive"] }).default("active"),
  order: integer("order").default(0),
});

export const projectTechnologies = sqliteTable(
  "project_technologies",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    technologyId: text("technology_id")
      .notNull()
      .references(() => technologies.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("project_tech_projectId_idx").on(table.projectId),
    index("project_tech_technologyId_idx").on(table.technologyId),
  ]
);

export const skills = sqliteTable("skills", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category"),
  proficiency: integer("proficiency").default(0),
  years: integer("years").default(0),
  status: text("status", { enum: ["active", "inactive"] }).default("active"),
  order: integer("order").default(0),
});

export const experiences = sqliteTable("experiences", {
  id: text("id").primaryKey(),
  company: text("company").notNull(),
  position: text("position").notNull(),
  overline: text("overline"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  period: text("period"),
  description: text("description"),
  responsibilities: text("responsibilities", { mode: "json" }).$type<
    string[]
  >(),
  achievements: text("achievements", { mode: "json" }).$type<string[]>(),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  isCurrent: integer("is_current", { mode: "boolean" }).default(false),
  status: text("status", { enum: ["active", "inactive"] }).default("active"),
  order: integer("order").default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
});

export const experienceTechnologies = sqliteTable(
  "experience_technologies",
  {
    id: text("id").primaryKey(),
    experienceId: text("experience_id")
      .notNull()
      .references(() => experiences.id, { onDelete: "cascade" }),
    technologyId: text("technology_id")
      .notNull()
      .references(() => technologies.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("exp_tech_experienceId_idx").on(table.experienceId),
    index("exp_tech_technologyId_idx").on(table.technologyId),
  ]
);

export const articles = sqliteTable(
  "articles",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    coverImage: text("cover_image"),
    coverColor: text("cover_color"),
    coverMark: text("cover_mark"),
    summary: text("summary"),
    content: text("content"),
    sections: text("sections", { mode: "json" }).$type<
      {
        id: string;
        title: string;
        paragraphs: string[];
        callout?: string;
        bullets?: string[];
        code?: string;
        quote?: string;
      }[]
    >(),
    lead: text("lead"),
    category: text("category"),
    categoryLabel: text("category_label"),
    tags: text("tags", { mode: "json" }).$type<string[]>(),
    searchKeywords: text("search_keywords"),
    readDuration: text("read_duration"),
    publishedDate: text("published_date"),
    author: text("author"),
    status: text("status", {
      enum: ["published", "draft", "archived"],
    }).default("draft"),
    hasFullPage: integer("has_full_page", { mode: "boolean" }).default(false),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("articles_slug_idx").on(table.slug),
    index("articles_status_idx").on(table.status),
    index("articles_category_idx").on(table.category),
  ]
);

export const contacts = sqliteTable("contacts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  status: text("status", {
    enum: ["unread", "read", "replied", "archived"],
  }).default("unread"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
});

export const settings = sqliteTable("settings", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value"),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
});

