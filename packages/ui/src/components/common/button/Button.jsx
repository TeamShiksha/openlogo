import styles from "./Button.module.css";
import { PropTypes } from "prop-types";

const Button = ({ children, variant, onClick = () => {} }) => {
  return (
    <button onClick={onClick} className={styles[variant]}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary"]).isRequired,
  onClick: PropTypes.func,
};

export default Button;
