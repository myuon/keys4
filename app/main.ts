import * as sqlite3 from "sqlite3";
import { newDeploymentRepository } from "./src/infra/deployment/deployment";
import { requestCommitsOnBranch } from "./src/api/branchCommit";
sqlite3.verbose();

const db = new sqlite3.Database("./db.sqlite3");
const deploymentRepository = newDeploymentRepository(db);

async function main() {
  try {
    deploymentRepository.createTableIfNotExists();

    const commits = await requestCommitsOnBranch(
      process.env.OWNER!,
      process.env.REPOSITORY!,
      process.env.BRANCH!
    );

    commits?.forEach((commit) => {
      deploymentRepository.save(commit);
    });
  } catch (err) {
    console.error(err);
  }
}

main();
