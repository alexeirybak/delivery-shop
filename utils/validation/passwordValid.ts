export const isPasswordValid = (pass: string) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(pass);
};
