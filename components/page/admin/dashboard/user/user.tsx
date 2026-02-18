"use client";

import { Avatar } from "@heroui/avatar";
import { Button, Chip, Tooltip, useDisclosure } from "@heroui/react";
import { Key, useCallback, useEffect } from "react";
import { FiEye, FiTrash } from "react-icons/fi";

import { columns } from "./columns";
import ModalUser from "./modal-user";
import ModalDelete from "./modal-delete";

import useUser from "@/hooks/useUser";
import useChangeUrl from "@/hooks/useChangeUrl";
import DataTable from "@/components/data-table";

const User = () => {
  const {
    dataUsers,
    isLoadingDataUsers,
    setSellectedId,
    sellectedId,
    dataUser,
    isLoadingDataUser,
  } = useUser();

  const {
    isOpen: isOpenDetail,
    onOpen: onOpenDetail,
    onClose: onCloseDetail,
  } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  const { setUrl } = useChangeUrl();

  useEffect(() => {
    setUrl();
  }, []);

  const renderCell = useCallback(
    (user: Record<string, any>, columnKey: Key) => {
      const cellValue = user[columnKey as string];

      switch (columnKey) {
        case "user":
          return (
            <div className="flex items-center gap-2">
              <div>
                <Avatar
                  showFallback
                  className="w-10 h-10 mx-auto border-4 border-emerald-200"
                  name={`${user?.name}`}
                  src={
                    user?.photo
                      ? user?.photo
                      : `https://ui-avatars.com/api/?name=${user?.name}&background=random`
                  }
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium">{user?.name}</span>
                <span className="text-xs text-gray-500">@{user?.username}</span>
              </div>
            </div>
          );
        case "gender":
          return cellValue === "male"
            ? "Laki-laki"
            : cellValue === "female" && "Perempuan";
        case "isActive":
          return (
            <Chip
              className="flex items-center gap-1"
              color={cellValue ? "success" : "warning"}
              size="sm"
              variant="bordered"
            >
              {cellValue ? "Active" : "Inactive"}
            </Chip>
          );

        case "actions":
          return (
            <div className="relative flex items-center justify-center gap-2">
              <Tooltip color="primary" content="Detail User">
                <Button
                  isIconOnly
                  className="cursor-pointer active:opacity-50"
                  color="primary"
                  size="sm"
                  variant="light"
                  onPress={() => {
                    onOpenDetail();
                    setSellectedId(user?.id);
                  }}
                >
                  <FiEye />
                </Button>
              </Tooltip>
              <Tooltip color="danger" content="Hapus User">
                <Button
                  isIconOnly
                  className="cursor-pointer active:opacity-50"
                  color="danger"
                  size="sm"
                  variant="light"
                  onPress={() => {
                    onOpenDelete();
                    setSellectedId(user?.id);
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
        selectedUser={sellectedId}
        setSelectedUser={setSellectedId}
        onClose={onCloseDelete}
        onOpenChange={onOpenDelete}
      />
      <ModalUser
        isLoading={isLoadingDataUser}
        isOpen={isOpenDetail}
        user={dataUser?.data}
        onClose={onCloseDetail}
      />
      <DataTable
        columns={columns}
        currentPage={dataUsers?.data?.currentPage}
        data={dataUsers?.data?.users || []}
        description="Kelola user / pengguna"
        emptyContent="Belum ada users yang terdaftar"
        isLoading={isLoadingDataUsers}
        renderCell={renderCell as any}
        title="User / Pengguna"
        totalPage={dataUsers?.data?.totalPage}
      />
    </>
  );
};

export default User;
