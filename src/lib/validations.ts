import { z } from "zod";

// ============================================================================
// Contact Form
// ============================================================================

export const contactFormSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(100),
  email: z.string().email("Format email tidak valid"),
  subject: z.string().min(3, "Subject minimal 3 karakter").max(200).optional(),
  message: z.string().min(10, "Pesan minimal 10 karakter").max(5000),
  companyUrl: z.string().optional().nullable(),
  _ts: z.union([z.number(), z.string()]).optional().nullable(),
});

// ============================================================================
// Profile
// ============================================================================

export const profileUpdateSchema = z.object({
  fullName: z.string().min(2).max(100),
  professionalTitle: z.string().min(2).max(100),
  profilePhoto: z.string().optional().nullable(),
  shortBio: z.string().max(500).optional().nullable(),
  detailedBio: z.string().max(5000).optional().nullable(),
  careerFocus: z.string().max(500).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  availability: z.string().max(200).optional().nullable(),
  aboutHeadline: z.string().max(300).optional().nullable(),
  aboutLead: z.string().max(2000).optional().nullable(),
  principles: z
    .array(
      z.object({
        number: z.string(),
        title: z.string(),
        description: z.string(),
      })
    )
    .optional()
    .nullable(),
  processes: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    )
    .optional()
    .nullable(),
  highlights: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .optional()
    .nullable(),
  socialLinks: z
    .object({
      github: z.string().optional(),
      linkedin: z.string().optional(),
      website: z.string().optional(),
      twitter: z.string().optional(),
    })
    .optional()
    .nullable(),
  cvFileUrl: z.string().optional().nullable(),
});

// ============================================================================
// Projects
// ============================================================================

export const createProjectSchema = z.object({
  title: z.string().min(2, "Title minimal 2 karakter").max(200),
  slug: z
    .string()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan strip"),
  shortDescription: z.string().max(500).optional().nullable(),
  fullDescription: z.string().max(10000).optional().nullable(),
  projectType: z.string().max(50).optional().nullable(),
  role: z.string().max(100).optional().nullable(),
  duration: z.string().max(100).optional().nullable(),
  status: z.enum(["published", "draft", "archived"]).default("draft"),
  thumbnail: z.string().optional().nullable(),
  problem: z.string().max(5000).optional().nullable(),
  solution: z.string().max(5000).optional().nullable(),
  architecture: z.array(z.string()).optional().nullable(),
  challenges: z.array(z.string()).optional().nullable(),
  result: z.array(z.tuple([z.string(), z.string()])).optional().nullable(),
  requirements: z.array(z.tuple([z.string(), z.string()])).optional().nullable(),
  decisions: z.array(z.tuple([z.string(), z.string()])).optional().nullable(),
  tables: z
    .array(z.tuple([z.string(), z.array(z.string())]))
    .optional()
    .nullable(),
  implementation: z.string().max(5000).optional().nullable(),
  testing: z.string().max(5000).optional().nullable(),
  githubUrl: z.string().optional().nullable(),
  liveDemoUrl: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  year: z.string().max(10).optional().nullable(),
  color: z.string().max(50).optional().nullable(),
  symbol: z.string().max(10).optional().nullable(),
  num: z.string().max(10).optional().nullable(),
  label: z.string().max(100).optional().nullable(),
  category: z.string().max(50).optional().nullable(),
  technologies: z.array(z.string()).optional(), // technology IDs
  features: z
    .array(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        order: z.number().int().default(0),
      })
    )
    .optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

// ============================================================================
// Experiences
// ============================================================================

export const createExperienceSchema = z.object({
  company: z.string().min(2).max(200),
  position: z.string().min(2).max(200),
  overline: z.string().max(200).optional().nullable(),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
  period: z.string().max(100).optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  responsibilities: z
    .union([
      z.array(z.string()),
      z
        .string()
        .transform((s) =>
          s
            .split("\n")
            .map((x) => x.trim())
            .filter(Boolean)
        ),
    ])
    .optional()
    .nullable(),
  achievements: z
    .union([
      z.array(z.string()),
      z
        .string()
        .transform((s) =>
          s
            .split("\n")
            .map((x) => x.trim())
            .filter(Boolean)
        ),
    ])
    .optional()
    .nullable(),
  isActive: z.boolean().default(true),
  isCurrent: z.boolean().default(false),
  status: z.enum(["active", "inactive"]).default("active"),
  order: z.number().int().default(0),
  technologies: z.array(z.string()).optional(), // technology IDs
});

