import { Deployment } from "../../../models/deployment";
import {
  FetchReleasePrDocument,
  FetchReleasePrQuery,
  FetchReleasePrQueryVariables,
} from "../generated/client";
import { graphql } from "./graphql";
import dayjs from "dayjs";

export const requestReleasePr = async (
  owner: string,
  name: string,
  targetBranchName: string
) => {
  const { repository } = await graphql<FetchReleasePrQuery>(
    FetchReleasePrDocument.loc?.source.body!,
    {
      owner,
      name,
      targetBranchName,
    } as FetchReleasePrQueryVariables
  );

  const deploys: Deployment[] = [];
  repository?.pullRequests.nodes?.forEach((node) => {
    if (node) {
      const pr = node;

      if (pr.mergeCommit) {
        deploys.push({
          hash: pr.mergeCommit?.oid,
          url: pr.url,
          createdAt: dayjs(pr.mergeCommit.committedDate).unix(),
          repositoryName: `${owner}/${name}`,
        });
      } else {
        console.error(
          `pr.mergeCommit is null. pr: ${JSON.stringify(pr, null, 2)}`
        );
      }
    }
  });

  return { deploys };
};
