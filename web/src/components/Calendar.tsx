import { css } from "@emotion/react";
import dayjs from "dayjs";
import { useMemo } from "react";

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => start + i);
};

const useCalendarWeeks = (today: dayjs.Dayjs) => {
  const weeks = useMemo(() => {
    const startOfMonth = today.startOf("month");
    const endOfMonth = today.endOf("month");
    const dayStartOfMonth = startOfMonth.day();

    const firstWeek = [
      ...range(0, dayStartOfMonth - 1).map(() => undefined),
      ...range(1, 7 - dayStartOfMonth),
    ];
    const weeks = [firstWeek];

    let date = 7 - dayStartOfMonth + 1;
    while (date <= endOfMonth.date()) {
      if (date + 6 > endOfMonth.date()) {
        weeks.push([
          ...range(date, endOfMonth.date()),
          ...range(0, 5 - (endOfMonth.date() - date)).map(() => undefined),
        ]);
      } else {
        weeks.push(range(date, date + 6));
      }
      date += 7;
    }

    return weeks;
  }, [today]);

  return weeks;
};

export const useLast7Days = (today: dayjs.Dayjs) => {
  return useMemo(() => {
    return range(1, 7)
      .reverse()
      .map((i) => today.subtract(i, "day"));
  }, [today]);
};

export const Calendar = ({
  events,
}: {
  events?: Record<string, JSX.Element>;
}) => {
  const today = dayjs().add(-1, "month");
  const weeks = useCalendarWeeks(today);

  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        border-right: 1px solid #e2e8f0;
        border-bottom: 1px solid #e2e8f0;

        & > div {
          border-top: 1px solid #e2e8f0;
          border-left: 1px solid #e2e8f0;
        }
      `}
    >
      {[
        <span
          key="sun"
          css={css`
            color: #dc2626;
          `}
        >
          Sun
        </span>,
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        <span
          key="sat"
          css={css`
            color: #2563eb;
          `}
        >
          Sat
        </span>,
      ].map((d, i) => (
        <div key={i}>{d}</div>
      ))}
      {weeks.flat().map((day, i) => (
        <div key={i}>
          {day}
          {day && events?.[today.set("date", day).format("YYYY-MM-DD")]}
        </div>
      ))}
    </div>
  );
};
