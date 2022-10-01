import "./App.css";
import { useDb } from "./db";
import { Repository } from "../../models/repository";
import { Deployment } from "../../models/deployment";
import { db_deployment } from "../../db/deployment";
import dayjs from "dayjs";
import { css } from "@emotion/react";

const useRepository = () => {
  const { db } = useDb();

  const stmt = db?.prepare("select * from repositories;");
  const result: Repository[] = [];
  while (stmt?.step()) {
    result.push(stmt.getAsObject() as unknown as Repository);
  }

  return result;
};

const useDeployment = () => {
  const { db } = useDb();

  const stmt = db?.prepare("select * from deployments;");
  const result: Deployment[] = [];
  while (stmt?.step()) {
    result.push(db_deployment.deserialize(stmt.getAsObject()));
  }

  return result;
};

function App() {
  const repositories = useRepository();
  const deployments = useDeployment();

  return (
    <div
      className="App"
      css={css`
        display: grid;
        gap: 16px;
      `}
    >
      <h1>Four Keys</h1>
      <div>
        {repositories?.map((r, i) => (
          <h2 key={i}>
            {r.owner}/{r.name}
          </h2>
        ))}
      </div>
      <div>
        {deployments?.map((d, i) => (
          <div key={i}>
            <a href={d.url}>{d.hash}</a>
            <div>{dayjs.unix(d.createdAt).format("YYYY-MM-DD HH:mm:ss")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
