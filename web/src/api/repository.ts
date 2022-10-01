import useSWR from "swr";
import { Repository } from "../../../models/repository";
import { useDb } from "./db";

export const useRepository = () => {
  const { db } = useDb();

  return useSWR("/api/repository", async (url) => {
    const stmt = db?.prepare("select * from repositories;");
    const result: Repository[] = [];
    while (stmt?.step()) {
      result.push(stmt.getAsObject() as unknown as Repository);
    }

    return result;
  });
};
