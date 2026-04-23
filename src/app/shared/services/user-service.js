const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
};

export const getUsers = async (signal) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}users`, {
    method: "GET",
    headers: getAuthHeaders(),
    signal
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
};

export const getUserById = async (id, signal) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}users/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
    signal
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
};

export const updateUser = async (id, data, signal) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}users/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    signal
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
};

export const deleteUser = async (id, signal) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}users/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    signal
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
};