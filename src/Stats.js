import React from "react";
import "./Stats.css";
import { Card, CardContent, Typography } from "@material-ui/core";

function Stats({ active, casesType, title, today, total, ...props }) {
  let isRed,
    isBlue,
    isGreen = false;
  if (casesType === "cases") {
    isBlue = true;
  } else if (casesType === "recovered") {
    isGreen = true;
  } else {
    isRed = true;
  }

  return (
    <Card
      onClick={props.onClick}
      className={`stats ${active && "stats--selected"} ${
        isRed && "stats--red"
      } ${isBlue && "stats--blue"} ${isGreen && "stats--green"}`}
    >
      <CardContent>
        <Typography className="state__title" color="textSecondary">
          {title}
        </Typography>

        <h2 className="state__cases">+{today}</h2>
        <Typography className="stats__total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Stats;
