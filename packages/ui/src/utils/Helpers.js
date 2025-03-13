import { DOCUMENTATION, PASSWORD_VALIDATION_MESSAGES } from "./Constants";

const PASSWORD_RULES = {
  minLength: 6,
  maxLength: 20,
  requiresUppercase: true,
  requiresLowercase: true,
  requiresDigit: true,
  requiresSpecialChar: true,
  specialCharRegex: /[!@#$%^&*(),.?":{}|<>]/,
};

export const isValidPassword = (password) => {
  const errors = {};

  if (!password) {
    errors.password = PASSWORD_VALIDATION_MESSAGES.required;
  } else {
    const checks = [
      {
        condition: password.length < PASSWORD_RULES.minLength,
        message: PASSWORD_VALIDATION_MESSAGES.minLength(
          PASSWORD_RULES.minLength
        ),
      },
      {
        condition: password.length > PASSWORD_RULES.maxLength,
        message: PASSWORD_VALIDATION_MESSAGES.maxLength(
          PASSWORD_RULES.maxLength
        ),
      },
      {
        condition: PASSWORD_RULES.requiresUppercase && !/[A-Z]/.test(password),
        message: PASSWORD_VALIDATION_MESSAGES.uppercase,
      },
      {
        condition: PASSWORD_RULES.requiresLowercase && !/[a-z]/.test(password),
        message: PASSWORD_VALIDATION_MESSAGES.lowercase,
      },
      {
        condition: PASSWORD_RULES.requiresDigit && !/\d/.test(password),
        message: PASSWORD_VALIDATION_MESSAGES.digit,
      },
      {
        condition:
          PASSWORD_RULES.requiresSpecialChar &&
          !PASSWORD_RULES.specialCharRegex.test(password),
        message: PASSWORD_VALIDATION_MESSAGES.specialChar,
      },
    ];

    checks.forEach(({ condition, message }) => {
      if (condition) {
        errors.password = message;
      }
    });
  }

  return Object.keys(errors).length === 0 ? {} : errors;
};

export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
};

export const isSQLInjectionAttempt = (message) => {
  const sqlInjectionRegex = /(')|(--)|(\/\*)|(\bSELECT\b)|\bunion\b/i;
  return sqlInjectionRegex.test(message);
};

export const isValidMessage = (message) => {
  const messageRegex = /^[^!@#$%^&*(){}[\];'",.<>/?`~|0-9]*$/;
  return messageRegex.test(message);
};

export const isValidName = (name) => {
  const nameRegex = /^[a-zA-Z\s]*$/;
  return nameRegex.test(name);
};

export const formatDate = (dateString) => {
  const date = dateString ? new Date(dateString) : new Date();
  return date.toLocaleDateString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const handleNavigation = (event, url, navigate) => {
  event.preventDefault();

  const [path, sectionId] = url.split("#");

  if (window.location.pathname !== path) {
    if (sectionId) {
      sessionStorage.setItem("scrollTo", sectionId);
    }
    navigate(path);
  } else if (sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 95;
      const elementTop = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementTop - offset,
        behavior: "smooth",
      });
    }
  } else {
    window.scrollTo(0, 0);
  }
};

export const validate = (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = "Name is required!";
  } else if (!isValidName(values.name)) {
    errors.name = "Name can only contain letters and spaces!";
  }

  if (!values.email) {
    errors.email = "Email is required!";
  } else if (!isValidEmail(values.email)) {
    errors.email = "This is not a valid email format!";
  }

  const passwordErrors = isValidPassword(values.password);
  if (Object.keys(passwordErrors).length > 0) {
    errors.password = passwordErrors.password;
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirm password is required!";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match!";
  }

  if (!values.message) {
    errors.message = "Message is required!";
  } else if (!isValidMessage(values.message)) {
    errors.message = "Message can only contain letters and spaces!";
  }

  return errors;
};

/**
 * Returns the base API URL based on the provided domain.
 *
 * @param {string} domain - The domain to check against.
 * @returns {string} - The base API URL corresponding to the domain.
 * If the domain includes "localhost", it returns the local URL.
 * If the domain includes "stage", it returns the staging URL.
 * Otherwise, it returns the production URL.
 */
export const getBaseApiUrl = (domain) => {
  if (domain.includes("localhost")) {
    return DOCUMENTATION.localUrl;
  } else if (domain.includes("stage")) {
    return DOCUMENTATION.baseStageUrl;
  } else {
    return DOCUMENTATION.baseProdUrl;
  }
};
