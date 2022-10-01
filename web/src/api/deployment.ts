import useSWR from "swr";
import { db_deployment } from "../../../db/deployment";
import { Deployment } from "../../../models/deployment";
import { useDb } from "./db";

export const useDeployment = () => {
  const { db } = useDb();

  return useSWR("/api/deployment", async (url) => {
    const stmt = db?.prepare("select * from deployments;");
    const result: Deployment[] = [];
    while (stmt?.step()) {
      result.push(db_deployment.deserialize(stmt.getAsObject()));
    }

    return result;
  });
};
