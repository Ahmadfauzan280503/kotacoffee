import endpoint from "./endpoint";

import instance from "@/lib/axios";

export default {
  create: (token: string) =>
    instance.post(endpoint.WALLET, undefined, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getBalance: (token: string) =>
    instance.get(`${endpoint.WALLET}/balance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