export const updateExperienceSchema = createExperienceSchema.partial();

// ============================================================================
// Skills
// ============================================================================

export const createSkillSchema = z.object({
  name: z.string().min(1, "Nama skill minimal 1 karakter").max(100),
  category: z.string().max(50).optional().nullable(),
  proficiency: z.coerce.number().int().min(0).max(100).default(0),
  years: z.coerce.number().int().min(0).default(0),
  status: z.enum(["active", "inactive"]).default("active"),
  order: z.coerce.number().int().default(0),
});

export const updateSkillSchema = createSkillSchema.partial();

// ============================================================================
// Technologies
// ============================================================================

export const createTechnologySchema = z.object({
  name: z.string().min(1).max(100),
  icon: z.string().max(200).optional().nullable(),
  category: z.string().max(50).optional().nullable(),
  color: z.string().max(50).optional().nullable(),
  website: z
    .string()
    .url("URL website tidak valid (harus dimulai dengan http:// atau https://)")
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v)),
  status: z.enum(["active", "inactive"]).default("active"),
  order: z.number().int().default(0),
});

export const updateTechnologySchema = createTechnologySchema.partial();

// ============================================================================
// Articles
// ============================================================================

export const createArticleSchema = z.object({
  title: z.string().min(2).max(300),
  slug: z
    .string()
    .min(2)
    .max(300)
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan strip"),
  coverImage: z.string().optional().nullable(),
  coverColor: z.string().max(50).optional().nullable(),
  coverMark: z.string().max(100).optional().nullable(),
  summary: z.string().max(1000).optional().nullable(),
  content: z.string().max(50000).optional().nullable(),
  sections: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        paragraphs: z.array(z.string()),
        callout: z.string().optional(),
        bullets: z.array(z.string()).optional(),
        code: z.string().optional(),
        quote: z.string().optional(),
      })
    )
    .optional()
    .nullable(),
  lead: z.string().max(2000).optional().nullable(),
  category: z.string().max(50).optional().nullable(),
  categoryLabel: z.string().max(100).optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  searchKeywords: z.string().max(500).optional().nullable(),
  readDuration: z.string().max(20).optional().nullable(),
  publishedDate: z.string().optional().nullable(),
  author: z.string().max(100).optional().nullable(),
  status: z.enum(["published", "draft", "archived"]).default("draft"),
  hasFullPage: z.boolean().default(false),
});

export const updateArticleSchema = createArticleSchema.partial();

// ============================================================================
// Settings
// ============================================================================

export const capabilityItemSchema = z.object({
  id: z.string(),
  index: z.string(),
  icon: z.string(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
});

export const heroMetricItemSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const settingsUpdateSchema = z.object({
  siteName: z.string().max(200).optional(),
  siteUrl: z.string().url().optional().or(z.literal("")),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
  githubUsername: z.string().max(100).optional(),
  analyticsId: z.string().max(100).optional(),
  emailNotifications: z.boolean().optional(),
  showGithub: z.boolean().optional(),
  showArticles: z.boolean().optional(),
  maintenanceMode: z.boolean().optional(),

  // Homepage Hero & Ticker
  heroEyebrow: z.string().max(200).optional(),
  heroTitle: z.string().max(200).optional(),
  heroLead: z.string().max(1000).optional(),
  heroPrimaryStack: z.union([z.array(z.string()), z.string()]).optional(),
  heroMetrics: z.union([z.array(heroMetricItemSchema), z.string()]).optional(),
  tickerText: z.string().max(500).optional(),

  // Capabilities (Section 02)
  capabilities: z.union([z.array(capabilityItemSchema), z.string()]).optional(),
});

// ============================================================================
// Contact Messages (Admin CRUD)
// ============================================================================

export const contactStatusSchema = z.object({
  status: z.enum(["unread", "read", "replied", "archived"]),
});

export const createContactSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(100),
  email: z.string().email("Format email tidak valid"),
  subject: z.string().max(200).optional().nullable(),
  message: z.string().min(5, "Pesan minimal 5 karakter").max(10000),
  status: z.enum(["unread", "read", "replied", "archived"]).default("unread"),
});

export const updateContactSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(100).optional(),
  email: z.string().email("Format email tidak valid").optional(),
  subject: z.string().max(200).optional().nullable(),
  message: z.string().min(5, "Pesan minimal 5 karakter").max(10000).optional(),
  status: z.enum(["unread", "read", "replied", "archived"]).optional(),
});

