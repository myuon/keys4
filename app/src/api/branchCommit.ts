import {
  BranchCommitsDocument,
  BranchCommitsQuery,
  BranchCommitsQueryVariables,
} from "../generated/client";
import { graphql } from "./graphql";
import dayjs from "dayjs";
import { Deployment } from "../../../models/deployment";

export const requestCommitsOnBranch = async (
  owner: string,
  name: string,
  branch: string
) => {
  const { repository } = await graphql<BranchCommitsQuery>(
    BranchCommitsDocument.loc?.source.body!,
    {
      owner,
      name,
      branch,
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

  return commits;
};
