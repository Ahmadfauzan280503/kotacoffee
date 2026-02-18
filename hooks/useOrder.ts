"use client";

import { addToast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import useChangeUrl from "./useChangeUrl";

import { TOrderInput } from "@/types/order";
import paymentService from "@/services/payment.service";
import orderService from "@/services/order.service";
import { orderSchema } from "@/schemas/order.schema";

const useOrder = () => {
  const [orderId, setOrderId] = useState("");
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("invoiceId");
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { search, page, limit } = useChangeUrl();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      address: "",
      paymentMethod: "",
    },
  });

  // create order / checkout
  const createOrderService = async (payload: TOrderInput) => {
    const res = await orderService.create(
      {
        shippingAddress: payload.address,
        paymentMethod: payload.paymentMethod,
        notes: "",
      } as any,
      session?.user?.token as string,
    );

    return res.data;
  };

  const { mutate: mutateCreateOrder, isPending: isPendingCreateOrder } =
    useMutation({
      mutationFn: createOrderService,
      onSuccess: () => {
        addToast({
          title: "Berhasil",
          description: "Pesanan berhasil dibuat!",
          color: "success",
        });
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        router.push("/profile/orders");
      },
      onError: (error) => {
        console.log(error);
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Gagal membuat pesanan";

        addToast({
          timeout: 30000,
          title: "Gagal",
          description: errorMessage,
          color: "danger",
        });
      },
    });

  const handleCreateOrder = (payload: TOrderInput) =>
    mutateCreateOrder(payload);

  // get order user
  const getOrderUserService = async () => {
    const queryParams = new URLSearchParams();

    if (search) queryParams.set("search", search);
    if (page) queryParams.set("page", String(page));
    if (limit) queryParams.set("limit", String(limit));
    const params = queryParams.toString();
    const res = await orderService.getOrderUser(
      session?.user?.token as string,
      params,
    );

    return res.data;
  };

  const { data: dataOrderUser, isLoading: isLoadingDataOrderUser } = useQuery({
    queryKey: ["order-user", search, page, limit],
    queryFn: getOrderUserService,
    enabled: !!session?.user?.token,
  });

  // get order seller
  const getOrderSellerService = async () => {
    const queryParams = new URLSearchParams();

    if (search) queryParams.set("search", search);
    if (page) queryParams.set("page", String(page));
    if (limit) queryParams.set("limit", String(limit));
    const params = queryParams.toString();
    const res = await orderService.getOrderSeller(
      session?.user?.token as string,
      params,
    );

    return res.data;
  };

  const { data: dataOrderSeller, isLoading: isLoadingDataOrderSeller } =
    useQuery({
      queryKey: ["order-seller", search, page, limit],
      queryFn: getOrderSellerService,
      enabled: !!session?.user?.token,
    });

  // get order by invoice id
  const getOrderByInvoiceIdService = async (invoiceId: string) => {
    const res = await orderService.getOrderByInvoiceId(
      invoiceId,
      session?.user?.token as string,
    );

    return res.data;
  };

  const {
    data: dataOrderByInvoiceId,
    isLoading: isLoadingDataOrderByInvoiceId,
  } = useQuery({
    queryKey: ["order-by-invoice-id", invoiceId],
    queryFn: () => getOrderByInvoiceIdService(invoiceId as string),
    enabled: !!invoiceId,
  });

  const getOrderByIdService = async () => {
    const res = await orderService.getOrderById(
      orderId,
      session?.user?.token as string,
    );

    return res.data;
  };

  const { data: dataOrderById, isLoading: isLoadingDataOrderById } = useQuery({
    queryKey: ["order-by-id", orderId],
    queryFn: getOrderByIdService,
    enabled: !!orderId,
  });

  const isProcessingService = async (id: string) => {
    const res = await orderService.isProcessing(
      id,
      session?.user?.token as string,
    );

    return res.data;
  };

  const { mutate: mutateIsProcessing, isPending: isPendingIsProcessing } =
    useMutation({
      mutationFn: (id: string) => isProcessingService(id),
      onSuccess: (order) => {
        queryClient.invalidateQueries({
          queryKey: ["order-seller"],
        });
        queryClient.invalidateQueries({
          queryKey: ["order-by-id", order?.data?.id],
        });
        addToast({
          title: "Berhasil",
          description: "Order berhasil diupdate",
          color: "success",
        });
      },
      onError: (error) => {
        console.log(error);
        addToast({
          title: "Gagal",
          description: "Gagal mengupdate order",
          color: "danger",
        });
      },
    });

  const isDeliveredService = async (id: string) => {
    const res = await orderService.isDelivered(
      id,
      session?.user?.token as string,
    );

    return res.data;
  };

  const { mutate: mutateIsDelivered, isPending: isPendingIsDelivered } =
    useMutation({
      mutationFn: (id: string) => isDeliveredService(id),
      onSuccess: (order) => {
        queryClient.invalidateQueries({
          queryKey: ["order-seller"],
        });
        queryClient.invalidateQueries({
          queryKey: ["order-by-id", order?.data?.id],
        });
        addToast({
          title: "Berhasil",
          description: "Order berhasil diupdate",
          color: "success",
        });
      },
      onError: (error) => {
        console.log(error);
        addToast({
          title: "Gagal",
          description: "Gagal mengupdate order",
          color: "danger",
        });
      },
    });

  const isCompletedService = async (id: string) => {
    const res = await orderService.isCompleted(
      id,
      session?.user?.token as string,
    );

    return res.data;
  };

  const { mutate: mutateIsCompleted, isPending: isPendingIsCompleted } =
    useMutation({
      mutationFn: (id: string) => isCompletedService(id),
      onSuccess: (order) => {
        queryClient.invalidateQueries({
          queryKey: ["order-seller"],
        });
        queryClient.invalidateQueries({
          queryKey: ["order-by-id", order?.data?.id],
        });
        addToast({
          title: "Berhasil",
          description: "Order berhasil diupdate",
          color: "success",
        });
      },
      onError: (error) => {
        console.log(error);
        addToast({
          title: "Gagal",
          description: "Gagal mengupdate order",
          color: "danger",
        });
      },
    });

  // get order admin
  const getOrderAdminService = async () => {
    const queryParams = new URLSearchParams();

    if (search) queryParams.set("search", search);
    if (page) queryParams.set("page", String(page));
    if (limit) queryParams.set("limit", String(limit));
    const params = queryParams.toString();
    const res = await orderService.getOrderAdmin(
      session?.user?.token as string,
      params,
    );

    return res.data;
  };

  const { data: dataOrderAdmin, isLoading: isLoadingDataOrderAdmin } = useQuery(
    {
      queryKey: ["order-admin", search, page, limit],
      queryFn: getOrderAdminService,
      enabled: !!session?.user?.token && session?.user?.role === "admin",
      refetchInterval: 5000, // Auto refresh every 5 seconds for admin dashboard
    },
  );

  // update order status (admin)
  const updateOrderStatusService = async ({
    id,
    status,
  }: {
    id: string;
    status: string;
  }) => {
    const res = await orderService.updateOrderStatus(
      id,
      status,
      session?.user?.token as string,
    );

    return res.data;
  };

  const {
    mutate: mutateUpdateOrderStatus,
    isPending: isPendingUpdateOrderStatus,
  } = useMutation({
    mutationFn: updateOrderStatusService,
    onSuccess: (order) => {
      queryClient.invalidateQueries({
        queryKey: ["order-admin"],
      });
      queryClient.invalidateQueries({
        queryKey: ["order-by-id", order?.data?.id],
      });
      addToast({
        title: "Berhasil",
        description: "Status order berhasil diperbarui",
        color: "success",
      });
    },
    onError: (error) => {
      console.log(error);
      addToast({
        title: "Gagal",
        description: "Gagal memperbarui status order",
        color: "danger",
      });
    },
  });

  // delete order (admin)
  const deleteOrderService = async (id: string) => {
    const res = await orderService.deleteOrder(
      id,
      session?.user?.token as string,
    );

    return res.data;
  };

  const { mutate: mutateDeleteOrder, isPending: isPendingDeleteOrder } =
    useMutation({
      mutationFn: deleteOrderService,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["order-admin"],
        });
        addToast({
          title: "Berhasil",
          description: "Order berhasil dihapus",
          color: "success",
        });
      },
      onError: (error) => {
        console.log(error);
        addToast({
          title: "Gagal",
          description: "Gagal menghapus order",
          color: "danger",
        });
      },
    });

  // Midtrans Payment
  const getMidtransTokenService = async (payload: {
    amount: number;
    orderId?: string;
    items?: any[];
  }) => {
    const res = await paymentService.getMidtransToken(
      payload,
      session?.user?.token as string,
    );

    return res.data;
  };

  const {
    mutateAsync: mutateGetMidtransToken,
    isPending: isPendingGetMidtransToken,
  } = useMutation({
    mutationFn: getMidtransTokenService,
    onError: (error) => {
      console.log(error);
      addToast({
        title: "Gagal",
        description: "Gagal memproses pembayaran",
        color: "danger",
      });
    },
  });

  return {
    // form
    control,
    handleSubmit,
    setValue,
    errors,
    // create order
    handleCreateOrder,
    isPendingCreateOrder,
    // get order user
    dataOrderUser,
    isLoadingDataOrderUser,
    // get order seller
    dataOrderSeller,
    isLoadingDataOrderSeller,
    // get order by invoice id
    dataOrderByInvoiceId,
    isLoadingDataOrderByInvoiceId,
    // get order by id
    dataOrderById,
    isLoadingDataOrderById,
    // order id state
    orderId,
    setOrderId,
    // update order
    mutateIsProcessing,
    isPendingIsProcessing,
    mutateIsDelivered,
    isPendingIsDelivered,
    mutateIsCompleted,
    isPendingIsCompleted,
    // admin only
    dataOrderAdmin,
    isLoadingDataOrderAdmin,
    mutateUpdateOrderStatus,
    isPendingUpdateOrderStatus,
    mutateDeleteOrder,
    isPendingDeleteOrder,
    watch,
    mutateGetMidtransToken,
    isPendingGetMidtransToken,
  };
};

export default useOrder;
