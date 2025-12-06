// utils/validations.js

export function isEmailValid(email) {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
}

export function isPasswordStrong(password) {
  return password.length >= 6;
}

export function isNameValid(name) {
  return name.trim().length >= 2;
}

export function validateRegister(name, email, password) {
  const errors = {};

  if (!isNameValid(name)) errors.name = "Name must be at least 2 characters.";
  if (!isEmailValid(email)) errors.email = "Invalid email format.";
  if (!isPasswordStrong(password)) errors.password = "Password too weak.";

  return errors;
}

