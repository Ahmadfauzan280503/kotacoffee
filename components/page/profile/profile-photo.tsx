"use client";

import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  useDisclosure,
} from "@heroui/react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { FaAngleRight, FaStore } from "react-icons/fa";
import { FiCamera, FiPackage, FiShield, FiUser, FiX } from "react-icons/fi";
import { Controller } from "react-hook-form";

import InputFile from "@/components/input-file";
import cn from "@/utils/cn";
import ModalConfirmBeseller from "@/components/modal-confirm-beseller";
import usePhotoProfile from "@/hooks/usePhotoProfile";

const ProfilePhoto = ({ dataUser }: { dataUser: any }) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();
  const { onClose, onOpenChange, isOpen } = useDisclosure();
  const isSellerVerified =
    dataUser?.Seller?.[0]?.verified && dataUser?.Seller?.length;

  const {
    control,
    handleSubmit,
    errors,
    handleUpdatePhoto,
    isPendingMutateUpdatePhoto,
    handleUploadImage,
    handleDeleteImage,
    isPendingDeleteFile,
    isPendingUploadFile,
    preview,
    visibleForm,
    handleVisibleForm,
  }: any = usePhotoProfile();

  return (
    <div className="lg:col-span-1">
      <ModalConfirmBeseller isOpen={isOpen} onOpenChange={onOpenChange} />
      <Card className="shadow-lg">
        {session?.user?.role === "user" ? (
          <button
            className="bg-success text-white w-full mb-6 py-3 px-6 rounded-xl flex items-center justify-between shadow-lg shadow-success/20 hover:shadow-success/40 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() =>
              dataUser?.Seller?.length > 0
                ? isSellerVerified
                  ? router.push("/dashboard")
                  : router.push("/dashboard/store-info")
                : onOpenChange()
            }
          >
            <div className="flex items-center gap-3">
              <FaStore className="h-5 w-5" />
              <span className="font-semibold">
                {dataUser?.Seller?.length > 0
                  ? "Lapak Saya"
                  : "Menjadi Penjual"}
              </span>
            </div>
            <FaAngleRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        ) : null}
        <CardHeader className="flex flex-col">
          <div className="flex lg:flex-col items-start gap-2 lg:gap-0 lg:items-center w-full">
            <div className="relative flex flex-col items-center group">
              <Avatar
                showFallback
                className="lg:w-32 lg:h-32 w-16 h-16 mx-auto border-4 border-emerald-200"
                name={`${dataUser?.name}`}
                src={
                  preview
                    ? preview
                    : dataUser?.photo
                      ? dataUser?.photo
                      : `https://ui-avatars.com/api/?name=${dataUser?.name}&background=random`
                }
              />
              <Button
                className="mt-2"
                color={visibleForm ? "danger" : "default"}
                size="sm"
                startContent={visibleForm ? <FiX /> : <FiCamera />}
                variant="light"
                onPress={handleVisibleForm}
              >
                {visibleForm ? "Batal" : "Ubah Photo"}
              </Button>
            </div>
            <div className="lg:text-center text-left mb-2">
              <h3 className="mt-2 text-xl font-semibold">{dataUser?.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                @{dataUser?.username}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          {visibleForm ? (
            <form onSubmit={handleSubmit(handleUpdatePhoto)}>
              <Controller
                control={control}
                name="photo"
                render={({ field }) => (
                  <InputFile
                    {...field}
                    isDroppable
                    className={cn(errors.photo && "border-red-500")}
                    isDeleting={isPendingDeleteFile}
                    isUploading={isPendingUploadFile}
                    preview={typeof preview === "string" ? preview : ""}
                    onDelete={() => handleDeleteImage(field.onChange)}
                    onUpload={(files) =>
                      handleUploadImage(files, field.onChange)
                    }
                  />
                )}
              />

              {preview !== "" ? (
                <Button
                  className="text-white mt-2 w-full"
                  color="success"
                  disabled={isPendingMutateUpdatePhoto}
                  isLoading={isPendingMutateUpdatePhoto}
                  size="sm"
                  type="submit"
                >
                  Simpan Photo
                </Button>
              ) : null}
            </form>
          ) : null}
          <div className="flex gap-2 lg:flex-col mt-4">
            <Button
              className="w-full justify-start"
              color={pathName === "/profile" ? "success" : "default"}
              startContent={<FiUser className="h-4 w-4" />}
              variant="bordered"
              onPress={() => router.push("/profile")}
            >
              Profil
            </Button>

            <Button
              className="w-full justify-start"
              color={pathName === "/profile/security" ? "success" : "default"}
              startContent={<FiShield className="h-4 w-4" />}
              variant="bordered"
              onPress={() => router.push("/profile/security")}
            >
              Keamanan
            </Button>

            <Button
              className="w-full justify-start"
              color={pathName === "/profile/orders" ? "success" : "default"}
              startContent={<FiPackage className="h-4 w-4" />}
              variant="bordered"
              onPress={() => router.push("/profile/orders")}
            >
              Pesanan Saya
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProfilePhoto;
