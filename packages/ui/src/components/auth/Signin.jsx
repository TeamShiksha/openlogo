import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import CustomInput from "../common/input/CustomInput";
import Button from "../common/button/Button";
import { BUTTON_TEXT, SIGNIN } from "../../utils/Constants";
import styles from "./SignForm.module.css";
import { validate } from "../../utils/Helpers";
import { Navigate, useLocation } from 'react-router-dom';
import {useApi }from "../../hooks/useApi";
import { AuthContext } from "../../contexts/Contexts";

const SignIn = ({ toggleForm }) => {
  const [formData, setFormData] = useState(SIGNIN.initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const {isAuthenticated,setIsAuthenticated} = useContext(AuthContext);
  // const navigate = Navigate(); // Use navigate here, directly inside the component
  const location = useLocation(); // Get the current location
  const { makeRequest, data } = useApi({
    method: "post",
    url: `/api/auth/signin`,
    data: formData,
  });
  useEffect(() => {
    if (focusedField !== "email") {
      setFormErrors({});
      return;
    }
    const timer = setTimeout(() => {
      const validationErrors = validate({
        [focusedField]: formData[focusedField],
      });
      setFormErrors({
        [focusedField]: validationErrors[focusedField] || "",
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [focusedField, formData]);

  useEffect(() => {
    const errors = validate({ email: formData.email });
    setIsFormValid(Object.keys(errors).length === 0);
  }, [formData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault();
    setIsSubmit(true);
  
      // const response = await instance.post(
      //   `${import.meta.env.VITE_BASE_URL}/api/auth/signin`,
      //   formData
      // );
      // console.log("Signin Successful", response.data);
      
      // // Check if statusCode is 200
      // if (response.data.statusCode === 200) {
      //   // Redirect to the /home page using navigate
      //   navigate("/");
      // } else {
      //   // If the statusCode is not 200, redirect to /dashboard
      //   // navigate("/dashboard");
      //   alert("Signin failed. Please check your credentials.");
      // }
      const success = await makeRequest();
      if (success) {

        setFormData(SIGNIN.initialValues);
        setIsAuthenticated(true);
        console.log("Signin Successful", data);
        setIsSubmit(false);
        setFocusedField(null);
      }
  };
//   useEffect(() => {
//     if (data) {
      
//       setIsAuthenticated(true);
//       // navigate(location?.pathname || "/dashboard");

//       // <Navigate to={location?.pathname || "/dashboard"} replace />;

//       // window.location.href="/";
//     }
//   },[data, isSubmit]
// );

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <img src="/logo-images.png" alt="openlogo" className={styles.logo} />
        <h2 className={styles.title}>{SIGNIN.title}</h2>
        <div className={styles["form-width"]}>
          {SIGNIN["fields"].map((field) => (
            <CustomInput
              error={formErrors[field.name]}
              key={field.name}
              type={field.type}
              name={field.name}
              label={field.label}
              value={formData[field.name]}
              onChange={handleChange}
              onFocus={() => setFocusedField(field.name)}
              onBlur={() => setFocusedField(null)}
            />
          ))}
        </div>
        <p className={styles["forgot-password"]}>
          {BUTTON_TEXT.forgotPassword}
        </p>
        <Button
          type="submit"
          variant="primary"
          disabled={!isFormValid || isSubmit}
        >
          {BUTTON_TEXT.signIn}
        </Button>
        <p>{isAuthenticated ? "Authenticated" : "Not Authenticated" }</p>
      </form>
      <hr className={styles.separator} />
      <p onClick={toggleForm} className={styles.switch}>
        {SIGNIN.footerText}
      </p>
    </>
  );
};

SignIn.propTypes = {
  toggleForm: PropTypes.func.isRequired,
};

export default SignIn;
