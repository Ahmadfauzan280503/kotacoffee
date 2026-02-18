import endpoint from "./endpoint";

import instance from "@/lib/axios";

export default {
  upload: (payload: FormData, token: string) =>
    instance.post(`${endpoint.MEDIA}/upload`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  remove: (fileUrl: string, token: string) =>
    instance.delete(`${endpoint.MEDIA}/delete`, {
      data: {
        fileUrl,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
