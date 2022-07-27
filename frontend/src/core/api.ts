import api from "./axios";

export const register = async (email: any, username: any, password: any) => {
  const { data } = await api.post("/auth/sign-up", { email, username, password });
  return data;
};

export const login = async (email: string, password: string) => {
  const { data } = await api.post("/auth/sign-in", { email, password });
  return data;
};

export const fetchPosts = async () => {
  const { data } = await api.get("/posts");
  return data;
};

export const fetchAddPost = async (formData: any) => {
  const { data } = await api.post("/posts", formData, { headers: { "content-type": "multipart/form-data" } });
  return data;
};


export const fetchLogout = async () => {
  return await api.post("/auth/logout");
};

export const fetchDeletePost = async (id: number) => {
  return await api.delete(`/posts/${id}`);
};

export const fetchEditPost = async (formData: any, id: number) => {
  const { data } = await api.put(`/posts/${id}`, formData, { headers: { "content-type": "multipart/form-data" } });
  return data;
};
