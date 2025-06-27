"use client";

import { useEffect, useState } from "react";

const codeLines = [
  'function greet(name) {',
  '  if (!name) {',
  '    return "Hello, world!";',
  '  }',
  '  return `Hello, ${name}!`;',
  '}',
  '',
  'console.log(greet("Aden"));',
];

const highlight = (line: string) => {
  // Very basic JS/TS highlighting
  return line
    .replace(/(function|return|if|const|let|var|else|console|log)/g, '<span class="text-blue-400">$1</span>')
    .replace(/("[^"]*"|\`[^`]*\`)/g, '<span class="text-green-400">$1</span>')
    .replace(/(\{\}|\{|\}|\(|\))/g, '<span class="text-pink-400">$1</span>')
    .replace(/(\d+)/g, '<span class="text-yellow-300">$1</span>');
};

export default function CodeTypingAnimation() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (currentLine < codeLines.length) {
      if (currentChar < codeLines[currentLine].length) {
        const timeout = setTimeout(() => {
          setDisplayedLines((prev) => {
            const newLines = [...prev];
            newLines[currentLine] = codeLines[currentLine].slice(0, currentChar + 1);
            return newLines;
          });
          setCurrentChar((c) => c + 1);
        }, 30);
        return () => clearTimeout(timeout);
      } else {
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }
    } else {
      setIsDone(true);
    }
  }, [currentLine, currentChar]);

  useEffect(() => {
    // Initialize displayedLines with empty strings
    setDisplayedLines(Array(codeLines.length).fill(""));
  }, []);

  return (
    <div className="flex justify-center my-6">
      <pre className="bg-gray-900 rounded-lg p-4 text-left text-sm sm:text-base leading-relaxed shadow-lg min-w-[320px] max-w-full overflow-x-auto border border-gray-700">
        {displayedLines.map((line, idx) => (
          <div key={idx} className="whitespace-pre">
            <span
              dangerouslySetInnerHTML={{
                __html: highlight(line) +
                  (idx === currentLine && !isDone ? '<span class="text-white animate-pulse">|</span>' : '')
              }}
            />
          </div>
        ))}
      </pre>
    </div>
  );
} 