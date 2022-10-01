import * as sqlite3 from "sqlite3";
import { Deployment } from "../../models/deployment";

const query = {
  createTable: `
CREATE TABLE IF NOT EXISTS deployments
(
  hash VARCHAR(50) PRIMARY KEY,
  url TEXT,
  created_at BIGINT,
  repository_name VARCHAR(100)
);
`,
  replace: `
REPLACE INTO deployments (hash, url, created_at, repository_name) VALUES (?, ?, ?, ?)
`,
};

const createTableIfNotExists = (db: sqlite3.Database) => {
  db.run(query.createTable);
};
const save = (db: sqlite3.Database, deployment: Deployment) => {
  db.run(query.replace, [
    deployment.hash,
    deployment.url,
    deployment.createdAt,
    deployment.repositoryName,
  ]);
};

export const newDeploymentRepository = (db: sqlite3.Database) => {
  return {
    createTableIfNotExists: () => createTableIfNotExists(db),
    save: (deployment: Deployment) => save(db, deployment),
  };
};
