import { useState } from "react";
import reactLogo from "@/assets/react.svg";
import wxtLogo from "/wxt.svg";
import "@/assets/style/globals.css";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://wxt.dev" target="_blank">
          <img src={wxtLogo} className="logo" alt="WXT logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>WXT + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the WXT and React logos to learn more
      </p>
      <button className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
        Hello Tailwind
      </button>
    </>
  );
}

export default App;
