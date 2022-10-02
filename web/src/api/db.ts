import initSqlJs from "sql.js";
import useSWR from "swr";

const SQL = await initSqlJs({
  locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
});

export const useDb = () => {
  const { data, error } = useSWR("/db.sqlite3", async (url) => {
    console.log("fetching db");

    const resp = await fetch("/db.sqlite3");

    console.log("fetched db");

    if (!resp.ok) {
      console.error("failed to fetch db, ", await resp.text());
      return;
    }

    const sql = new SQL.Database(new Uint8Array(await resp.arrayBuffer()));

    console.log("db loaded");

    return sql;
  });
  if (error) {
    console.error("failed to fetch db, ", error);
  }

  return { db: data };
};
