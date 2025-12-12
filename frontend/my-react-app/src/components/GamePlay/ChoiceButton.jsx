function ChoiceButton({
  onClick = null,
  styles = {},
  icon = null,
  text = "",
  disabled = false,
}) {
  return (
    <button
      type="button"
      className="choice-button"
      onClick={onClick}
      style={styles}
      disabled={disabled}
    >
      {icon ? <div className="choice-icon">{icon}</div> : null}
      <div className="choice-text">{text}</div>
    </button>
  );
}

export default ChoiceButton;
