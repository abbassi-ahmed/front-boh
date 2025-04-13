// Email validation function
export function ValidateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password validation function
// export function ValidatePassword(password: string): boolean {
//   // Ensures password has at least:
//   // - one lowercase letter
//   // - one uppercase letter
//   // - one digit
//   // - at least 6 characters long
//   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
//   return passwordRegex.test(password);
// }

// Phone number validation function (8 digits only)
export function ValidatePhoneNumber(phoneNumber: string): boolean {
  const phoneNumberRegex = /^\d{8}$/;
  return phoneNumberRegex.test(phoneNumber);
}

export function ValidatetName(name: string): boolean {
  // Validates a  name that must consist of at least 2 characters
  const nameRegex = /^[a-zA-Z]{2,}$/;
  return nameRegex.test(name);
}

export function ValidateConfirmPassword(
  password: string,
  confirmPassword: string
): boolean {
  return password === confirmPassword;
}
