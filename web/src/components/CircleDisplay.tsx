import { css } from "@emotion/react";

export const CircleDisplay = ({
  value,
  label,
  backgroundColor,
}: {
  value: string;
  label: string;
  backgroundColor: string;
}) => {
  return (
    <div
      css={[
        css`
          display: grid;
          place-items: center;
          width: 100px;
          height: 100px;
          color: white;
          border-radius: 50%;
        `,
        {
          backgroundColor,
        },
      ]}
    >
      <div
        css={css`
          display: grid;
          gap: 8px;
          text-align: center;
        `}
      >
        <span
          css={css`
            font-size: 24px;
            font-weight: 500;
          `}
        >
          {value}
        </span>
        <span>{label}</span>
      </div>
    </div>
  );
};
