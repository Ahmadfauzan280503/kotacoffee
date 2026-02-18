"use client";

import { Button, Tooltip } from "@heroui/react";
import { Key, useCallback, useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@heroui/react";

import { columns } from "./columns";
import ModalDelete from "./modal-delete";

import useUnit from "@/hooks/useUnit";
import DataTable from "@/components/data-table";

const Unit = () => {
  const [selectedUnit, setSelectedUnit] = useState("");
  const router = useRouter();
  const { dataUnits, isLoadingUnits } = useUnit();

  const { onOpen, onClose, isOpen } = useDisclosure();

  const renderCell = useCallback(
    (unit: Record<string, unknown>, columnKey: Key) => {
      const cellValue = unit[columnKey as string];

      switch (columnKey) {
        case "actions":
          return (
            <div className="relative flex items-center justify-center gap-2">
              <Tooltip color="primary" content="Ubah unit">
                <Button
                  isIconOnly
                  className="text-lg cursor-pointer active:opacity-50"
                  color="primary"
                  variant="light"
                  onPress={() =>
                    router.push(`/admin/dashboard/unit/edit/${unit?.id}`)
                  }
                >
                  <FiEdit />
                </Button>
              </Tooltip>
              <Tooltip color="danger" content="Hapus unit">
                <Button
                  isIconOnly
                  className="text-lg cursor-pointer active:opacity-50"
                  color="danger"
                  variant="light"
                  onPress={() => {
                    setSelectedUnit(unit.id as string);
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
        selectedUnit={selectedUnit}
        setSelectedUnit={setSelectedUnit}
        onClose={onClose}
        onOpenChange={onOpen}
      />

      <DataTable
        addButton
        addButtonText="Tambah Unit"
        columns={columns}
        data={dataUnits?.data || []}
        description="Kelola unit"
        emptyContent="Belum ada unit yang ditambahkan"
        isLoading={isLoadingUnits}
        isPaginate={false}
        renderCell={renderCell as any}
        title="Unit"
        onPressAddButton={() => router.push("/admin/dashboard/unit/create")}
      />
    </>
  );
};

export default Unit;
