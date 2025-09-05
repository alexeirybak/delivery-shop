export const checkAvatarExists = async (userId: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/auth/avatar/${userId}/check`);
    const data = await response.json();
    return data.exists;
  } catch {
    return false;
  }
};
