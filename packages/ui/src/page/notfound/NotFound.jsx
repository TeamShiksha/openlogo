import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";
import Button from "../../components/common/button/Button";
import { BUTTON_TEXT } from "../../utils/Constants";

const NotFound = () => {
  return (
    <div className={styles["not-found-container"]}>
      <h1 className={styles["not-found-title"]}>404 - Page Not Found</h1>
      <p className={styles["not-found-message"]}>
        The page you are looking for does not exist.
      </p>
      <Link to="/">
        <Button type="button" variant="primary">
          {BUTTON_TEXT.goToHome}
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
