import * as sqlite3 from "sqlite3";
import { Commit } from "../../models/commit";

const query = {
  createTable: `
CREATE TABLE IF NOT EXISTS commits
(
  hash VARCHAR(50) PRIMARY KEY,
  author VARCHAR(50),
  url TEXT,
  created_at BIGINT,
  summary TEXT,
  repository_name VARCHAR(100)
);
`,
  replace: `
REPLACE INTO commits (hash, author, url, created_at, summary, repository_name) VALUES (?, ?, ?, ?, ?, ?)
`,
};

const createTableIfNotExists = (db: sqlite3.Database) => {
  db.run(query.createTable);
};
const save = (db: sqlite3.Database, commmit: Commit) => {
  db.run(query.replace, [
    commmit.hash,
    commmit.author,
    commmit.url,
    commmit.createdAt,
    commmit.summary,
    commmit.repositoryName,
  ]);
};

export const newCommitRepostiroy = (db: sqlite3.Database) => {
  return {
    createTableIfNotExists: () => createTableIfNotExists(db),
    save: (commmit: Commit) => save(db, commmit),
  };
};
