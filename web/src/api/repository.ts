import useSWR from "swr";
import { Repository } from "../../../models/repository";
import { useDb } from "./db";
import { db_repository } from "../../../db/repository";

export const useRepository = () => {
  const { db } = useDb();

  return useSWR(db ? "/api/repository" : null, async (url) => {
    const stmt = db?.prepare("select * from repositories;");
    const result: Repository[] = [];
    while (stmt?.step()) {
      result.push(db_repository.deserialize(stmt.getAsObject()));
    }

    return result;
  });
};
