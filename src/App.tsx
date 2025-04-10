// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useCallback, useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { githubLight } from "@uiw/codemirror-theme-github";
import { Code2, Play, AlertCircle, CheckCircle2 } from "lucide-react";
import * as Babel from "@babel/standalone";
import { examples } from "./examples";

interface ConsoleMessage {
  type: "log" | "error" | "warn";
  content: string;
  timestamp: number;
}

function Preview({
  code,
  onConsoleMessage,
}: {
  code: string;
  onConsoleMessage: (message: ConsoleMessage) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  const compileAndRun = useCallback(() => {
    try {
      // Transform the code
      const transformedCode = Babel.transform(
        `const {useState, useEffect, useCallback, useMemo, useContext} = React;
         ${code}`,
        {
          presets: ["react"],
        }
      ).code;

      // Create and execute the component function
      const func = new Function(
        "React",
        `
        try {
          ${transformedCode}
          return Component;
        } catch (err) {
          console.error("Error in component code:", err);
          return null;
        }
      `
      );

      const ComponentFromCode = func(React);

      if (typeof ComponentFromCode !== "function") {
        throw new Error("Component must be a function");
      }

      setComponent(() => ComponentFromCode);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setComponent(null);
      onConsoleMessage({
        type: "error",
        content: err instanceof Error ? err.message : "An error occurred",
        timestamp: Date.now(),
      });
    }
  }, [code, onConsoleMessage]);

  return (
    <div className="space-y-4 flex-1 flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Preview</h2>
        <button
          onClick={compileAndRun}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
        >
          <Play size={16} /> Run Code
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
          <pre className="text-sm text-red-700 whitespace-pre-wrap">
            {error}
          </pre>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-6 flex-1">
        {Component && <Component />}
      </div>
    </div>
  );
}

function App() {
  const [selectedExample, setSelectedExample] = useState("playground");
  const [code, setCode] = useState(examples[selectedExample].bad);
  const [showGood, setShowGood] = useState(false);

  const handleExampleChange = (example: string) => {
    setSelectedExample(example);
    setCode(showGood ? examples[example].good : examples[example].bad);
  };

  const toggleSolution = () => {
    setShowGood(!showGood);
    setCode(
      showGood ? examples[selectedExample].bad : examples[selectedExample].good
    );
  };

  const isPlayground = selectedExample === "playground";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Code2 className="text-blue-500" size={24} />
            <h1 className="text-xl font-bold">React Playground</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <select
                value={selectedExample}
                onChange={(e) => handleExampleChange(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
              >
                {Object.entries(examples).map(([key, example]) => (
                  <option key={key} value={key}>
                    {example.title}
                  </option>
                ))}
              </select>
              {!isPlayground && (
                <button
                  onClick={toggleSolution}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    showGood
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <CheckCircle2 size={16} />
                  {showGood ? "Show Problem" : "Show Solution"}
                </button>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <CodeMirror
                value={code}
                height="400px"
                theme={githubLight}
                extensions={[javascript({ jsx: true })]}
                onChange={setCode}
              />
            </div>

            {!isPlayground && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-gray-700 mb-4">
                  {examples[selectedExample].description}
                </p>
                <h3 className="font-semibold mb-2">Explanation</h3>
                <p className="text-sm text-gray-700">
                  {examples[selectedExample].explanation}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6 h-full flex flex-col">
            <Preview code={code} onConsoleMessage={() => {}} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
