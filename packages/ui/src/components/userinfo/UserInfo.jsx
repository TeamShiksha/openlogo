import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { MESSAGES, USER_INFO_FIELDS } from "../../utils/Constants";
import styles from "./UserInfo.module.css";
import CustomInput from "../common/input/CustomInput";
import Button from "../common/button/Button";
import { useApi } from "../../hooks/useApi";
import { useToast } from "../../hooks/useToast";

function UserInfo({ name, email, isGuest }) {
  const toast = useToast();
  const initialValues = {
    name,
    email,
    isBtnDisabled: true,
  };
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({
    type: "",
    message: "",
  });
  const { makeRequest, errorMsg } = useApi({
    method: "PATCH",
    url: "/user/me",
    data: {
      name: formData.name,
    },
  });

  useEffect(() => {
    if (errorMsg) toast.error(errorMsg);
  }, [errorMsg, toast]);

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
        isBtnDisabled: isGuest,
        [name]: value,
      };
    });
    setFormErrors({
      type: "",
      message: "",
    });
  };

  const handleUserInfoUpdate = async (e) => {
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

    try {
      setIsUpdating(true);
      const success = await makeRequest();
      if (success) {
        setFormErrors({ type: "", message: "" });
        toast.success(MESSAGES.USERNAME_UPDATE_SUCCESS);
      }
    } finally {
      setIsUpdating(false);
    }
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
        disabled={formData.isBtnDisabled || isUpdating}
        variant={"primary"}
        isLoading={isUpdating}
      >
        Save
      </Button>
    </form>
  );
}

UserInfo.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  isGuest: PropTypes.bool.isRequired,
};

export default UserInfo;
