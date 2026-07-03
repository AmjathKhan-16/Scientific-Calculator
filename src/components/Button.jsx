function Button({ label, type = "number", wide = false, onClick }) {
  return (
    <button
      className={`calc-button ${type}${wide ? " wide" : ""}`}
      type="button"
      onClick={() => onClick(label)}
      aria-label={label}
    >
      {label}
    </button>
  );
}

export default Button;
