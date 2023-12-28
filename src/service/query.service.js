import { Action } from './config';

export const getquery= async (page,limit)=>{
  const data = await Action.get(`/qu/all/query?page=${page}&limit=${limit}`);
  return data.data;
}
export const sendToAllNotification = async (body) => {
  const data = await Action.post(`/admin/sendNotification`, body);

  return data.data;
};
