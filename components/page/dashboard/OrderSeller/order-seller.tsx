"use client";

import { Key, useCallback, useEffect } from "react";
import { Button, Chip, useDisclosure } from "@heroui/react";
import {
  FiBox,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiEye,
  FiTruck,
  FiX,
} from "react-icons/fi";

import ModalOrderDetail from "../modal-order-detail";

import { columns } from "./columns";

import DataTable from "@/components/data-table";
import useOrder from "@/hooks/useOrder";
import { rupiahFormat } from "@/utils/rupiahFormat";
import { formatDate } from "@/utils/dateFormat";
import useChangeUrl from "@/hooks/useChangeUrl";

const OrderSeller = () => {
  const {
    dataOrderSeller,
    isLoadingDataOrderSeller,
    dataOrderById,
    isLoadingDataOrderById,
    mutateIsCompleted,
    isPendingIsCompleted,
    setOrderId,
  } = useOrder();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { setUrl } = useChangeUrl();

  useEffect(() => {
    setUrl();
  }, []);

  const renderCell = useCallback(
    (order: Record<string, unknown>, columnKey: Key) => {
      const cellValue = order[columnKey as string];

      switch (columnKey) {
        case "orderId":
          return <p className="font-medium">{cellValue as string}</p>;
        case "user":
          return (
            <div>
              <p className="font-semibold">
                {(cellValue as { name: string })?.name}
              </p>
              <p className="text-foreground-500 text-sm">
                {(cellValue as { email: string })?.email}
              </p>
              <p className="text-foreground-500 text-sm">
                {(cellValue as { phone: string })?.phone}
              </p>
            </div>
          );
        case "totalPrice":
          return rupiahFormat(cellValue as number);
        case "status":
          return (
            <Chip
              color={
                cellValue === "PENDING"
                  ? "warning"
                  : cellValue === "PAID"
                    ? "success"
                    : cellValue === "FAILED"
                      ? "danger"
                      : cellValue == "PROCESSING"
                        ? "secondary"
                        : cellValue == "DELIVERED"
                          ? "primary"
                          : cellValue === "COMPLETED"
                            ? "default"
                            : "danger"
              }
              size="sm"
              startContent={
                cellValue === "PENDING" ? (
                  <FiClock />
                ) : cellValue === "PAID" ? (
                  <FiCreditCard />
                ) : cellValue === "FAILED" ? (
                  <FiX />
                ) : cellValue === "PROCESSING" ? (
                  <FiBox />
                ) : cellValue === "DELIVERED" ? (
                  <FiTruck />
                ) : cellValue === "COMPLETED" ? (
                  <FiCheck />
                ) : null
              }
              variant="bordered"
            >
              {cellValue === "PENDING" && "Pending"}
              {cellValue === "PAID" && "Dibayar"}
              {cellValue === "FAILED" && "Gagal"}
              {cellValue === "PROCESSING" && "Diproses"}
              {cellValue === "DELIVERED" && "Dikirim"}
              {cellValue === "COMPLETED" && "Diterima"}
            </Chip>
          );
        case "createdAt":
          return formatDate(cellValue as string);
        case "actions":
          return (
            <div>
              <Button
                isIconOnly
                color="primary"
                size="sm"
                variant="light"
                onPress={() => {
                  onOpen();
                  setOrderId(order?.id as string);
                }}
              >
                <FiEye />
              </Button>
              {order?.status !== "PENDING" && order.status !== "COMPLETED" ? (
                <Button
                  isIconOnly
                  color="success"
                  isDisabled={isPendingIsCompleted}
                  isLoading={isPendingIsCompleted}
                  size="sm"
                  variant="light"
                  onPress={() => {
                    mutateIsCompleted(order?.id as string);
                  }}
                >
                  <FiCheckCircle />
                </Button>
              ) : null}
            </div>
          );
        default:
          return cellValue;
      }
    },
    [],
  );

  const handleOnClose = () => {
    onClose();
    setOrderId("");
  };

  return (
    <>
      <ModalOrderDetail
        isLoading={isLoadingDataOrderById}
        isOpen={isOpen}
        order={dataOrderById?.data || {}}
        type="seller"
        onClose={handleOnClose}
      />
      <DataTable
        columns={columns}
        currentPage={dataOrderSeller?.data?.currentPage}
        data={dataOrderSeller?.data?.orders || []}
        description="Kelola pesanan lapak Anda"
        emptyContent="Tidak ada pesanan"
        isLoading={isLoadingDataOrderSeller}
        renderCell={renderCell as any}
        title="Kelola Pesanan"
        totalPage={dataOrderSeller?.data?.totalPage}
      />
    </>
  );
};

export default OrderSeller;
