const GUEST_NATIVE_LANGUAGE_KEY = "languni_guest_native_language";
const GUEST_LEARNING_LANGUAGE_KEY = "languni_guest_learning_language";

export const GUEST_LANGUAGES = [
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
  { value: "es", label: "Spanish" },
];

export function getGuestNativeLanguage() {
  return localStorage.getItem(GUEST_NATIVE_LANGUAGE_KEY) || "en";
}

export function setGuestNativeLanguage(language) {
  localStorage.setItem(GUEST_NATIVE_LANGUAGE_KEY, language);
}

export function getGuestLearningLanguage() {
  return localStorage.getItem(GUEST_LEARNING_LANGUAGE_KEY) || null;
}

export function setGuestLearningLanguage(language) {
  if (language) {
    localStorage.setItem(GUEST_LEARNING_LANGUAGE_KEY, language);
  }
}
