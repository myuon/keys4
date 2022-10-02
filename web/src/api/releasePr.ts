import useSWR from "swr";
import { useDb } from "./db";
import { db_release_pr } from "../../../db/releasePr";
import { Pr } from "../../../models/pr";
import { Deployment } from "../../../models/deployment";

export const useReleasePr = (createdAtSpan: { start: number; end: number }) => {
  const { db } = useDb();

  return useSWR("/api/release_pr", async (url) => {
    const stmt = db?.prepare(db_release_pr.query.findReleasePrByCreatedAtSpan, [
      createdAtSpan.start,
      createdAtSpan.end,
    ]);
    const result: [Pr, Deployment][] = [];
    while (stmt?.step()) {
      result.push(db_release_pr.deserialize(stmt.getAsObject()));
    }

    return result;
  });
};
