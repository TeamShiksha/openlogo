import CustomInput from "../../common/input/CustomInput";
import styles from "./ApiKeyForm.module.css";

function ApiKeyForm() {
  return (
    <section className={styles.dashboardContentSection}>
      <form className={styles.apiKeyContainer} noValidate>
        <p className={styles.dashboardResetDate}>
          Generate a new API key to use in your projects.
        </p>
        <CustomInput
          type="text"
          name="apikey"
          label="Add the description"
        />
        <button type="submit">Generate Key</button>
      </form>
    </section>
  );
}

export default ApiKeyForm;
