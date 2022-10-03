import * as sqlite3 from "sqlite3";
import { newCommitRepostiroy } from "./src/infra/commit/commit";
import { newPrRepository } from "./src/infra/pr/pr";
import { newPrCommitRelationRepository } from "./src/infra/prCommitRelation/prCommitRelation";
import { requestPr } from "./src/api/pr";
import { newRepositoryRepository } from "./src/infra/repository/repository";
sqlite3.verbose();

const db = new sqlite3.Database("./db.sqlite3");
const commitRepository = newCommitRepostiroy(db);
const prRepository = newPrRepository(db);
const prCommitRelationRepository = newPrCommitRelationRepository(db);
const repositoryRepository = newRepositoryRepository(db);

const syncRepository = async () => {
  const { config } = await import("./keys4.config");

  config.projects.forEach((project) => {
    repositoryRepository.save({
      owner: project.owner,
      name: project.name,
      url: `https://github.com/${project.owner}/${project.name}`,
    });
  });

  return config;
};

const syncPr = async (config: {
  projects: { owner: string; name: string }[];
}) => {
  config.projects.forEach(async (project) => {
    const { prs, commits, relations } = await requestPr(
      project.owner,
      project.name
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
  });
};

const main = async () => {
  const config = await syncRepository();
  await syncPr(config);
};

main();
