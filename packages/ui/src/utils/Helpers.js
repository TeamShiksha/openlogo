import { PASSWORD_VALIDATION_MESSAGES } from "./Constants";

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
          PASSWORD_RULES.minLength,
        ),
      },
      {
        condition: password.length > PASSWORD_RULES.maxLength,
        message: PASSWORD_VALIDATION_MESSAGES.maxLength(
          PASSWORD_RULES.maxLength,
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

export const formatDate = (dateString) => {
  const date = dateString ? new Date(dateString) : new Date();
  return date.toLocaleDateString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};
