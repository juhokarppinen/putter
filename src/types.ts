import React from "react";

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export type AppState = "setup" | "results" | "practice";

export type Result = {
  round: number;
  distance: number;
  score: number | null;
};

export type Options = {
  startDistance: number;
  throwsPerRound: number;
  change: number;
  rounds: number;
};
