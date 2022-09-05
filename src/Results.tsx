import { AppState, Options, Result, SetState } from "./types";

interface Props {
  setState: SetState<AppState>;
  setResults: SetState<Result[]>;
  results: Result[];
  options: Options;
}

interface Aggregate {
  [key: string]: {
    score: number;
    throws: number;
  };
}

const aggregate =
  (throwsPerRound: number) =>
  (a: Aggregate, result: Result): Aggregate => {
    const { distance, score } = result;
    const key = `${distance}`;
    const existing = a[key];
    return existing
      ? {
          ...a,
          [key]: {
            score: existing.score + (score ?? 0),
            throws: existing.throws + throwsPerRound,
          },
        }
      : {
          ...a,
          [key]: {
            score: score ?? 0,
            throws: throwsPerRound,
          },
        };
  };

export default function Results({
  results,
  options,
  setState,
  setResults,
}: Props) {
  const totalScore = results.reduce((a, c) => a + (c.score ?? 0), 0);
  const weightedScore = results.reduce(
    (a, c) => a + (c.score ?? 0) * c.distance,
    0
  );
  const totalThrows = results.length * options.throwsPerRound;
  const byDistance = Object.entries(
    results.reduce(aggregate(options.throwsPerRound), {})
  )
    .map(([distance, entry]) => ({
      distance: Number(distance),
      ...entry,
    }))
    .sort((a, b) => a.distance - b.distance);

  return (
    <section
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h2>Results</h2>

      <h3>
        Total: {totalScore}/{totalThrows} ({percentage(totalScore, totalThrows)}
        )
      </h3>

      <h3>Weighted score: {weightedScore}</h3>

      <h3>By distance</h3>
      <table>
        <thead>
          <tr>
            <th>Distance</th>
            <th>Score</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {byDistance.map((row) => (
            <tr key={`by distance row ${row.distance}`}>
              <td>{row.distance} m</td>
              <td>
                {row.score}/{row.throws}
              </td>
              <td>{percentage(row.score, row.throws)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>By round</h3>
      <table>
        <thead>
          <tr>
            <th>Round</th>
            <th>Distance</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={`by round row ${result.round}`}>
              <td>{result.round}</td>
              <td>{result.distance} m</td>
              <td>
                {result.score}/{options.throwsPerRound}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={() => {
          setResults([]);
          setState("setup");
        }}
      >
        Done
      </button>
    </section>
  );
}

function percentage(a: number, b: number) {
  return `${Math.round((a / b) * 100) || 0} %`;
}
