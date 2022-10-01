import useSWR from "swr";
import { useDb } from "./db";
import { Pr } from "../../../models/pr";
import { db_pr } from "../../../db/pr";

export const usePr = () => {
  const { db } = useDb();

  return useSWR("/api/pr", async (url) => {
    const stmt = db?.prepare("select * from prs;");
    const result: Pr[] = [];
    while (stmt?.step()) {
      result.push(db_pr.deserialize(stmt.getAsObject()));
    }

    return result;
  });
};
