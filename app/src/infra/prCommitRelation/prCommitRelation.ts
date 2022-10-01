import * as sqlite3 from "sqlite3";
import { PrCommitRelation } from "../../models/prCommitRelation";

const query = {
  createTable: `
CREATE TABLE IF NOT EXISTS pr_commit_relations
(
  pr_id VARCHAR(50),
  commit_hash VARCHAR(50),
  PRIMARY KEY (pr_id, commit_hash)
);
`,
  replace: `
REPLACE INTO pr_commit_relations (pr_id, commit_hash) VALUES (?, ?)
`,
};

const createTableIfNotExists = (db: sqlite3.Database) => {
  db.run(query.createTable);
};
const save = (db: sqlite3.Database, relation: PrCommitRelation) => {
  db.run(query.replace, [relation.prId, relation.commitHash]);
};

export const newPrCommitRelationRepository = (db: sqlite3.Database) => {
  return {
    createTableIfNotExists: () => createTableIfNotExists(db),
    save: (relation: PrCommitRelation) => save(db, relation),
  };
};
