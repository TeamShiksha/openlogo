import { useState } from "react";
import { UserInfoItems } from "../../../utils/constants";
import styles from "./UserInfo.module.css";
import CustomInput from "../../common/input/CustomInput";
import Button from "../../common/button/Button";

function UserInfo() {
  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    email: "johndoe@gamil.com",
    isBtnDisabled: true,
  });

  const handleUserInfoChange = (itemType, e) => {
    const { value } = e.target;

    setUserInfo((prevUserInfo) => {
      return {
        ...prevUserInfo,
        isBtnDisabled: false,
        [itemType]: value,
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
        <CustomInput
          type="text"
          name={UserInfoItems.NAME}
          label="username"
          value={userInfo.name}
          onChange={(e) => handleUserInfoChange(UserInfoItems.NAME, e)}
        />
        <CustomInput
          type="email"
          name={UserInfoItems.EMAIL}
          label="email"
          value={userInfo.email}
          onChange={(e) => handleUserInfoChange(UserInfoItems.EMAIL, e)}
          disabled={true}
        />
        <Button
          onClick={handleUserInfoUpdate}
          disabled={userInfo.isBtnDisabled}
          className={styles.saveUserInfoBtn}
        >
          Save
        </Button>
      </form>
    </div>
  );
}

export default UserInfo;
