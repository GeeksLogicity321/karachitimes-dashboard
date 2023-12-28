import { Action } from './config';

export const AdminLogin = async (body) => {
  const data = await Action.post('/user/login', body);


  return data.data;
};
export const getUsers = async (page,limit) => {
  const data = await Action.get(`/user/find/user?page=${page}&limit=${limit}`);

  return data.data;
};
export const deleteUser = async (id) => {

  const data = await Action.delete(`/user/delete/user/${id}`);

  return data.data;
};

export const updateUser = async (id,payload) => {

  const data = await Action.put(`/user/update/${id}`,payload);

  return data.data;
};

export const getTerms = async () => {
  const data = await Action.get(`/admin/terms`);
  return data.data.data;
};

export const getPrivacy = async () => {
  const data = await Action.get(`/admin/privacy`);
  return data.data.data;
};
export const updateTerms = async (id, payload) => {
  const data = await Action.put(`/admin/terms/${id}`, payload);
  return data.data;
};

export const updatePrivacy = async (id, payload) => {
  const data = await Action.put(`/admin/privacy/${id}`, payload);
  return data.data;
};
export const getdashboard = async () => {
  const data = await Action.get(`/admin/dashboard`);

  return data.data;
};

export const Serviceadd= async(payload)=>{
  const data = await Action.post("admin/service", payload)
  return data.data;
}
export const getService = async () => {
  const data = await Action.get(`/service`);

  return data.data;
}
export const deleteService = async (id) => {
  
  const data = await Action.delete(`admin/service/${id}`)
  return data.data;
}
export const Serviceupdate = async (id,payload)=>{
  const data = await Action.put(`admin/service/${id}`, payload)
  return data.data;
}