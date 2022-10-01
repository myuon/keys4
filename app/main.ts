import {
  BranchCommitsDocument,
  BranchCommitsQuery,
  BranchCommitsQueryVariables,
} from "./src/generated/client";
import { graphql } from "./src/graphql";
import * as sqlite3 from "sqlite3";
import dayjs from "dayjs";
import { Deployment } from "./src/models/deployment";
import { newDeploymentRepository } from "./src/infra/deployment/deployment";
sqlite3.verbose();

const db = new sqlite3.Database("./db.sqlite3");
const deploymentRepository = newDeploymentRepository(db);

async function main() {
  try {
    deploymentRepository.createTableIfNotExists();

    const { repository } = await graphql<BranchCommitsQuery>(
      BranchCommitsDocument.loc?.source.body!,
      {
        owner: process.env.OWNER,
        name: process.env.REPOSITORY,
        branch: process.env.BRANCH,
      } as BranchCommitsQueryVariables
    );

    const commits = repository?.refs?.edges
      ?.map((edge) => {
        const target = edge?.node?.target;
        if (target?.__typename === "Commit") {
          return target.history.nodes
            ?.map((node) => {
              return node
                ? {
                    hash: node.oid,
                    url: node.url,
                    createdAt: dayjs(node.committedDate).unix(),
                    repositoryName: `${process.env.OWNER}/${process.env.REPOSITORY}`,
                  }
                : undefined;
            })
            .filter((node): node is Deployment => Boolean(node));
        } else {
          return undefined;
        }
      })
      .filter((nodes): nodes is Deployment[] => Boolean(nodes))
      .flat();

    commits?.forEach((commit) => {
      deploymentRepository.save(commit);
    });
  } catch (err) {
    console.error(err);
  }
}

main();
