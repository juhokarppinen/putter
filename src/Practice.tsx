import { useEffect } from "react";
import { AppState, Options, Result, SetState } from "./types";
import { range } from "./util";
import "./Practice.css";

interface Props {
  setState: SetState<AppState>;
  setResults: SetState<Result[]>;
  setOptions: SetState<Options>;
  results: Result[];
  options: Options;
}

export default function Practice({
  options,
  results,
  setResults,
  setState,
  setOptions,
}: Props) {
  const index = results.length - 1;
  const currentResult = results[index];
  const currentRound = results.length;
  const currentDistance = currentResult?.distance ?? options.startDistance;

  useEffect(() => {
    if (results.length === 0) {
      setResults([{ round: 1, distance: options.startDistance, score: null }]);
    }
  }, []);

  function addScore(score: number) {
    const updateScore = (result: Result) =>
      result.round === currentRound ? { ...currentResult, score } : result;

    const minimumTarget = Math.ceil(options.throwsPerRound / 2);
    const distance =
      score < minimumTarget
        ? Math.max(currentResult.distance - options.change, 2)
        : score > minimumTarget || options.throwsPerRound === score
        ? currentResult.distance + options.change
        : currentResult.distance;

    if (currentRound >= options.rounds) {
      setResults(results.map(updateScore));
      setState("results");
      return;
    }

    const emptyResult = { round: currentRound + 1, distance, score: null };
    setResults(results.map(updateScore).concat(emptyResult));
  }

  return (
    <section className="PracticeContainer">
      <h2>Practice</h2>
      <h3 style={{ display: "flex", alignItems: "space-between" }}>
        <span style={{ width: "128px" }}>
          {currentRound}/{options.rounds}
        </span>
        <span style={{ width: "128px" }}>{currentDistance} m</span>
      </h3>

      <div
        className="ScoreGrid"
        style={{
          gridTemplateColumns: `repeat(${
            options.throwsPerRound < 4 ? 2 : 3
          }, 5rem)`,
        }}
      >
        {range(0, options.throwsPerRound + 1).map((score) => (
          <button
            key={`score button ${score}`}
            className="ScoreButton"
            onClick={() => addScore(score)}
          >
            {score}
          </button>
        ))}
      </div>

      <button
        onClick={() => {
          setResults(results.slice(0, results.length - 1));
          setOptions((s) => ({ ...s, rounds: results.length - 1 }));
          setState("results");
        }}
      >
        End practice
      </button>
    </section>
  );
}
