import validator from "validator";

export function validateForm({ userName, email, password, phoneNumber }) {
  const errors = {};

  if (!userName.trim()) {
    errors.userName = "User name is required";
  }

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (
    !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())
  ) {
    errors.email = "Please enter a valid email address";
  }

  if (!password.trim()) {
    errors.password = "Password is required";
  } else if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    errors.password =
      "Password must be at least 8 characters, include one number and one symbol";
  }

  if (!phoneNumber.trim()) {
    errors.phoneNumber = "Phone number is required";
  } else if (
    !/^(\+91[\-\s]?|91[\-\s]?|0)?[6-9]\d{9}$/.test(phoneNumber.trim())
  ) {
    errors.phoneNumber = "Please enter a valid phone number";
  }

  return errors;
}
