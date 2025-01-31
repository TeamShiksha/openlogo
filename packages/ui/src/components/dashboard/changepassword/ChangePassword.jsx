import { useState } from "react";
import CustomInput from "../../common/input/CustomInput";
import Button from "../../common/button/Button";
import styles from "./ChangePassword.module.css";

const PASSWORD_FIELDS = [
  { type: "password", name: "currPassword", label: "Current Password" },
  { type: "password", name: "newPassword", label: "New Password" },
];

function ChangePassword() {
  const [formValues, setFormValues] = useState({
    currPassword: "",
    newPassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      {PASSWORD_FIELDS.map((field) => (
        <CustomInput
          key={field.name}
          type={field.type}
          name={field.name}
          label={field.label}
          value={formValues[field.name]}
          onChange={handleChange}
          required
        />
      ))}
      <Button
        type="submit"
        variant="primary"
        className={styles.changePasswordButton}
      >
        Change password
      </Button>
    </form>
  );
}

export default ChangePassword;
