import validator from "validator";

export function validateForm(
  { userName, email, password, phoneNumber, currentPassword, newPassword, confirmPassword },
  mode = "register"
) {
  const errors = {};

  if (mode === "register" || mode === "updateProfile") {
    // if (!userName?.trim()) {
    //   errors.userName = "User name is required";
    // }

    if (!email?.trim()) {
      errors.email = "Email is required";
    } else if (
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())
    ) {
      errors.email = "Please enter a valid email address";
    }

    if (!phoneNumber?.trim()) {
      // errors.phoneNumber = ""; //phone number not necessary
    } else if (
      !/^(\+91[\-\s]?|91[\-\s]?|0)?[6-9]\d{9}$/.test(phoneNumber.trim())
    ) {
      errors.phoneNumber = "Please enter a valid phone number";
    }
  }

  if (mode === "register") {
    if (!password?.trim()) {
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
  }

  if (mode === "passwordOnly") {
    if (!currentPassword?.trim()) {
      errors.currentPassword = "Current password is required";
    }

    if (!newPassword?.trim()) {
      errors.newPassword = "New password is required";
    } else if (
      !validator.isStrongPassword(newPassword, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 0,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      errors.newPassword =
        "New password must be at least 8 characters, include one number and one symbol";
    }

    if (!confirmPassword?.trim()) {
      errors.confirmPassword = "Confirm password is required";
    } else if (newPassword?.trim() !== confirmPassword?.trim()) {
      errors.confirmPassword = "Passwords do not match";
    }
  }

  return errors;
}
