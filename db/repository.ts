import { Repository } from "../models/repository";

const serialize = (repo: Repository) => {
  return [repo.owner, repo.name, repo.url];
};

const deserialize = (object: Record<string, any>): Repository => {
  return {
    owner: object["owner"] as string,
    name: object["name"] as string,
    url: object["url"] as string,
  };
};

export const db_repository = {
  serialize,
  deserialize,
};
