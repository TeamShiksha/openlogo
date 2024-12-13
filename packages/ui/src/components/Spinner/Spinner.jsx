import styles from "./Spinner.module.css";

/**
 * @description - component to render a spinner
 * @returns {JSX.Element}
 */
function Spinner() {
  return (
    <div className={styles["container"]} data-testid="spinner-container">
      <div className={styles["spinner"]} data-testid="spinner" />
    </div>
  );
}

export default Spinner;
