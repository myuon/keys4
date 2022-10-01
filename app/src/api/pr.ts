import {
  FetchPrDocument,
  FetchPrQuery,
  FetchPrQueryVariables,
} from "../generated/client";
import { Commit } from "../../../models/commit";
import { Pr } from "../../../models/pr";
import { PrCommitRelation } from "../../../models/prCommitRelation";
import { graphql } from "./graphql";
import dayjs from "dayjs";

export const requestPr = async (owner: string, name: string) => {
  const { repository } = await graphql<FetchPrQuery>(
    FetchPrDocument.loc?.source.body!,
    {
      owner,
      name,
    } as FetchPrQueryVariables
  );

  const prs: Pr[] = [];
  const commits: Commit[] = [];
  const relations: PrCommitRelation[] = [];

  repository?.pullRequests.nodes?.forEach((node) => {
    if (node) {
      const pr = node;

      prs.push({
        id: node.id,
        title: node.title,
        url: node.url,
        createdAt: dayjs(node.createdAt).unix(),
        mergedAt: node.mergedAt ? dayjs(node.mergedAt).unix() : undefined,
        mergeCommitHash: node.mergeCommit?.oid,
        author:
          node.author?.__typename === "User" ? node.author.login : undefined,
      });

      node.commits.nodes?.forEach((node) => {
        if (node) {
          const commit = node.commit;

          if (!commit.author?.user?.login) {
            console.error("author is not found, ", commit);
            return;
          }

          commits.push({
            hash: commit.oid,
            url: commit.commitUrl,
            createdAt: dayjs(commit.committedDate).unix(),
            author: commit.author?.user?.login,
            summary: commit.messageHeadline,
            repositoryName: `${process.env.OWNER}/${process.env.REPOSITORY}`,
          });

          relations.push({
            prId: pr.id,
            commitHash: commit.oid,
          });
        }
      });
    }
  });

  return {
    prs,
    commits,
    relations,
  };
};
