import useSWR from "swr";
import { useDb } from "./db";
import { Pr } from "../../../models/pr";
import { db_pr } from "../../../db/pr";

export const usePr = (createdAtSpan: { start: number; end: number }) => {
  const { db } = useDb();

  return useSWR(db ? "/api/pr" : null, async (url) => {
    const stmt = db?.prepare(db_pr.query.selectByCreatedAtSpan, [
      createdAtSpan.start,
      createdAtSpan.end,
    ]);
    const result: Pr[] = [];
    while (stmt?.step()) {
      result.push(db_pr.deserialize(stmt.getAsObject()));
    }

    return result;
  });
};
