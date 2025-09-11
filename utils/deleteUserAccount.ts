export const deleteUserAccount = async (userId: string) => {
  try {
    const response = await fetch("/api/auth/delete-account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ошибка при удалении аккаунта");
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при удалении аккаунта:", error);
    throw error;
  }
};
