import "./App.css";
import dayjs from "dayjs";
import { css } from "@emotion/react";
import { useRepository } from "./api/repository";
import { useDeployment } from "./api/deployment";
import { Calendar, useLast7Days } from "./components/Calendar";
import { useMemo } from "react";
import { Deployment } from "../../models/deployment";

function App() {
  const { data: repositories } = useRepository();
  const { data: deployments } = useDeployment();
  const deploysByDate = useMemo(
    () =>
      deployments?.reduce((acc, deployment) => {
        const date = dayjs.unix(deployment.createdAt).format("YYYY-MM-DD");
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(deployment);
        return acc;
      }, {} as Record<string, Deployment[]>),
    [deployments]
  );
  const deployEvents = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(deploysByDate ?? {}).map(([date, deploys]) => [
          date,
          <div
            css={css`
              font-weight: bold;
            `}
          >
            🚀 {deploys.length}
          </div>,
        ])
      ),
    [deploysByDate]
  );

  const thisWeek = useLast7Days(dayjs());

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
      <section>
        <h2>Deployments</h2>

        <div
          css={css`
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 8px;
          `}
        >
          {thisWeek.map((day, i) => (
            <div key={i}>
              <h3>{day.format("ddd")}</h3>
              <p>{day.format("M/D")}</p>
              {deploysByDate?.[day.format("YYYY-MM-DD")] && (
                <p
                  css={css`
                    font-weight: bold;
                  `}
                >
                  🚀 {deploysByDate?.[day.format("YYYY-MM-DD")].length}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
      <Calendar events={deployEvents} />
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
