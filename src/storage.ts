export const getData = () => {
  const storage = localStorage.getItem("pluginStorage");
  if (!storage) return {}

  return JSON.parse(storage);
};

export const updateData = async (data: Record<string, any>) => {
  const storage = getData();
  const newStorage = { ...storage, ...data };

  localStorage.setItem("pluginStorage", JSON.stringify(newStorage));
  return newStorage;
};
