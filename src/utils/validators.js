/**
 * Validation utilities extracted from backend models
 * Mirrors backend validation rules for real-time client feedback
 */

// Password validation rules (from RegisterUserRequest)
const PASSWORD_RULES = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireDigit: true,
  requireSpecial: true,
};

// Name validation regex (from RegisterUserRequest)
const NAME_REGEX = /^[a-zA-Z\s'-]+$/;
const NAME_CONSTRAINTS = {
  minLength: 2,
  maxLength: 50,
};

/**
 * Validate password strength against backend rules
 * @param {string} password
 * @returns {object} { isValid: boolean, strength: 'weak'|'medium'|'strong', errors: string[] }
 */
export const validatePassword = (password) => {
  const errors = [];

  if (!password) {
    return {
      isValid: false,
      strength: "none",
      errors: ["Password is required"],
    };
  }

  if (password.length < PASSWORD_RULES.minLength) {
    errors.push(
      `Password must be at least ${PASSWORD_RULES.minLength} characters long`
    );
  }

  if (password.length > PASSWORD_RULES.maxLength) {
    errors.push(
      `Password cannot exceed ${PASSWORD_RULES.maxLength} characters`
    );
  }

  const hasUppercase = /[A-Z]/.test(password);
  if (!hasUppercase) {
    errors.push("Password must contain at least one uppercase letter");
  }

  const hasLowercase = /[a-z]/.test(password);
  if (!hasLowercase) {
    errors.push("Password must contain at least one lowercase letter");
  }

  const hasDigit = /\d/.test(password);
  if (!hasDigit) {
    errors.push("Password must contain at least one digit");
  }

  const hasSpecial = /[!@#$%^&*(),.?":{}|<>\-_=+[\]\\;'`~/]/.test(password);
  if (!hasSpecial) {
    errors.push("Password must contain at least one special character");
  }

  // Determine strength
  let strength = "weak";
  if (
    password.length >= PASSWORD_RULES.minLength &&
    hasUppercase &&
    hasLowercase &&
    hasDigit &&
    hasSpecial
  ) {
    strength = password.length >= 12 ? "strong" : "medium";
  }

  return {
    isValid: errors.length === 0,
    strength,
    errors,
  };
};

/**
 * Validate name format against backend rules
 * @param {string} name
 * @returns {object} { isValid: boolean, errors: string[] }
 */
export const validateName = (name) => {
  const errors = [];

  if (!name) {
    return { isValid: false, errors: ["Name is required"] };
  }

  if (name.length < NAME_CONSTRAINTS.minLength) {
    errors.push(
      `Name must be at least ${NAME_CONSTRAINTS.minLength} characters long`
    );
  }

  if (name.length > NAME_CONSTRAINTS.maxLength) {
    errors.push(`Name cannot exceed ${NAME_CONSTRAINTS.maxLength} characters`);
  }

  if (!NAME_REGEX.test(name)) {
    errors.push(
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate email format (basic check - server will verify availability)
 * @param {string} email
 * @returns {object} { isValid: boolean, errors: string[] }
 */
export const validateEmail = (email) => {
  const errors = [];

  if (!email) {
    return { isValid: false, errors: ["Email is required"] };
  }

  // Basic email regex (HTML5 type="email" will also validate)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push("Please enter a valid email address");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate password confirmation match
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {object} { isValid: boolean, errors: string[] }
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, errors: ["Password confirmation is required"] };
  }

  if (password !== confirmPassword) {
    return { isValid: false, errors: ["Passwords do not match"] };
  }

  return { isValid: true, errors: [] };
};

/**
 * Get password strength color for UI feedback
 * @param {string} strength - 'none' | 'weak' | 'medium' | 'strong'
 * @returns {string} CSS color
 */
export const getPasswordStrengthColor = (strength) => {
  const colors = {
    none: "#ccc",
    weak: "#ef4444",
    medium: "#f59e0b",
    strong: "#10b981",
  };
  return colors[strength] || colors.none;
};

/**
 * Get password strength label
 * @param {string} strength
 * @returns {string}
 */
export const getPasswordStrengthLabel = (strength) => {
  const labels = {
    none: "—",
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
  };
  return labels[strength] || labels.none;
};

/**
 * Get password strength bar width percentage
 * @param {string} strength - 'none' | 'weak' | 'medium' | 'strong'
 * @returns {number} Width percentage (0, 25, 50, 100)
 */
export const getPasswordStrengthWidth = (strength) => {
  const widths = {
    none: 0,
    weak: 25,
    medium: 50,
    strong: 100,
  };
  return widths[strength] || widths.none;
};
