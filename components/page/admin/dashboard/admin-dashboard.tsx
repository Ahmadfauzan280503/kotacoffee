"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Skeleton,
  Spinner,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import {
  FiAlertCircle,
  FiBox,
  FiCheck,
  FiClock,
  FiCreditCard,
  FiEye,
  FiShoppingCart,
  FiTruck,
  FiX,
} from "react-icons/fi";
import { MdAttachMoney, MdCategory, MdStore } from "react-icons/md";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import ModalSeller from "./seller/modal-seller";
import ModalDetail from "./wallet-transaction/modal-detail";

import useCategory from "@/hooks/useCategory";
import useProduct from "@/hooks/useProduct";
import useSeller from "@/hooks/useSeller";
import useWallet from "@/hooks/useWallet";
import useWalletTransaction from "@/hooks/useWalletTransaction";
import { TSeller } from "@/types/seller";
import { IWalletTransaction } from "@/types/wallet-transaction";
import useChangeUrl from "@/hooks/useChangeUrl";
import { rupiahFormat } from "@/utils/rupiahFormat";
import useOrder from "@/hooks/useOrder";

const AdminDashboard = () => {
  const { dataCategories, isLoadingCategories } = useCategory();
  const { dataProducts, isLoadingProducts } = useProduct();
  const { dataAllSeller, setSellerId, dataSellerById, isLoadingAllSeller } =
    useSeller();
  const { dataBalance, isLoadingBalance } = useWallet();
  const {
    dataAllWalletTransactions,
    isLoadingDataAllWalletTransaction,
    setSelectedId,
    dataWalletTransactionById,
  } = useWalletTransaction();
  const { dataOrderAdmin, isLoadingDataOrderAdmin } = useOrder();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const {
    isOpen: isOpenDetail,
    onOpen: onOpenDetail,
    onClose: onCloseDetail,
  } = useDisclosure();

  const handleOnClose = () => {
    onClose();
    setSellerId(null);
  };

  const { setUrl } = useChangeUrl();

  useEffect(() => {
    setUrl();
  }, []);

  return (
    <div className="space-y-4 p-4">
      <ModalDetail
        isOpen={isOpenDetail}
        walletTransaction={dataWalletTransactionById?.data}
        onClose={onCloseDetail}
      />

      <ModalSeller
        isOpen={isOpen}
        seller={dataSellerById?.data}
        onClose={handleOnClose}
      />

      {/* Header */}
      <div className="flex flex-col mb-8">
        <h2 className="text-xl font-bold">Dashboard Overview</h2>
        <p className="text-xs text-gray-500">
          Ringkasan performa toko Anda hari ini
        </p>
      </div>

      {/* Revenue */}
      <div>
        <Card className="w-full lg:w-fit">
          <CardHeader className="flex items-center justify-center lg:justify-start">
            Total Pendapatan
          </CardHeader>
          <CardBody>
            <div className="flex items-center justify-center lg:justify-between flex-col-reverse lg:flex-row gap-2 lg:gap-4">
              <Skeleton className="rounded-md" isLoaded={!isLoadingBalance}>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-200 mt-1 text-center lg:text-start">
                  {rupiahFormat(dataBalance?.data?.balance)}
                </p>
              </Skeleton>
              <div
                className={`w-12 h-12 bg-success rounded-lg flex items-center justify-center`}
              >
                <MdAttachMoney className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Categories */}
        <Card className="w-full">
          <CardHeader className="flex items-center justify-center lg:justify-start">
            Total Kategori
          </CardHeader>
          <CardBody>
            <div className="flex items-center justify-center lg:justify-between flex-col-reverse lg:flex-row gap-2 lg:gap-4">
              <Skeleton
                className="rounded-md w-24 h-9"
                isLoaded={!isLoadingCategories}
              >
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-200 mt-1 text-center lg:text-start">
                  {dataCategories?.total}
                </p>
              </Skeleton>
              <div
                className={`w-12 h-12 bg-warning rounded-lg flex items-center justify-center`}
              >
                <MdCategory className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Products */}
        <Card className="w-full">
          <CardHeader className="flex items-center justify-center lg:justify-start">
            Total Produk
          </CardHeader>
          <CardBody>
            <div className="flex items-center justify-center lg:justify-between flex-col-reverse lg:flex-row gap-2 lg:gap-4">
              <Skeleton
                className="rounded-md w-24 h-9"
                isLoaded={!isLoadingProducts}
              >
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-200 mt-1 text-center lg:text-start">
                  {dataProducts?.data?.total}
                </p>
              </Skeleton>
              <div
                className={`w-12 h-12 bg-primary rounded-lg flex items-center justify-center`}
              >
                <FiBox className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Sellers */}
        <Card className="w-full">
          <CardHeader className="flex items-center justify-center lg:justify-start">
            Total Penjual
          </CardHeader>
          <CardBody>
            <div className="flex items-center justify-center lg:justify-between flex-col-reverse lg:flex-row gap-2 lg:gap-4">
              <Skeleton
                className="rounded-md w-24 h-9"
                isLoaded={!isLoadingAllSeller}
              >
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-200 mt-1 text-center lg:text-start">
                  {dataAllSeller?.data?.sellers?.length}
                </p>
              </Skeleton>
              <div
                className={`w-12 h-12 bg-secondary rounded-lg flex items-center justify-center`}
              >
                <MdStore className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Orders */}
        <Card className="w-full">
          <CardHeader className="flex items-center justify-center lg:justify-start">
            Total Pesanan
          </CardHeader>
          <CardBody>
            <div className="flex items-center justify-center lg:justify-between flex-col-reverse lg:flex-row gap-2 lg:gap-4">
              <Skeleton
                className="rounded-md w-24 h-9"
                isLoaded={!isLoadingDataOrderAdmin}
              >
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-200 mt-1 text-center lg:text-start">
                  {dataOrderAdmin?.data?.pagination?.total || 0}
                </p>
              </Skeleton>
              <div
                className={`w-12 h-12 bg-success rounded-lg flex items-center justify-center`}
              >
                <FiShoppingCart className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Allert */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Seller */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
              Penjual yang belum verifikasi
            </h3>
            <FiAlertCircle className="w-5 h-5 text-orange-500" />
          </CardHeader>
          <CardBody className="relative min-h-[calc(100vh-500px)]">
            {isLoadingAllSeller ? (
              <div className="flex items-center justify-center absolute inset-0 z-50 bg-black/10 backdrop-blur-sm">
                <Spinner color="success" />
              </div>
            ) : null}
            {dataAllSeller?.data?.sellers
              ?.filter((seller: any) => seller?.verified !== true)
              .map((seller: TSeller) => (
                <div key={seller?.id} className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3 dark:text-gray-200">
                      <img
                        alt={seller?.storeName}
                        className="w-10 h-10 rounded-lg object-cover"
                        src={`https://ui-avatars.com/api/?name=${seller?.storeName}&background=random`}
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-200">
                          {seller?.storeName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-200">
                          {seller?.user?.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Tooltip color="primary" content="Detail Penjual">
                        <Button
                          isIconOnly
                          className="cursor-pointer active:opacity-50"
                          color="primary"
                          size="sm"
                          variant="light"
                          onPress={() => {
                            setSellerId(seller?.id as string);
                            onOpen();
                          }}
                        >
                          <FiEye />
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              ))}

            {dataAllSeller?.data?.sellers?.filter(
              (seller: any) => seller?.verified !== true,
            ).length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Semua penjual sudah terverifikasi
                </p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Wallet Transaction */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
              Transaksi Wallet
            </h3>
            <Chip
              color="warning"
              size="sm"
              startContent={<FiClock />}
              variant="bordered"
            >
              pending
            </Chip>
          </CardHeader>
          <CardBody className="relative min-h-[calc(100vh-500px)]">
            {isLoadingDataAllWalletTransaction ? (
              <div className="flex items-center justify-center absolute inset-0 z-50 bg-black/10 backdrop-blur-sm">
                <Spinner color="success" />
              </div>
            ) : null}
            {dataAllWalletTransactions?.data?.walletTransaction
              ?.filter(
                (transaction: IWalletTransaction) =>
                  transaction?.status === "pending",
              )
              .map((transaction: IWalletTransaction) => (
                <div
                  key={transaction?.id}
                  className="flex items-center justify-between mb-3 bg-warning-200/20 p-2 rounded-sm"
                >
                  <div>
                    <p className="uppercase dark:text-gray-200">
                      {transaction?.wallet?.seller?.bankName}
                    </p>
                    <p className="uppercase dark:text-gray-200">
                      {transaction?.wallet?.seller?.accountName}
                    </p>
                    <p>{transaction?.wallet?.seller?.accountNumber}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="font-semibold">
                      {rupiahFormat(transaction?.amount)}
                    </p>
                    <Tooltip color="primary" content="Ubah produk">
                      <Button
                        isIconOnly
                        className="cursor-pointer active:opacity-50"
                        color="primary"
                        size="sm"
                        variant="light"
                        onPress={() => {
                          onOpenDetail();
                          setSelectedId(transaction?.id as string);
                        }}
                      >
                        <FiEye />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              ))}

            {dataAllWalletTransactions?.data?.walletTransaction?.filter(
              (transaction: IWalletTransaction) =>
                transaction?.status === "pending",
            ).length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Semua transaksi wallet sudah selesai
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Latest Orders */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Pesanan Terbaru (Seluruh Sistem)
          </h3>
          <Button
            color="success"
            variant="light"
            onPress={() => router.push("/admin/dashboard/order")}
          >
            Lihat Semua
          </Button>
        </CardHeader>
        <CardBody>
          {isLoadingDataOrderAdmin &&
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                className="mb-2 h-12 w-full rounded-md"
                isLoaded={false}
              />
            ))}
          {dataOrderAdmin?.data?.orders?.slice(0, 5).map((order: any) => (
            <div key={order?.id} className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors rounded-lg px-2">
                <div className="flex items-center space-x-3 dark:text-white">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success font-bold">
                    {order?.user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {order?.user?.name}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">
                      #{order?.id?.slice(0, 8)} •{" "}
                      {new Date(order?.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="font-black text-gray-900 dark:text-white">
                    {rupiahFormat(order?.total_amount)}
                  </p>
                  <Chip
                    className="capitalize font-bold border-none"
                    color={
                      order?.status?.toUpperCase() === "PENDING"
                        ? "warning"
                        : order?.status?.toUpperCase() === "PAID"
                          ? "success"
                          : order?.status?.toUpperCase() === "FAILED"
                            ? "danger"
                            : order?.status?.toUpperCase() == "PROCESSING"
                              ? "secondary"
                              : order?.status?.toUpperCase() == "DELIVERED"
                                ? "primary"
                                : order?.status?.toUpperCase() === "COMPLETED"
                                  ? "success"
                                  : "danger"
                    }
                    size="sm"
                    startContent={
                      order?.status?.toUpperCase() === "PENDING" ? (
                        <FiClock className="animate-pulse" />
                      ) : order?.status?.toUpperCase() === "PAID" ? (
                        <FiCreditCard />
                      ) : order?.status?.toUpperCase() === "FAILED" ? (
                        <FiX />
                      ) : order?.status?.toUpperCase() === "PROCESSING" ? (
                        <FiBox />
                      ) : order?.status?.toUpperCase() === "DELIVERED" ? (
                        <FiTruck />
                      ) : order?.status?.toUpperCase() === "COMPLETED" ? (
                        <FiCheck />
                      ) : null
                    }
                    variant="flat"
                  >
                    {order?.status?.toUpperCase() === "PENDING" &&
                      "Belum Bayar"}
                    {order?.status?.toUpperCase() === "PAID" &&
                      "Lunas (Real-time)"}
                    {order?.status?.toUpperCase() === "FAILED" && "Gagal"}
                    {order?.status?.toUpperCase() === "PROCESSING" &&
                      "Diproses"}
                    {order?.status?.toUpperCase() === "DELIVERED" && "Dikirim"}
                    {order?.status?.toUpperCase() === "COMPLETED" && "Selesai"}
                  </Chip>
                </div>
              </div>
            </div>
          ))}

          {(!dataOrderAdmin?.data?.orders ||
            dataOrderAdmin?.data?.orders?.length === 0) &&
            !isLoadingDataOrderAdmin && (
              <p className="text-center text-gray-500 dark:text-gray-400">
                Belum ada pesanan masuk
              </p>
            )}
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminDashboard;
