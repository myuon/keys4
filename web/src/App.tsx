import "./App.css";
import dayjs from "dayjs";
import { css } from "@emotion/react";
import { useRepository } from "./api/repository";
import { useDeployment } from "./api/deployment";

function App() {
  const { data: repositories } = useRepository();
  const { data: deployments } = useDeployment();

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
