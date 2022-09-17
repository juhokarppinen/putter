import { AppState, Options, SetState } from "./types";
import { range } from "./util";

interface Props {
  options: Options;
  setState: SetState<AppState>;
  setOptions: SetState<Options>;
}

export default function Setup({ options, setOptions, setState }: Props) {
  const getSelect = (
    label: string,
    option: keyof Options,
    values: number[],
    postLabel?: string,
    process: (...args: any[]) => number = (n) => n
  ) => (
    <label>
      {label}:
      <select
        onChange={(e) =>
          setOptions((s) => ({
            ...s,
            [option]: process(Number(e.target.value)),
          }))
        }
        value={options[option]}
      >
        {values.map((value) => (
          <option key={`${label} ${option} ${value}`} value={value}>
            {value}
          </option>
        ))}
      </select>
      {postLabel}
    </label>
  );

  return (
    <section>
      <h2>Setup</h2>
      {getSelect(
        "Minimum distance",
        "minimumDistance",
        range(2, options.maximumDistance + 1),
        "meters",
        (minimumDistance: number) => (
          setOptions((s) => ({
            ...s,
            startDistance: Math.max(s.startDistance, minimumDistance),
          })),
          minimumDistance
        )
      )}
      {getSelect(
        "Maximum distance",
        "maximumDistance",
        range(options.minimumDistance, 11),
        "meters",
        (maximumDistance: number) => (
          setOptions((s) => ({
            ...s,
            startDistance: Math.min(s.startDistance, maximumDistance),
          })),
          maximumDistance
        )
      )}
      {getSelect(
        "Starting distance",
        "startDistance",
        range(options.minimumDistance, options.maximumDistance + 1),
        "meters"
      )}
      {getSelect("Rounds", "rounds", range(5, 21))}
      {getSelect("Throws per round", "throwsPerRound", range(1, 6))}
      {getSelect("Distance change", "change", [0, 0.5, 1], "meters")}
      <button onClick={() => setState("practice")}>Practice</button>
    </section>
  );
}
