import { useState } from "react";
import { USER_INFO_FIELDS } from "../../../utils/Constants";
import styles from "./UserInfo.module.css";
import CustomInput from "../../common/input/CustomInput";
import Button from "../../common/button/Button";

function UserInfo() {
  const initialValues = {
    name: "John Doe",
    email: "johndoe@gmail.com",
    isBtnDisabled: true,
  };
  const [formData, setFormData] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({
    type: "",
    message: "",
  });

  const validate = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = "Name is required!";
    }
    return errors;
  };

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        isBtnDisabled: false,
        [name]: value,
      };
    });
    setFormErrors({
      type: "",
      message: "",
    });
  };

  const handleUserInfoUpdate = (e) => {
    e.preventDefault();

    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors({
        type: "error",
        message: Object.values(validationErrors)[0],
      });
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          isBtnDisabled: true,
        };
      });
      return;
    }
    // to be implemented

    setFormErrors({ type: "success", message: "Signed in successfully!" });
  };

  return (
    <form className={styles["user-info-input-group"]}>
      {USER_INFO_FIELDS.map((field) => (
        <CustomInput
          key={field.name}
          type={field.type}
          name={field.name}
          label={field.label}
          value={formData[field.name]}
          onChange={handleUserInfoChange}
          {...(field.name === "email" ? { disabled: true } : {})}
          {...(field.name === "name" && formErrors.type === "error"
            ? { error: formErrors.message }
            : {})}
        />
      ))}
      <Button
        onClick={handleUserInfoUpdate}
        disabled={formData.isBtnDisabled}
        variant={"primary"}
      >
        Save
      </Button>
    </form>
  );
}

export default UserInfo;
