import { css } from "@emotion/react";
import dayjs from "dayjs";
import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { Pr } from "../../../models/pr";
import { usePr } from "../api/pr";
import { useRepository } from "../api/repository";
import { useLast7Days } from "../components/Calendar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { CircleDisplay } from "../components/CircleDisplay";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const median = (arr: number[]) => {
  return arr.sort((a, b) => a - b)[Math.floor(arr.length / 2)];
};

export const IndexPage = () => {
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
        .reduce((acc, cur) => acc + cur, 0) / (repositories?.length ?? 1),
    [thisWeek, repositories?.length, prByDate]
  );
  const leadTimeForChanges = useMemo(() => {
    const leadTimes = pr
      ?.filter((pr): pr is Pr & { mergedAt: number } => Boolean(pr.mergedAt))
      .map((pr) => pr.mergedAt - pr.createdAt);

    if (!leadTimes) {
      return undefined;
    }

    return median(leadTimes);
  }, [pr]);

  return (
    <div
      className="App"
      css={css`
        display: grid;
        gap: 48px;

        section {
          display: grid;
          gap: 32px;
        }
      `}
    >
      <h1
        css={css`
          text-align: center;
        `}
      >
        Four Keys
      </h1>

      <section>
        <h2>Summary</h2>

        <div
          css={css`
            display: flex;
            gap: 32px;
            justify-content: center;
          `}
        >
          {deploysThisWeek && (
            <div
              css={css`
                display: grid;
                justify-content: center;
              `}
            >
              <p>Deployment Frequency</p>
              <small
                css={css`
                  margin-bottom: 8px;
                `}
              >
                times/day, avg
              </small>
              <div
                css={css`
                  margin: 0 auto;
                `}
              >
                <CircleDisplay
                  backgroundColor={
                    deploysThisWeek / 5 > 1.0 ? "#6366f1" : "#22c55e"
                  }
                  value={(deploysThisWeek / 5).toFixed(1)}
                  label={deploysThisWeek / 5 > 1.0 ? "Elite" : "Good"}
                />
              </div>
            </div>
          )}
          {leadTimeForChanges && (
            <div
              css={css`
                display: grid;
                justify-content: center;
              `}
            >
              <p>Lead Time for Changes</p>
              <small
                css={css`
                  margin-bottom: 8px;
                `}
              >
                hours/pr, median
              </small>
              <div
                css={css`
                  margin: 0 auto;
                `}
              >
                <CircleDisplay
                  backgroundColor={
                    leadTimeForChanges < 1.0 ? "#6366f1" : "#22c55e"
                  }
                  value={(leadTimeForChanges / 60 / 60).toFixed(1)}
                  label={leadTimeForChanges < 1.0 ? "Elite" : "Good"}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      <section>
        <h2>Weekly Calendar</h2>

        <div
          css={css`
            display: grid;
            grid-template-columns: repeat(7, 50px);
            gap: 24px;
            justify-content: center;
          `}
        >
          {thisWeek.map((day, i) => (
            <div
              key={i}
              css={css`
                text-align: center;
              `}
            >
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
      </section>

      <section>
        <h2>PR This Week</h2>

        <div
          css={css`
            display: grid;
            place-items: center;
            width: 650px;
          `}
        >
          {prByAuthor && (
            <Bar
              options={{
                indexAxis: "y" as const,
                elements: {
                  bar: {
                    borderWidth: 2,
                    borderRadius: 3,
                  },
                },
                responsive: true,
              }}
              data={{
                labels: Object.keys(prByAuthor),
                datasets: [
                  {
                    label: "# PR",
                    data: Object.keys(prByAuthor).map(
                      (author) => prByAuthor[author].length
                    ),
                    borderColor: "#1d4ed8",
                    backgroundColor: "#60a5fa",
                  },
                ],
              }}
            />
          )}
        </div>

        <div
          css={css`
            display: grid;
            gap: 4px;
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
                    <Link
                      to={`/users/${author}`}
                      css={css`
                        font-weight: bold;
                      `}
                    >
                      {author} ({prs.length})
                    </Link>
                  </div>
                )
            )}
        </div>
      </section>
    </div>
  );
};
