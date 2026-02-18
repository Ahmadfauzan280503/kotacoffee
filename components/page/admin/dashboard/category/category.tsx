"use client";

import React, { Key, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Button, Tooltip } from "@heroui/react";
import { FiEdit, FiTrash } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@heroui/react";

import { columns } from "./columns";
import ModalDelete from "./modal-delete";

import useCategory from "@/hooks/useCategory";
import DataTable from "@/components/data-table";
import { formatDate } from "@/utils/dateFormat";
import useChangeUrl from "@/hooks/useChangeUrl";

const Category = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const router = useRouter();
  const { dataCategoriesAdmin, isLoadingCategoriesAdmin } = useCategory();
  const { setUrl } = useChangeUrl();

  useEffect(() => {
    setUrl();
  }, []);

  const renderCell = useCallback(
    (category: Record<string, unknown>, columnKey: Key) => {
      const cellValue = category[columnKey as string];

      switch (columnKey) {
        case "category":
          return (
            <div className="flex items-center gap-2">
              {category?.imageUrl ? (
                <Image
                  alt={category?.name as string}
                  className="object-contain aspect-square rounded-md"
                  height={50}
                  src={category?.imageUrl as string}
                  width={50}
                />
              ) : (
                <div className="w-[50px] h-[50px] bg-gray-200 rounded-md flex items-center justify-center text-[10px] text-gray-500">
                  No Img
                </div>
              )}
              <p className="font-medium">{category?.name as string}</p>
            </div>
          );
        case "createdAt":
          return (
            <div>
              <p className="font-medium">{formatDate(cellValue as string)}</p>
            </div>
          );
        case "createdBy":
          return (
            <div className="text-center">
              <p className="font-medium">
                {(category?.user as { name: string })?.name || "-"}
              </p>
              <p className="text-sm text-foreground-500">
                {(category?.user as { role: string })?.role || "-"}
              </p>
            </div>
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
                  href={`/admin/dashboard/category/edit/${category.id}`}
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
                    setSelectedCategory(category.id as string);
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
    [],
  );

  return (
    <>
      <ModalDelete
        isOpen={isOpen}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onClose={onClose}
        onOpenChange={onOpenChange}
      />
      <DataTable
        addButton
        addButtonText="Tambah Kategori"
        columns={columns}
        currentPage={dataCategoriesAdmin?.pagination?.page}
        data={dataCategoriesAdmin?.categories || []}
        description="Kelola kategori"
        emptyContent="Belum ada kategori yang ditambahkan"
        isLoading={isLoadingCategoriesAdmin}
        renderCell={renderCell as any}
        title="Kategori"
        totalPage={dataCategoriesAdmin?.pagination?.totalPages}
        onPressAddButton={() => router.push("/admin/dashboard/category/create")}
      />
    </>
  );
};

export default Category;
