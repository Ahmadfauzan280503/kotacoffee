"use client";

import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@heroui/react";
import { Key, useCallback } from "react";
import {
  FiBox,
  FiCheck,
  FiClock,
  FiCreditCard,
  FiEye,
  FiMoreVertical,
  FiTrash2,
  FiTruck,
  FiX,
} from "react-icons/fi";

import DataTable from "@/components/data-table";
import useOrder from "@/hooks/useOrder";
import { rupiahFormat } from "@/utils/rupiahFormat";
import { formatDate } from "@/utils/dateFormat";
import ModalOrderDetail from "@/components/page/dashboard/modal-order-detail";

const columns = [
  { name: "ID PESANAN", uid: "orderId" },
  { name: "PELANGGAN", uid: "customer" },
  { name: "TOTAL HARGA", uid: "totalPrice" },
  { name: "STATUS", uid: "status" },
  { name: "TANGGAL", uid: "createdAt" },
  { name: "AKSI", uid: "actions" },
];

const AdminOrder = () => {
  const {
    dataOrderAdmin,
    isLoadingDataOrderAdmin,
    setOrderId,
    dataOrderById,
    isLoadingDataOrderById,
    mutateUpdateOrderStatus,
    mutateDeleteOrder,
    isPendingDeleteOrder,
  } = useOrder();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const renderCell = useCallback(
    (order: any, columnKey: Key) => {
      switch (columnKey) {
        case "orderId":
          return <p className="font-medium">#{order?.id?.slice(0, 8)}</p>;
        case "customer":
          return (
            <div>
              <p className="font-semibold">{order?.user?.name}</p>
              <p className="text-foreground-500 text-xs">
                {order?.user?.email}
              </p>
            </div>
          );
        case "totalPrice":
          return rupiahFormat(order?.totalPrice || order?.total_amount || 0);
        case "status":
          const status = order?.status?.toUpperCase();

          return (
            <Chip
              color={
                status === "PENDING"
                  ? "warning"
                  : status === "PAID"
                    ? "success"
                    : status === "FAILED"
                      ? "danger"
                      : status === "CANCELLED"
                        ? "danger"
                        : status === "PROCESSING"
                          ? "secondary"
                          : status === "SHIPPED"
                            ? "primary"
                            : status === "DELIVERED"
                              ? "success"
                              : status === "COMPLETED"
                                ? "success"
                                : "danger"
              }
              size="sm"
              startContent={
                status === "PENDING" ? (
                  <FiClock />
                ) : status === "PAID" ? (
                  <FiCreditCard />
                ) : status === "FAILED" ? (
                  <FiX />
                ) : status === "PROCESSING" ? (
                  <FiBox />
                ) : status === "SHIPPED" ? (
                  <FiTruck />
                ) : status === "DELIVERED" ? (
                  <FiCheck />
                ) : status === "COMPLETED" ? (
                  <FiCheck />
                ) : status === "CANCELLED" ? (
                  <FiX />
                ) : null
              }
              variant="bordered"
            >
              {status === "PENDING" && "Pending"}
              {status === "PAID" && "Dibayar"}
              {status === "FAILED" && "Gagal"}
              {status === "CANCELLED" && "Dibatalkan"}
              {status === "PROCESSING" && "Diproses"}
              {status === "SHIPPED" && "Dikirim"}
              {status === "DELIVERED" && "Diterima"}
              {status === "COMPLETED" && "Selesai"}
            </Chip>
          );
        case "createdAt":
          return formatDate(order?.created_at);
        case "actions":
          return (
            <div className="flex items-center gap-1 justify-center">
              <Button
                isIconOnly
                className="min-w-unit-8 w-8 h-8"
                color="primary"
                size="sm"
                variant="flat"
                onPress={() => {
                  onOpen();
                  setOrderId(order?.id);
                }}
              >
                <FiEye size={16} />
              </Button>
              {["CANCELLED", "COMPLETED", "FAILED"].includes(
                (order.status as string)?.toUpperCase(),
              ) && (
                <Button
                  isIconOnly
                  className="min-w-unit-8 w-8 h-8"
                  color="danger"
                  isLoading={isPendingDeleteOrder}
                  size="sm"
                  variant="flat"
                  onPress={() => {
                    if (
                      confirm("Apakah Anda yakin ingin menghapus pesanan ini?")
                    ) {
                      mutateDeleteOrder(order?.id);
                    }
                  }}
                >
                  <FiTrash2 size={16} />
                </Button>
              )}
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    className="min-w-unit-8 w-8 h-8"
                    size="sm"
                    variant="flat"
                  >
                    <FiMoreVertical size={16} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Update Status"
                  variant="flat"
                  onAction={(key) =>
                    mutateUpdateOrderStatus({
                      id: order.id,
                      status: key as string,
                    })
                  }
                >
                  <DropdownItem
                    key="processing"
                    startContent={<FiBox className="text-secondary" />}
                  >
                    Set Diproses
                  </DropdownItem>
                  <DropdownItem
                    key="delivered"
                    startContent={<FiTruck className="text-primary" />}
                  >
                    Set Dikirim
                  </DropdownItem>
                  <DropdownItem
                    key="completed"
                    startContent={<FiCheck className="text-success" />}
                  >
                    Set Diterima
                  </DropdownItem>
                  <DropdownItem
                    key="cancelled"
                    color="danger"
                    startContent={<FiX className="text-danger" />}
                  >
                    Batalkan
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return order[columnKey as string];
      }
    },
    [onOpen, setOrderId, mutateUpdateOrderStatus],
  );

  return (
    <>
      <ModalOrderDetail
        isLoading={isLoadingDataOrderById}
        isOpen={isOpen}
        order={dataOrderById?.data}
        type="admin"
        onClose={() => {
          onClose();
          setOrderId("");
        }}
      />
      <DataTable
        columns={columns}
        currentPage={dataOrderAdmin?.data?.pagination?.page}
        data={dataOrderAdmin?.data?.orders || []}
        description="Pantau dan kelola seluruh pesanan pelanggan dalam sistem"
        emptyContent="Belum ada pesanan masuk"
        isLoading={isLoadingDataOrderAdmin}
        renderCell={renderCell as any}
        title="Kelola Semua Pesanan"
        totalPage={dataOrderAdmin?.data?.pagination?.totalPages}
      />
    </>
  );
};

export default AdminOrder;
