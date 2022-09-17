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
        range(2, options.maximumDistance),
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
        range(options.minimumDistance, 10),
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
        range(options.minimumDistance, options.maximumDistance, 0.5),
        "meters"
      )}
      {getSelect("Rounds", "rounds", range(5, 20))}
      {getSelect("Throws per round", "throwsPerRound", range(1, 5))}
      {getSelect("Distance change", "change", range(0, 1, 0.5), "meters")}
      <button onClick={() => setState("practice")}>Practice</button>
    </section>
  );
}
