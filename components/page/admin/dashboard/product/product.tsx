"use client";

import { Button, Tooltip, useDisclosure } from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Key, useCallback, useEffect, useState } from "react";
import { FiTrash } from "react-icons/fi";

import { columns } from "./columns";
import ModalDelete from "./modal-delete";

import useProduct from "@/hooks/useProduct";
import { rupiahFormat } from "@/utils/rupiahFormat";
import cn from "@/utils/cn";
import DataTable from "@/components/data-table";
import useChangeUrl from "@/hooks/useChangeUrl";

const AdminProduct = () => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { dataProducts, isLoadingProducts } = useProduct();
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
              {product?.imageUrl ? (
                <Image
                  alt="product"
                  className="object-contain aspect-square rounded-md"
                  height={50}
                  src={
                    (product?.imageUrl as string).startsWith("http")
                      ? (product?.imageUrl as string)
                      : `/images/${product?.imageUrl}`
                  }
                  width={50}
                />
              ) : (
                <div className="w-[50px] h-[50px] bg-gray-200 rounded-md flex items-center justify-center text-[10px] text-gray-500">
                  No Img
                </div>
              )}
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
              {Number(cellValue)}
            </p>
          );
        case "actions":
          return (
            <div className="relative flex items-center justify-center gap-2">
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
        currentPage={dataProducts?.data?.currentPage}
        data={dataProducts?.data?.products || []}
        description="Kelola semua produk yang ada"
        emptyContent="Belum ada produk yang ditambahkan"
        isLoading={isLoadingProducts}
        renderCell={renderCell as any}
        title="Produk"
        totalPage={dataProducts?.data?.totalPage}
        onPressAddButton={() => router.push("/dashboard/product/create")}
      />
    </>
  );
};

export default AdminProduct;
