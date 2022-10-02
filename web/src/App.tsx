import "./App.css";
import dayjs from "dayjs";
import { css } from "@emotion/react";
import { useRepository } from "./api/repository";
import { Calendar, useLast7Days } from "./components/Calendar";
import { useMemo } from "react";
import { usePr } from "./api/pr";
import { Pr } from "../../models/pr";

function App() {
  const { data: repositories } = useRepository();
  const thisWeek = useLast7Days(dayjs());

  const span = {
    start: thisWeek[0].unix(),
    end: thisWeek[thisWeek.length - 1].add(1, "day").unix(),
  };
  const { data: pr } = usePr(span);

  const prByAuthor = useMemo(
    () =>
      pr?.reduce((acc, pr) => {
        if (pr.author) {
          if (!acc[pr.author]) {
            acc[pr.author] = [];
          }

          acc[pr.author].push(pr);
        }
        return acc;
      }, {} as Record<string, Pr[]>),
    [pr]
  );
  const prByDate = useMemo(
    () =>
      pr?.reduce((acc, pr) => {
        if (!pr.mergedAt) {
          return acc;
        }

        const date = dayjs.unix(pr.mergedAt).format("YYYY-MM-DD");
        if (!acc[date]) {
          acc[date] = [];
        }

        acc[date].push(pr);
        return acc;
      }, {} as Record<string, Pr[]>),
    [pr]
  );

  const deploysThisWeek = useMemo(
    () =>
      thisWeek
        .map((day) => {
          const date = day.format("YYYY-MM-DD");
          return prByDate?.[date]?.length ?? 0;
        })
        .reduce((acc, cur) => acc + cur, 0),
    [thisWeek, prByDate]
  );

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
      <section
        css={css`
          display: grid;
          gap: 16px;
        `}
      >
        <h2>Deployments</h2>

        <div
          css={css`
            display: grid;
            justify-content: center;
          `}
        >
          {deploysThisWeek / 7 > 2.0 && (
            <div
              css={css`
                width: 100px;
                height: 100px;
                // background-color: #22c55e;
                background-color: #6366f1;
                border-radius: 50%;
                color: white;
                display: grid;
                place-items: center;
              `}
            >
              <div
                css={css`
                  display: grid;
                  gap: 8px;
                `}
              >
                <span>
                  <span
                    css={css`
                      font-size: 24px;
                      font-weight: 500;
                    `}
                  >
                    {(deploysThisWeek / 7).toFixed(1)}
                  </span>
                </span>
                <span>Elite</span>
              </div>
            </div>
          )}
        </div>

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
              {prByDate?.[day.format("YYYY-MM-DD")] && (
                <p
                  css={css`
                    font-weight: bold;
                  `}
                >
                  🚀 {prByDate?.[day.format("YYYY-MM-DD")].length}
                </p>
              )}
            </div>
          ))}
        </div>

        <div>
          <h3>PR This Week</h3>

          <div
            css={css`
              display: grid;
              gap: 16px;
            `}
          >
            {prByAuthor &&
              Object.entries(prByAuthor).map(
                ([author, prs]) =>
                  prs.length > 0 && (
                    <div
                      key={author}
                      css={css`
                        display: grid;
                        gap: 8px;
                        text-align: left;
                      `}
                    >
                      <span
                        css={css`
                          font-weight: bold;
                        `}
                      >
                        {author} ({prs.length})
                      </span>
                      <div
                        css={css`
                          display: grid;
                          gap: 2px;
                        `}
                      >
                        {prs.map((pr) => (
                          <div
                            key={pr.id}
                            css={css`
                              display: grid;
                              grid-template-columns: 1fr auto;
                              gap: 16px;
                            `}
                          >
                            <div
                              css={css`
                                display: flex;
                                gap: 16px;
                                text-align: left;
                              `}
                            >
                              <span
                                css={css`
                                  font-weight: bold;
                                `}
                              >
                                {dayjs.unix(pr.createdAt).format("YYYY-MM-DD")}
                              </span>
                              <a href={pr.url}>{pr.title}</a>
                            </div>
                            <div>
                              {pr.mergedAt ? (
                                <span>
                                  ✅{" "}
                                  {dayjs
                                    .unix(pr.mergedAt)
                                    .diff(
                                      dayjs.unix(pr.createdAt),
                                      "hour"
                                    )}{" "}
                                  hrs
                                </span>
                              ) : (
                                <span>
                                  ⏳{" "}
                                  {dayjs().diff(
                                    dayjs.unix(pr.createdAt),
                                    "hour"
                                  )}{" "}
                                  hrs
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
              )}
          </div>
        </div>
      </section>
      <div>
        <Calendar />
      </div>
    </div>
  );
}

export default App;
