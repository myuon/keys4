import { Commit } from "../models/commit";

const serialize = (commit: Commit) => {
  return [
    commit.hash,
    commit.author,
    commit.url,
    commit.createdAt,
    commit.summary,
    commit.repositoryName,
  ];
};

const deserialize = (object: Record<string, any>): Commit => {
  return {
    hash: object["hash"] as string,
    author: object["author"] as string,
    url: object["url"] as string,
    createdAt: object["created_at"] as number,
    summary: object["summary"] as string,
    repositoryName: object["repository_name"] as string,
  };
};

export const db_commit = {
  serialize,
  deserialize,
};
