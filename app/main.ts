import * as sqlite3 from "sqlite3";
import { newDeploymentRepository } from "./src/infra/deployment/deployment";
import { newCommitRepostiroy } from "./src/infra/commit/commit";
import { newPrRepository } from "./src/infra/pr/pr";
import { newPrCommitRelationRepository } from "./src/infra/prCommitRelation/prCommitRelation";
import { requestPr } from "./src/api/pr";
import { newRepositoryRepository } from "./src/infra/repository/repository";
import { requestReleasePr } from "./src/api/releasePr";
sqlite3.verbose();

const db = new sqlite3.Database("./db.sqlite3");
const deploymentRepository = newDeploymentRepository(db);
const commitRepository = newCommitRepostiroy(db);
const prRepository = newPrRepository(db);
const prCommitRelationRepository = newPrCommitRelationRepository(db);
const repositoryRepository = newRepositoryRepository(db);

const syncRepository = async () => {
  repositoryRepository.createTableIfNotExists();

  repositoryRepository.save({
    owner: process.env.OWNER!,
    name: process.env.REPOSITORY!,
    url: `https://github.com/${process.env.OWNER!}/${process.env.REPOSITORY!}`,
  });
};

const syncDeploy = async () => {
  deploymentRepository.createTableIfNotExists();

  const { deploys } = await requestReleasePr(
    process.env.OWNER!,
    process.env.REPOSITORY!,
    process.env.BRANCH!
  );

  deploys?.forEach((deploy) => {
    deploymentRepository.save(deploy);
  });
};

const syncPr = async () => {
  prRepository.createTableIfNotExists();
  prCommitRelationRepository.createTableIfNotExists();
  commitRepository.createTableIfNotExists();

  const { prs, commits, relations } = await requestPr(
    process.env.OWNER!,
    process.env.REPOSITORY!
  );

  prs.forEach((pr) => {
    prRepository.save(pr);
  });
  commits.forEach((commit) => {
    commitRepository.save(commit);
  });
  relations.forEach((relation) => {
    prCommitRelationRepository.save(relation);
  });
};

const main = async () => {
  await syncRepository();
  await syncDeploy();
  await syncPr();
};

main();
