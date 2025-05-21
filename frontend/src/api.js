const API_BASE = "http://localhost:8080";

export const getClusterStatus = async () => {
  const response = await fetch(`${API_BASE}/status`);
  return await response.json();
};

export const getTables = async () => {
  const response = await fetch(`${API_BASE}/tables`);
  return await response.json();
};

export const createTable = async (tableName) => {
  const response = await fetch(`${API_BASE}/tables`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: tableName }),
  });

  return await response.json();
};

export const getTableData = async (tableName) => {
    const response = await fetch(`${API_BASE}/tables/${tableName}`)
    return await response.json()
}

export const insertRecord = async (tableName, record) => {
    const response = await fetch(`${API_BASE}/tables/${tableName}`, {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify(record),
    })

    return await response.json()
}