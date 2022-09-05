import { useState } from "react";
import Practice from "./Practice";
import Results from "./Results";
import Setup from "./Setup";
import { AppState, Options, Result } from "./types";

function App() {
  const [state, setState] = useState<AppState>("setup");
  const [results, setResults] = useState<Result[]>([]);
  const [options, setOptions] = useState<Options>({
    startDistance: 4,
    throwsPerRound: 3,
    change: 0.5,
    rounds: 10,
  });

  return (
    <main className="App">
      <h1>Putter</h1>
      {state === "setup" && (
        <Setup setState={setState} options={options} setOptions={setOptions} />
      )}
      {state === "practice" && (
        <Practice
          setState={setState}
          setResults={setResults}
          results={results}
          options={options}
          setOptions={setOptions}
        />
      )}
      {state === "results" && (
        <Results
          setState={setState}
          options={options}
          results={results}
          setResults={setResults}
        />
      )}
    </main>
  );
}

export default App;
