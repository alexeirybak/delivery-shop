export const isPasswordValid = (password: string): boolean => {
  return (
    password.length >= 6 &&
    /[a-z]/.test(password) && // хотя бы одна строчная буква
    /[A-Z]/.test(password) && // хотя бы одна заглавная буква
    /\d/.test(password) // хотя бы одна цифра
  );
};

export const passwordRequirements = [
  {
    id: "length",
    text: "Минимум 6 символов",
    validator: (p: string) => p.length >= 6,
  },
  {
    id: "lowercase",
    text: "Строчная буква (a-z)",
    validator: (p: string) => /[a-z]/.test(p),
  },
  {
    id: "uppercase",
    text: "Заглавная буква (A-Z)",
    validator: (p: string) => /[A-Z]/.test(p),
  },
  {
    id: "number",
    text: "Хотя бы одна цифра",
    validator: (p: string) => /\d/.test(p),
  },
];
