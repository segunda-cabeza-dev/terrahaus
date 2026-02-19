-- Prisma baseline migration (idempotent for existing DBs)

CREATE TABLE IF NOT EXISTS "contacts" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "phone" VARCHAR(50),
  "reform_type" VARCHAR(100),
  "message" TEXT,
  "source" VARCHAR(100),
  "processed" BOOLEAN NOT NULL DEFAULT FALSE,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_contacts_email" ON "contacts"("email");
CREATE INDEX IF NOT EXISTS "idx_contacts_created_at" ON "contacts"("created_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_contacts_processed" ON "contacts"("processed");

CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

