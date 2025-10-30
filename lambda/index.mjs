export const handler = async (event) => {
  const notes = [
    { id: 1, text: "Buy groceries" },
    { id: 2, text: "Finish coding assignment" }
  ];

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(notes),
  };
};
