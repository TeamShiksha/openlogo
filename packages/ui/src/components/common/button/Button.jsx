import styles from "./Button.module.css";
const Button = ({ children, variant, onClick = () => {} }) => {
  return (
    <button onClick={onClick} className={styles[variant]}>
      {children}
    </button>
  );
};

export default Button;
