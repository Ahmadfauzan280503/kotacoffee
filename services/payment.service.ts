import endpoint from "./endpoint";

import instance from "@/lib/axios";

export default {
  getMidtransToken: (
    payload: { orderId?: string; amount: number; items?: any[] },
    token: string,
  ) =>
    instance.post(`${endpoint.PAYMENT}/midtrans/token`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
