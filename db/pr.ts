import { Pr } from "../models/pr";

const serialize = (pr: Pr) => {
  return [pr.id, pr.url, pr.title, pr.mergedAt, pr.mergeCommitHash, pr.author];
};

const deserialize = (object: Record<string, any>): Pr => {
  return {
    id: object["id"] as string,
    url: object["url"] as string,
    title: object["title"] as string,
    mergedAt: object["merged_at"] as number,
    mergeCommitHash: object["merge_commit_hash"] as string,
    author: object["author"] as string,
  };
};

export const db_pr = {
  serialize,
  deserialize,
};
