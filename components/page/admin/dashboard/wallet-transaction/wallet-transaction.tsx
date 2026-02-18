"use client";

import { Button, Chip, Tooltip, useDisclosure } from "@heroui/react";
import { Key, useCallback, useEffect, useState } from "react";
import { FiEye, FiTrash } from "react-icons/fi";
import { BsBank, BsCheckCircle, BsClock } from "react-icons/bs";

import { columns } from "./columns";
import ModalDetail from "./modal-detail";
import ModalDelete from "./modal-delete";

import useWalletTransaction from "@/hooks/useWalletTransaction";
import { rupiahFormat } from "@/utils/rupiahFormat";
import { formatDate } from "@/utils/dateFormat";
import DataTable from "@/components/data-table";
import useChangeUrl from "@/hooks/useChangeUrl";

const WalletTransaction = () => {
  const [selectedWalletTransaction, setSelectedWalletTransaction] =
    useState("");

  const {
    dataAllWalletTransactions,
    isLoadingDataAllWalletTransaction,
    dataWalletTransactionById,
    setSelectedId,
  } = useWalletTransaction();

  const {
    isOpen: isOpenDetail,
    onOpen: onOpenDetail,
    onClose: onCloseDetail,
  } = useDisclosure();

  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
    onOpenChange: onOpenChangeDelete,
  } = useDisclosure();

  const { setUrl } = useChangeUrl();

  useEffect(() => {
    setUrl();
  }, []);

  const renderCell = useCallback(
    (walletTransaction: Record<string, any>, columnKey: Key) => {
      const cellValue = walletTransaction[columnKey as string];

      switch (columnKey) {
        case "seller":
          return (
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-start">
                <span className="font-medium">
                  {walletTransaction.wallet?.seller?.storeName}
                </span>
                <span className="text-sm text-gray-500 uppercase">
                  {walletTransaction.wallet?.seller?.bankName} |{" "}
                  {walletTransaction.wallet?.seller?.accountName}
                </span>
                <span className="text-sm text-gray-500">
                  {walletTransaction.wallet?.seller?.accountNumber}
                </span>
              </div>
            </div>
          );
        case "amount":
          return <p className="font-medium">{rupiahFormat(cellValue)}</p>;
        case "paymentMethod":
          return (
            <div className="flex items-center gap-2 text-primary">
              <BsBank />
              <span className="text-sm text-gray-500">
                {cellValue.split("_").join(" ")}
              </span>
            </div>
          );
        case "status":
          return (
            <Chip
              className="flex items-center gap-1"
              color={cellValue === "pending" ? "warning" : "success"}
              size="sm"
              startContent={
                cellValue === "pending" ? <BsClock /> : <BsCheckCircle />
              }
              variant="bordered"
            >
              {cellValue}
            </Chip>
          );
        case "createdAt":
          return <p>{formatDate(cellValue)}</p>;
        case "actions":
          return (
            <div className="relative flex items-center justify-center gap-2">
              <Tooltip color="primary" content="Ubah produk">
                <Button
                  isIconOnly
                  className="cursor-pointer active:opacity-50"
                  color="primary"
                  size="sm"
                  variant="light"
                  onPress={() => {
                    onOpenDetail();
                    setSelectedId(walletTransaction.id);
                  }}
                >
                  <FiEye />
                </Button>
              </Tooltip>
              <Tooltip color="danger" content="Hapus produk">
                <Button
                  isIconOnly
                  className="cursor-pointer active:opacity-50"
                  color="danger"
                  size="sm"
                  variant="light"
                  onPress={() => {
                    onOpenDelete();
                    setSelectedWalletTransaction(walletTransaction?.id);
                  }}
                >
                  <FiTrash />
                </Button>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [],
  );

  return (
    <>
      <ModalDelete
        isOpen={isOpenDelete}
        selectedWalletTransaction={selectedWalletTransaction}
        setSelectedWalletTransaction={setSelectedWalletTransaction}
        onClose={onCloseDelete}
        onOpenChange={onOpenChangeDelete}
      />

      <ModalDetail
        isOpen={isOpenDetail}
        walletTransaction={dataWalletTransactionById?.data}
        onClose={onCloseDetail}
      />
      <DataTable
        columns={columns}
        currentPage={dataAllWalletTransactions?.data?.currentPage}
        data={dataAllWalletTransactions?.data?.walletTransaction || []}
        description="Kelola transaksi wallet"
        emptyContent="Tidak ada transaksi wallet"
        isLoading={isLoadingDataAllWalletTransaction}
        renderCell={renderCell}
        title="Transaksi Wallet"
        totalPage={dataAllWalletTransactions?.data?.totalPage}
      />
    </>
  );
};

export default WalletTransaction;
