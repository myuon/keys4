import { useEffect, useState } from "react";
import initSqlJs from "sql.js";
import useSWR from "swr";

const SQL = await initSqlJs({
  locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
});

export const useDb = () => {
  const { data, error } = useSWR("/db.sqlite3", async (url) => {
    const resp = await fetch("/db.sqlite3");
    if (!resp.ok) {
      console.error("failed to fetch db, ", await resp.text());
      return;
    }
    return new Uint8Array(await resp.arrayBuffer());
  });
  if (error) {
    console.error("failed to fetch db, ", error);
  }

  return { db: data ? new SQL.Database(data) : undefined };
};
