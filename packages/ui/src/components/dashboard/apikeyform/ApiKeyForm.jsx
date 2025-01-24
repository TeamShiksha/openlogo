import CustomInput from "../../common/input/CustomInput";
import Button from "../../common/button/Button";
import styles from "./ApiKeyForm.module.css";

function ApiKeyForm() {
  return (
    <section className={styles["dashboard-content-section"]}>
      <form className={styles["api-key-container"]} noValidate>
        <p className={styles["dashboard-reset-date"]}>
          Generate a new API key to use in your projects.
        </p>
        <CustomInput type="text" name="apikey" label="Add the description" />
        <Button className={styles.width} variant="primary" type="submit">
          Generate Key
        </Button>
      </form>
    </section>
  );
}

export default ApiKeyForm;
