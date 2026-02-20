import styles from "./Pin.module.css";
import { useState, useRef } from "react";
import Button from "../common/button/Button";
import { useApi } from "../../hooks/useApi";
import { useToast } from "../../hooks/useToast.js";
import { AuthContext } from "../../contexts/Contexts";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function Pin({ onClose }) {
  const [pin, setPin] = useState(Array(6).fill(""));
  const inputsRef = useRef([]);
  const toast = useToast();
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const { fetchRequest } = useApi({
    method: "post",
    url: `/auth/mfa/signin`,
  });

  const handleSubmit = async () => {
    console.log("pin", pin);
    const { success, error } = await fetchRequest({
      data: {
        token: pin.join(""),
      },
    });
    if (success) {
      setPin(Array(6).fill(""));
      setIsAuthenticated(true);
      navigate("/dashboard");
      onClose();
      toast.success("Pin verified");
    } else {
      toast.error(error);
    }
  };
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // move focus forward
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div className={styles["pin-wrapper"]}>
      <div className={styles["pin-container"]}>
        {pin.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength="1"
            className={styles["pin-input"]}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        ))}
      </div>
      <Button
        type="submit"
        variant="primary"
        disabled={pin.some((digit) => !digit)}
        onClick={handleSubmit}
      >
        Verify
      </Button>
    </div>
  );
}

Pin.propTypes = {
  onClose: PropTypes.func,
};

export default Pin;
