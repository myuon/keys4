import {
  BranchCommitsDocument,
  BranchCommitsQuery,
  BranchCommitsQueryVariables,
} from "./src/generated/client";
import { graphql } from "./src/graphql";
import * as sqlite3 from "sqlite3";
import dayjs from "dayjs";
sqlite3.verbose();

const db = new sqlite3.Database("./db.sqlite3");

async function main() {
  try {
    // create a table if not exists
    db.run(`
      CREATE TABLE IF NOT EXISTS deployments
      (
        hash VARCHAR(50) PRIMARY KEY,
        url TEXT,
        created_at BIGINT,
        repository_name VARCHAR(100)
      );
    `);

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
            .filter(
              (
                node
              ): node is {
                hash: string;
                url: string;
                createdAt: number;
                repositoryName: string;
              } => Boolean(node)
            );
        } else {
          return undefined;
        }
      })
      .filter(
        (
          nodes
        ): nodes is {
          hash: string;
          url: string;
          createdAt: number;
          repositoryName: string;
        }[] => Boolean(nodes)
      )
      .flat();

    commits?.forEach((commit) => {
      db.run(
        "REPLACE INTO deployments (hash, url, created_at, repository_name) VALUES (?, ?, ?, ?)",
        [commit.hash, commit.url, commit.createdAt, commit.repositoryName]
      );
    });
  } catch (err) {
    console.error(err);
  }
}

main();
