import { Action } from "./config";

export const getCategory = async (page) => {
    const data = await Action.get(`/blog/all/category?page=${page}`);
    return data.data;
  };

  export const Categoryeupdate = async (id,payload)=>{
    const data = await Action.put(`/blog/update/category/${id}`, payload)
    return data.data;
  }
  export const Categoryeadd = async (payload)=>{
    const data = await Action.post(`/blog/create/category`, payload)
    return data.data;
  }

  export const Categorydelete = async (id)=>{
    const data = await Action.delete(`/blog/delete/category/${id}`)
    return data.data;
  }

 