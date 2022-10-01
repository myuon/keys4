import { Deployment } from "../models/deployment";

const serialize = (deployment: Deployment) => {
  return [
    deployment.hash,
    deployment.url,
    deployment.createdAt,
    deployment.repositoryName,
  ];
};

const deserialize = (object: Record<string, any>): Deployment => {
  return {
    hash: object["hash"] as string,
    url: object["url"] as string,
    createdAt: object["created_at"] as number,
    repositoryName: object["repository_name"] as string,
  };
};

export const db_deployment = {
  serialize,
  deserialize,
};
