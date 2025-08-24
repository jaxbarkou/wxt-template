import request, { base6Api } from "../request";

export const getChatHistory = async (user_id: string) => {
  return request<string>(base6Api, {
    url: `/v1/chat/threads/${user_id}`,
    method: 'GET',
    params: {
      offset: 0,
      limit: 10,
    }
  });
};