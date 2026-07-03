import Calculator from "./components/Calculator.jsx";

function App() {
  return (
    <div className="app">
      <header className="site-header">
        <p className="brand">MathsCalculator</p>
        <p className="tagline">Smart Scientific Calculator for Fast Calculations</p>
      </header>

      <main className="main-content">
        <Calculator />
      </main>

      <footer className="site-footer">
        <p>© 2026 MathsCalculator. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
