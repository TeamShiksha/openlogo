import { PASSWORD_VALIDATION_MESSAGES } from "./constants"; // Import validation messages

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
    if (password.length < PASSWORD_RULES.minLength) {
      errors.password = PASSWORD_VALIDATION_MESSAGES.minLength(PASSWORD_RULES.minLength);
    }

    if (password.length > PASSWORD_RULES.maxLength) {
      errors.password = PASSWORD_VALIDATION_MESSAGES.maxLength(PASSWORD_RULES.maxLength);
    }

    if (PASSWORD_RULES.requiresUppercase && !/[A-Z]/.test(password)) {
      errors.password = PASSWORD_VALIDATION_MESSAGES.uppercase;
    }

    if (PASSWORD_RULES.requiresLowercase && !/[a-z]/.test(password)) {
      errors.password = PASSWORD_VALIDATION_MESSAGES.lowercase;
    }

    if (PASSWORD_RULES.requiresDigit && !/\d/.test(password)) {
      errors.password = PASSWORD_VALIDATION_MESSAGES.digit;
    }

    if (PASSWORD_RULES.requiresSpecialChar && !PASSWORD_RULES.specialCharRegex.test(password)) {
      errors.password = PASSWORD_VALIDATION_MESSAGES.specialChar;
    }
  }

  if (Object.keys(errors).length === 0) {
    errors.password = PASSWORD_VALIDATION_MESSAGES.generalError; // Default generic error message
  }

  return errors;
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
    const messageRegex = /^[^!@#$%^&*(){}[\]\\.;'",.<>/?`~|0-9]*$/;
    return messageRegex.test(message);
  };
  
  export const formatDate = (dateString) => {
    const date = dateString ? new Date(dateString) : new Date();
    return date.toLocaleDateString('en-us', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };
  