import { useEffect, useState } from "react";
import initSqlJs from "sql.js";

const SQL = await initSqlJs({
  locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
});

export const useDb = () => {
  const [file, setFile] = useState<Uint8Array>();
  useEffect(() => {
    void (async () => {
      if (!file) {
        const resp = await fetch("/db.sqlite3");
        console.log(resp.ok);
        setFile(new Uint8Array(await resp.arrayBuffer()));
      }
    })();
  }, []);

  return { db: file ? new SQL.Database(file) : undefined };
};
