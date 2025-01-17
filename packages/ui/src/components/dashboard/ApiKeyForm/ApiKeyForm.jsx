import CustomInput from "../../common/input/CustomInput";
import styles from "./ApiKeyForm.module.css";
import Button from "../../common/button/Button";

function ApiKeyForm() {
  return (
    <section className={styles.dashboardContentSection}>
      <form className={styles.apiKeyContainer} noValidate>
        <p className={styles.dashboardResetDate}>
          Generate a new API key to use in your projects.
        </p>
        <CustomInput type="text" name="apikey" label="Add the description" />
        <Button  variant="primary" type="submit"  className={styles.width}>Generate Key</Button>
      </form>
    </section>
  );
}

export default ApiKeyForm;