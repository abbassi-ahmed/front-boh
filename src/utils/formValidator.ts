export function ValidateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function ValidatePhoneNumber(phoneNumber: string): boolean {
  const phoneNumberRegex = /^\d{8}$/;
  return phoneNumberRegex.test(phoneNumber);
}

export function ValidatetName(name: string): boolean {
  const nameRegex = /^[a-zA-Z]{2,}$/;
  return nameRegex.test(name);
}

export function ValidateConfirmPassword(
  password: string,
  confirmPassword: string
): boolean {
  return password === confirmPassword;
}
