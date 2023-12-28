import { Action } from "./config";

export const commentofblog = async(id,page,limit)=>{
    
    const data = await Action.get(`/blog/findcomment/${id}?page=${page}&limit=${limit}`);
    return data.data;
}