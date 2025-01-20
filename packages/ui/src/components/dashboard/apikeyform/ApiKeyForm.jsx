import CustomInput from "../../common/input/CustomInput";
import Button from "../../common/button/Button";
import styles from "./ApiKeyForm.module.css";

function ApiKeyForm() {
  return (
    <section className={styles.dashboardContentSection}>
      <form className={styles.apiKeyContainer} noValidate>
        <p className={styles.dashboardResetDate}>
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
