
export const createAuthHeaders = (token: string) => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };
  