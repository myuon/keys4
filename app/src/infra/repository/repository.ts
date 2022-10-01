import * as sqlite3 from "sqlite3";
import { Repository } from "../../models/repository";

const query = {
  createTable: `
CREATE TABLE IF NOT EXISTS repositories
(
  owner VARCHAR(50),
  name VARCHAR(50),
  url TEXT,
  PRIMARY KEY (owner, name)
);
`,
  replace: `
REPLACE INTO repositories (owner, name, url) VALUES (?, ?, ?)
`,
};

const createTableIfNotExists = (db: sqlite3.Database) => {
  db.run(query.createTable);
};
const save = (db: sqlite3.Database, repo: Repository) => {
  db.run(query.replace, [repo.owner, repo.name, repo.url]);
};

export const newRepositoryRepository = (db: sqlite3.Database) => {
  return {
    createTableIfNotExists: () => createTableIfNotExists(db),
    save: (repo: Repository) => save(db, repo),
  };
};
