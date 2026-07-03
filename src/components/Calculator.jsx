import { useState } from "react";
import Button from "./Button.jsx";

const buttonRows = [
  [
    { label: "MC", type: "memory" },
    { label: "MR", type: "memory" },
    { label: "M+", type: "memory" },
    { label: "M-", type: "memory" },
    { label: "DEL", type: "delete" },
  ],
  [
    { label: "C", type: "clear" },
    { label: "(", type: "operator" },
    { label: ")", type: "operator" },
    { label: "%", type: "operator" },
    { label: "÷", type: "operator" },
  ],
  [
    { label: "sin", type: "scientific" },
    { label: "cos", type: "scientific" },
    { label: "tan", type: "scientific" },
    { label: "log", type: "scientific" },
    { label: "ln", type: "scientific" },
  ],
  [
    { label: "√", type: "scientific" },
    { label: "x²", type: "scientific" },
    { label: "^", type: "operator" },
    { label: "π", type: "scientific" },
    { label: "e", type: "scientific" },
  ],
  [
    { label: "7" },
    { label: "8" },
    { label: "9" },
    { label: "!", type: "scientific" },
    { label: "×", type: "operator" },
  ],
  [
    { label: "4" },
    { label: "5" },
    { label: "6" },
    { label: ".", type: "number" },
    { label: "-", type: "operator" },
  ],
  [
    { label: "1" },
    { label: "2" },
    { label: "3" },
    { label: "=", type: "equal" },
    { label: "+", type: "operator" },
  ],
  [
    { label: "0", wide: true },
    { label: "00" },
    { label: "/", type: "operator" },
    { label: "=", type: "equal" },
  ],
];

const functionLabels = new Set(["sin", "cos", "tan", "log", "ln", "√"]);

function factorial(value) {
  if (!Number.isInteger(value) || value < 0 || value > 170) {
    throw new Error("Invalid factorial");
  }

  let result = 1;
  for (let index = 2; index <= value; index += 1) {
    result *= index;
  }
  return result;
}

function normalizeExpression(expression) {
  return expression
    .replaceAll("×", "*")
    .replaceAll("÷", "/")
    .replaceAll("π", "Math.PI")
    .replaceAll("√", "Math.sqrt")
    .replaceAll("sin", "Math.sin")
    .replaceAll("cos", "Math.cos")
    .replaceAll("tan", "Math.tan")
    .replaceAll("log", "Math.log10")
    .replaceAll("ln", "Math.log")
    .replaceAll("e", "Math.E")
    .replaceAll("^", "**")
    .replace(/(\d+(?:\.\d+)?|Math\.PI|Math\.E|\))%/g, "($1/100)")
    .replace(/(\d+(?:\.\d+)?|Math\.PI|Math\.E|\))!/g, "factorial($1)");
}

function isSafeExpression(expression) {
  return /^[0-9+\-*/().%\s,!*A-Za-z_]+$/.test(expression);
}

function formatResult(value) {
  if (!Number.isFinite(value)) {
    throw new Error("Invalid result");
  }

  return Number.parseFloat(value.toPrecision(12)).toString();
}

function Calculator() {
  const [display, setDisplay] = useState("");
  const [result, setResult] = useState("0");
  const [memory, setMemory] = useState(0);
  const [hasError, setHasError] = useState(false);

  const calculate = (expression = display) => {
    if (!expression.trim()) {
      return 0;
    }

    const normalized = normalizeExpression(expression);
    if (!isSafeExpression(normalized)) {
      throw new Error("Unsafe expression");
    }

    const computed = Function("factorial", `"use strict"; return (${normalized});`)(factorial);
    return computed;
  };

  const showError = () => {
    setResult("Error");
    setHasError(true);
  };

  const appendValue = (value) => {
    setHasError(false);

    if (functionLabels.has(value)) {
      setDisplay((current) => `${current}${value}(`);
      return;
    }

    if (value === "x²") {
      setDisplay((current) => `${current}^2`);
      return;
    }

    setDisplay((current) => current + value);
  };

  const handleMemory = (label) => {
    try {
      const currentValue = Number(calculate());

      if (label === "M+") {
        setMemory((current) => current + currentValue);
      }

      if (label === "M-") {
        setMemory((current) => current - currentValue);
      }

      if (label === "MR") {
        setDisplay((current) => `${current}${formatResult(memory)}`);
        setHasError(false);
      }

      if (label === "MC") {
        setMemory(0);
      }
    } catch {
      showError();
    }
  };

  const handleClick = (label) => {
    if (["M+", "M-", "MR", "MC"].includes(label)) {
      handleMemory(label);
      return;
    }

    if (label === "C") {
      setDisplay("");
      setResult("0");
      setHasError(false);
      return;
    }

    if (label === "DEL") {
      setDisplay((current) => current.slice(0, -1));
      setHasError(false);
      return;
    }

    if (label === "=") {
      try {
        const nextResult = formatResult(calculate());
        setResult(nextResult);
        setDisplay(nextResult);
        setHasError(false);
      } catch {
        showError();
      }
      return;
    }

    appendValue(label);
  };

  return (
    <section className="calculator-shell" aria-label="Scientific calculator">
      <div className={`display-panel${hasError ? " error" : ""}`}>
        <div className="expression">{display || "0"}</div>
        <div className="result">{result}</div>
      </div>

      <div className="memory-status">
        <span>Memory</span>
        <strong>{formatResult(memory)}</strong>
      </div>

      <div className="button-grid">
        {buttonRows.flat().map((button, index) => (
          <Button
            key={`${button.label}-${index}`}
            label={button.label}
            type={button.type}
            wide={button.wide}
            onClick={handleClick}
          />
        ))}
      </div>
    </section>
  );
}

export default Calculator;
