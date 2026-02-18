"use client";

import {
  Button,
  Chip,
  useDisclosure,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Pagination,
  Spinner,
  Divider,
} from "@heroui/react";
import { useState } from "react";
import {
  FiBox,
  FiCheck,
  FiClock,
  FiCreditCard,
  FiEye,
  FiSearch,
  FiTruck,
  FiX,
} from "react-icons/fi";

import ModalOrderDetail from "../modal-order-detail";

import { formatDate } from "@/utils/dateFormat";
import { rupiahFormat } from "@/utils/rupiahFormat";
import useOrder from "@/hooks/useOrder";
import useChangeUrl from "@/hooks/useChangeUrl";

const OrderUser = () => {
  const {
    dataOrderUser,
    isLoadingDataOrderUser,
    setOrderId,
    dataOrderById,
    isLoadingDataOrderById,
  } = useOrder();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    handleChangeSearch,
    handleChangePage,
    search: urlSearch,
    page: urlPage,
  } = useChangeUrl();
  const [searchValue, setSearchValue] = useState(urlSearch || "");

  const handleOnClose = () => {
    onClose();
    setOrderId("");
  };

  const getStatusConfig = (statusRaw: string) => {
    const status = statusRaw?.toUpperCase();

    switch (status) {
      case "PENDING":
        return { color: "warning", label: "Pending", icon: <FiClock /> };
      case "PAID":
        return { color: "success", label: "Dibayar", icon: <FiCreditCard /> };
      case "FAILED":
        return { color: "danger", label: "Gagal", icon: <FiX /> };
      case "CANCELLED":
        return { color: "danger", label: "Dibatalkan", icon: <FiX /> };
      case "PROCESSING":
        return { color: "secondary", label: "Diproses", icon: <FiBox /> };
      case "SHIPPED":
        return { color: "primary", label: "Dikirim", icon: <FiTruck /> };
      case "DELIVERED":
        return { color: "success", label: "Diterima", icon: <FiCheck /> };
      case "COMPLETED":
        return { color: "success", label: "Selesai", icon: <FiCheck /> };
      default:
        return { color: "default", label: status || "Unknown", icon: <FiX /> };
    }
  };

  const orders = dataOrderUser?.data?.orders || [];
  const totalPage = dataOrderUser?.data?.pagination?.totalPages || 0;
  const currentPage = dataOrderUser?.data?.pagination?.page || 1;

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pesanan Saya</h1>
          <p className="text-foreground-500">
            Kelola dan pantau riwayat belanja Anda
          </p>
        </div>
        <div className="w-full md:w-72">
          <Input
            isClearable
            className="w-full"
            placeholder="Cari Order ID..."
            radius="lg"
            startContent={<FiSearch className="text-foreground-400" />}
            value={searchValue}
            variant="bordered"
            onChange={(e) => {
              setSearchValue(e.target.value);
              handleChangeSearch(e);
            }}
            onClear={() => {
              setSearchValue("");
              handleChangeSearch({ target: { value: "" } } as any);
            }}
          />
        </div>
      </div>

      <ModalOrderDetail
        isLoading={isLoadingDataOrderById}
        isOpen={isOpen}
        order={dataOrderById?.data || {}}
        type="user"
        onClose={handleOnClose}
      />

      {isLoadingDataOrderUser ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
          <Spinner color="success" size="lg" />
          <p className="text-foreground-500 animate-pulse">
            Memuat data pesanan...
          </p>
        </div>
      ) : orders.length === 0 ? (
        <Card
          className="min-h-[300px] flex items-center justify-center border-dashed border-2"
          shadow="none"
        >
          <CardBody className="flex flex-col items-center gap-4">
            <div className="p-6 bg-foreground-100 rounded-full">
              <FiBox className="text-foreground-300" size={48} />
            </div>
            <div className="text-center">
              <p className="font-semibold text-lg">Belum Ada Pesanan</p>
              <p className="text-foreground-500 max-w-xs">
                Anda belum melakukan transaksi apapun. Mari mulai berbelanja!
              </p>
            </div>
            <Button className="font-semibold" color="success" radius="full">
              Belanja Sekarang
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order: any) => {
            const statusCfg = getStatusConfig(order.status);

            return (
              <Card
                key={order.id}
                className="hover:border-success transition-all border border-transparent"
                shadow="sm"
              >
                <CardHeader className="flex justify-between items-center border-b border-divider px-6 py-4">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-mono text-foreground-500">
                      #{order.id.slice(0, 8)}
                    </p>
                    <Divider className="h-4" orientation="vertical" />
                    <p className="text-xs text-foreground-500">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <Chip
                    className="font-semibold"
                    color={statusCfg.color as any}
                    size="sm"
                    startContent={statusCfg.icon}
                    variant="flat"
                  >
                    {statusCfg.label}
                  </Chip>
                </CardHeader>
                <CardBody className="px-6 py-4">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex gap-4 items-start">
                      <div className="p-2 bg-success-50 rounded-lg">
                        <FiBox className="text-success" size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-lg">
                          {order.seller?.shop_name || "Kota Coffee Store"}
                        </p>
                        <p className="text-sm text-foreground-500">
                          {order.items?.length || 0} Produk
                        </p>
                        {order.items?.[0] && (
                          <div className="mt-2 flex items-center gap-2">
                            <p className="text-sm italic text-foreground-400">
                              "{order.items[0].product?.name}"{" "}
                              {order.items.length > 1
                                ? `& ${order.items.length - 1} produk lainnya`
                                : ""}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-center">
                      <p className="text-foreground-500 text-sm">
                        Total Belanja
                      </p>
                      <p className="text-xl font-black text-success">
                        {rupiahFormat(
                          order.total_amount || order.totalPrice || 0,
                        )}
                      </p>
                    </div>
                  </div>
                </CardBody>
                <CardFooter className="px-6 py-3 bg-foreground-50/50 justify-end gap-2">
                  <Button
                    className="font-semibold"
                    color="primary"
                    radius="full"
                    size="sm"
                    startContent={<FiEye />}
                    variant="flat"
                    onPress={() => {
                      onOpen();
                      setOrderId(order.id);
                    }}
                  >
                    Lihat Detail
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {totalPage > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            showControls
            color="success"
            page={currentPage}
            radius="full"
            total={totalPage}
            variant="flat"
            onChange={(page) => handleChangePage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default OrderUser;
