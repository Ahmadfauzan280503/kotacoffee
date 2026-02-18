"use client";

import { useRouter } from "next/navigation";
import { Key, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Button, Tooltip, useDisclosure } from "@heroui/react";
import Link from "next/link";
import { FiEdit, FiTrash } from "react-icons/fi";

import { columns } from "./columns";
import ModalDelete from "./modal-delete";

import { rupiahFormat } from "@/utils/rupiahFormat";
import useSeller from "@/hooks/useSeller";
import DataTable from "@/components/data-table";
import cn from "@/utils/cn";
import useChangeUrl from "@/hooks/useChangeUrl";

const Product = () => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { dataSeller, isLoadingSeller } = useSeller();
  const { setUrl } = useChangeUrl();

  useEffect(() => {
    setUrl();
  }, []);

  const renderCell = useCallback(
    (product: Record<string, unknown>, columnKey: Key) => {
      const cellValue = product[columnKey as string];

      switch (columnKey) {
        case "product":
          return (
            <div className="flex items-center gap-2">
              <Image
                alt="product"
                className="object-contain aspect-square rounded-md"
                height={50}
                src={
                  (product?.imageUrl as string)
                    ? (product?.imageUrl as string).startsWith("http")
                      ? (product?.imageUrl as string)
                      : `/images/${product?.imageUrl}`
                    : "/images/coffee/Coffee 1.jpg"
                }
                width={50}
              />
              <div className="w-80">
                <p className="font-medium">{product?.name as string}</p>
                <p className="text-xs text-gray-500 truncate">
                  {product?.description as string}
                </p>
              </div>
            </div>
          );
        case "category":
          return (
            <p className="text-gray-500">
              {(product?.category as { name: string })?.name}
            </p>
          );
        case "price":
          return (
            <p className="font-medium">{rupiahFormat(cellValue as number)}</p>
          );
        case "stock":
          return (
            <p
              className={cn(
                "font-medium",
                Number(cellValue) > 20 ? "text-success" : "text-danger",
              )}
            >
              {Number(cellValue)}{" "}
              {(product?.Unit as { symbol: string })?.symbol}
            </p>
          );
        case "actions":
          return (
            <div className="relative flex items-center justify-center gap-2">
              <Tooltip color="primary" content="Ubah produk">
                <Button
                  isIconOnly
                  as={Link}
                  className="text-lg cursor-pointer active:opacity-50"
                  color="primary"
                  href={`/dashboard/product/edit/${product.id}`}
                  variant="light"
                >
                  <FiEdit />
                </Button>
              </Tooltip>
              <Tooltip color="danger" content="Hapus produk">
                <Button
                  isIconOnly
                  className="text-lg cursor-pointer active:opacity-50"
                  color="danger"
                  variant="light"
                  onPress={() => {
                    setSelectedProduct(product?.id as string);
                    onOpen();
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
    [router],
  );

  return (
    <>
      <ModalDelete
        isOpen={isOpen}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        onClose={onClose}
        onOpenChange={onOpenChange}
      />
      <DataTable
        addButton
        addButtonText="Tambah Produk"
        columns={columns}
        currentPage={dataSeller?.currentPage}
        data={dataSeller?.products || []}
        description="Kelola produk yang Anda miliki"
        emptyContent="Belum ada produk yang ditambahkan"
        isLoading={isLoadingSeller}
        renderCell={renderCell as any}
        title="Produk"
        totalPage={dataSeller?.totalPage}
        onPressAddButton={() => router.push("/dashboard/product/create")}
      />
    </>
  );
};

export default Product;
