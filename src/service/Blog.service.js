import { Action } from "./config";

export const createBlog=async(id,payload)=>{
  if(id){
    console.log(id)
    const data = await Action.put(`/blog/update/blog/${id}`,payload);
    return data.data;
  }

  
  const data = await Action.post(`/blog/create/blog`,payload);
  return data.data;
}
export const getBlog=async(page,limit)=>{
  const data = await Action.get(`/blog/all/blogs?page=${page}&limit=${limit}`);
  return data.data;
}
export const getBlogById=async(id)=>{
  const data = await Action.get(`/blog/one/blogs/${id}`);
  
  return data.data;
}
export const updateBlog=async(id,payload)=>{
  const data = await Action.get(`/blog/update/blog/${id}`,payload);
  return data.data;
}
export const deleteBlog=async(id)=>{
  const data = await Action.delete(`/blog/delete/blog/${id}`);
  return data.data;
}

  