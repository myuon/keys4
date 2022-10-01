import * as sqlite3 from "sqlite3";
import { Pr } from "../../models/pr";

const query = {
  createTable: `
CREATE TABLE IF NOT EXISTS prs
(
  id VARCHAR(50) PRIMARY KEY,
  url TEXT,
  title TEXT,
  merged_at BIGINT,
  merge_commit_hash VARCHAR(50),
  author VARCHAR(50)
);
`,
  replace: `
REPLACE INTO prs (id, url, title, merged_at, merge_commit_hash, author) VALUES (?, ?, ?, ?, ?, ?)
`,
};

const createTableIfNotExists = (db: sqlite3.Database) => {
  db.run(query.createTable);
};
const save = (db: sqlite3.Database, pr: Pr) => {
  db.run(query.replace, [
    pr.id,
    pr.url,
    pr.title,
    pr.mergedAt,
    pr.mergeCommitHash,
    pr.author,
  ]);
};

export const newPrRepository = (db: sqlite3.Database) => {
  return {
    createTableIfNotExists: () => createTableIfNotExists(db),
    save: (pr: Pr) => save(db, pr),
  };
};
