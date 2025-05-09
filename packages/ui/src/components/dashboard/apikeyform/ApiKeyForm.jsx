import CustomInput from "../../common/input/CustomInput";
import Button from "../../common/button/Button";
import styles from "./ApiKeyForm.module.css";
import PropTypes from "prop-types";

function ApiKeyForm({ role }) {
  return (
    <section className={styles["dashboard-content-section"]}>
      <form className={styles["api-key-container"]} noValidate>
        <p className={styles["dashboard-reset-date"]}>
          Generate a new API key to use in your projects.
        </p>
        <CustomInput type="text" name="apikey" label="Add the description" />
        <Button
          className={styles.width}
          variant="primary"
          type="submit"
          disabled={role == "GUEST"}
        >
          Generate Key
        </Button>
      </form>
    </section>
  );
}
ApiKeyForm.propTypes = {
  role: PropTypes.string.isRequired,
};

export default ApiKeyForm;
