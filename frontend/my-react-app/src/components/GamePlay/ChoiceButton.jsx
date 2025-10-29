function ChoiceButton({ onClick = null, styles = {}, icon = null, text }) {
  return (
    <button
      type="button"
      className="choice-button"
      onClick={onClick}
      style={styles}
    >
      {icon ? <div className="choice-icon">{icon}</div> : null}
      <div className="choice-text">{text}</div>
    </button>
  );
}

export default ChoiceButton;
