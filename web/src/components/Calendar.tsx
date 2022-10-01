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
      ...range(0, dayStartOfMonth - 1).map((_) => "-"),
      ...range(1, 7 - dayStartOfMonth),
    ];
    const weeks = [firstWeek];

    let date = 7 - dayStartOfMonth + 1;
    while (date <= endOfMonth.date()) {
      if (date + 6 > endOfMonth.date()) {
        weeks.push([
          ...range(date, endOfMonth.date()),
          ...range(0, 5 - (endOfMonth.date() - date)).map((_) => "-"),
        ]);
      } else {
        weeks.push(range(date, date + 6));
      }
      date += 7;
    }

    return weeks;
  }, []);

  return weeks;
};

export const Calendar = () => {
  const weeks = useCalendarWeeks(dayjs());

  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: repeat(7, 1fr);

        & > div {
          border-left: 1px solid #e2e8f0;
          border-top: 1px solid #e2e8f0;
        }
        border-right: 1px solid #e2e8f0;
        border-bottom: 1px solid #e2e8f0;
      `}
    >
      {[
        <span
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
        <div key={i}>{day}</div>
      ))}
    </div>
  );
};
