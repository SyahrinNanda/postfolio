import { relations } from "drizzle-orm";
import {
  user,
  session,
  account,
  profiles,
  projects,
  projectImages,
  projectFeatures,
  projectTechnologies,
  technologies,
  experiences,
  experienceTechnologies,
  articles,
} from "./schema";

// ============================================================================
// Better Auth Relations
// ============================================================================

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  profile: one(profiles, {
    fields: [user.id],
    references: [profiles.userId],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

// ============================================================================
// Portfolio Relations
// ============================================================================

export const profileRelations = relations(profiles, ({ one }) => ({
  user: one(user, {
    fields: [profiles.userId],
    references: [user.id],
  }),
}));

export const projectRelations = relations(projects, ({ many }) => ({
  images: many(projectImages),
  features: many(projectFeatures),
  projectTechnologies: many(projectTechnologies),
}));

export const projectImageRelations = relations(projectImages, ({ one }) => ({
  project: one(projects, {
    fields: [projectImages.projectId],
    references: [projects.id],
  }),
}));

export const projectFeatureRelations = relations(
  projectFeatures,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectFeatures.projectId],
      references: [projects.id],
    }),
  })
);

export const projectTechnologyRelations = relations(
  projectTechnologies,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectTechnologies.projectId],
      references: [projects.id],
    }),
    technology: one(technologies, {
      fields: [projectTechnologies.technologyId],
      references: [technologies.id],
    }),
  })
);

export const technologyRelations = relations(technologies, ({ many }) => ({
  projectTechnologies: many(projectTechnologies),
  experienceTechnologies: many(experienceTechnologies),
}));

export const experienceRelations = relations(experiences, ({ many }) => ({
  experienceTechnologies: many(experienceTechnologies),
}));

export const experienceTechnologyRelations = relations(
  experienceTechnologies,
  ({ one }) => ({
    experience: one(experiences, {
      fields: [experienceTechnologies.experienceId],
      references: [experiences.id],
    }),
    technology: one(technologies, {
      fields: [experienceTechnologies.technologyId],
      references: [technologies.id],
    }),
  })
);

