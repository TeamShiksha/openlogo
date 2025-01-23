import { useState } from "react";
import { USER_INFO_FIELDS } from "../../../utils/constants";
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

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        isBtnDisabled: false,
        [name]: value,
      };
    });
  };

  const handleUserInfoUpdate = (e) => {
    e.preventDefault();

    // to be implemented
  };

  return (
    <div className={styles.dashboardContentItem}>
      <h6 className={styles.contentItemHeading}>User Info</h6>
      <form className={styles.userInfoInputGroup}>
        {USER_INFO_FIELDS.map((field) => (
          <CustomInput
            key={field.name}
            type={field.type}
            name={field.name}
            label={field.label}
            value={formData[field.name]}
            onChange={handleUserInfoChange}
            {...(field.name === "email" ? { disabled: true } : {})}
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
    </div>
  );
}

export default UserInfo;
