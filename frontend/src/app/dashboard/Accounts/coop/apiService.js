const API_URL = "http://localhost:5000/api/accounts"; // Backend URL

export const createAccount = async (accountData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(accountData),
    });

    if (!response.ok) {
      throw new Error("Failed to create account entry");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
};

export const getAccounts = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch accounts");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
};
