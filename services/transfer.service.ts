import endpoint from "./endpoint";

import instance from "@/lib/axios";
import { ITransfer } from "@/types/transfer";

export default {
  createTransfer: (payload: ITransfer, token: string) =>
    instance.post(endpoint.TRANSFER, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
