import { Deployment } from "../models/deployment";
import { Pr } from "../models/pr";
import { db_deployment } from "./deployment";
import { db_pr } from "./pr";

const deserialize = (object: Record<string, any>): [Pr, Deployment] => {
  return [db_pr.deserialize(object), db_deployment.deserialize(object)];
};

export const db_release_pr = {
  deserialize,
  query: {
    findReleasePrByCreatedAtSpan: `SELECT * FROM prs
INNER JOIN deployments ON prs.merge_commit_hash = deployments.hash
WHERE prs.created_at >= ? AND prs.created_at < ?
ORDER BY prs.created_at;`,
  },
};
