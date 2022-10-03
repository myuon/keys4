import * as sqlite3 from "sqlite3";
import { newCommitRepostiroy } from "./src/infra/commit/commit";
import { newPrRepository } from "./src/infra/pr/pr";
import { newPrCommitRelationRepository } from "./src/infra/prCommitRelation/prCommitRelation";
import { newRepositoryRepository } from "./src/infra/repository/repository";
sqlite3.verbose();

const db = new sqlite3.Database("./db.sqlite3");
const commitRepository = newCommitRepostiroy(db);
const prRepository = newPrRepository(db);
const prCommitRelationRepository = newPrCommitRelationRepository(db);
const repositoryRepository = newRepositoryRepository(db);

repositoryRepository.createTableIfNotExists();
prRepository.createTableIfNotExists();
prCommitRelationRepository.createTableIfNotExists();
commitRepository.createTableIfNotExists();

db.close();
