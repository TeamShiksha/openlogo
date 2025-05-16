import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";
import Button from "../../components/common/button/Button";
import { BUTTON_TEXT, NOT_FOUND_PAGE } from "../../utils/Constants";

const NotFound = () => {
  return (
    <div className={styles["not-found-container"]}>
      <h1 className={styles["not-found-title"]}>{NOT_FOUND_PAGE.TITLE}</h1>
      <p className={styles["not-found-message"]}>{NOT_FOUND_PAGE.MESSAGE}</p>
      <Link to="/">
        <Button type="button" variant="primary">
          {BUTTON_TEXT.goToHome}
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
