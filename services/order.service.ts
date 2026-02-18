import endpoint from "./endpoint";

import instance from "@/lib/axios";
import { TOrderInput } from "@/types/order";

export default {
  create: (payload: TOrderInput, token: string) =>
    instance.post(endpoint.ORDER, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getOrderUser: (token: string, params: string) =>
    instance.get(`${endpoint.ORDER}/user?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getOrderSeller: (token: string, params: string) =>
    instance.get(`${endpoint.ORDER}/seller?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getOrderById: (id: string, token: string) =>
    instance.get(`${endpoint.ORDER}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getOrderByInvoiceId: (invoiceId: string, token: string) =>
    instance.get(`${endpoint.ORDER}/invoice/${invoiceId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  isProcessing: (id: string, token: string) =>
    instance.put(`${endpoint.ORDER}/process/${id}`, undefined, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  isDelivered: (id: string, token: string) =>
    instance.put(`${endpoint.ORDER}/delivered/${id}`, undefined, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  isCompleted: (id: string, token: string) =>
    instance.put(`${endpoint.ORDER}/completed/${id}`, undefined, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getOrderAdmin: (token: string, params: string) =>
    instance.get(`${endpoint.ORDER}/admin?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  updateOrderStatus: (id: string, status: string, token: string) =>
    instance.put(
      `${endpoint.ORDER}/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ),
  deleteOrder: (id: string, token: string) =>
    instance.delete(`${endpoint.ORDER}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
