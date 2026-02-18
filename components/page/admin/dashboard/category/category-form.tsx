"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader, Input } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa";
import { MdCategory } from "react-icons/md";

import cn from "@/utils/cn";
import { TCategory } from "@/types/category";
import useCategory from "@/hooks/useCategory";
import InputFile from "@/components/input-file";

const CategoryForm = ({
  type,
  data,
}: {
  type: "create" | "edit";
  data?: TCategory;
}) => {
  const router = useRouter();
  const {
    // form
    control,
    handleSubmit,
    errors,
    setValue,
    // mutation
    handleCreateCategory,
    isPendingCreateCategory,
    handleUpdateCategory,
    isPendingUpdateCategory,
    // handle image
    handleUploadImage,
    isPendingUploadFile,
    handleDeleteImage,
    isPendingDeleteFile,
    preview,
  } = useCategory();

  useEffect(() => {
    if (type === "edit") {
      if (data) {
        setValue("name", data?.name);
        setValue("imageUrl", data?.imageUrl);
      }
    }
  }, [data]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center mb-4">
        <Button isIconOnly variant="light" onPress={() => router.back()}>
          <FaArrowLeft />
        </Button>

        <div className="flex items-center gap-2">
          <MdCategory className="h-6 w-6 text-success" />
          <h1 className="text-2xl font-bold">
            {type === "create" ? "Buat Kategori Baru" : "Ubah Kategori"}
          </h1>
        </div>
      </div>
      <div>
        <form
          className="space-y-4"
          onSubmit={handleSubmit(
            type === "create" ? handleCreateCategory : handleUpdateCategory,
          )}
        >
          <Card>
            <CardHeader className="flex flex-col gap-w items-start">
              <h2 className="text-lg font-semibold">Foto Kategori</h2>
              <p className="text-sm text-foreground-500">
                Unggah foto kategori (opsional)
              </p>
            </CardHeader>
            <CardBody>
              {/* Info about image */}
              <div className="mb-4 p-3 bg-default-100 rounded-lg">
                <p className="text-xs text-foreground-500">
                  💡 Tip: Foto kategori bersifat opsional. Jika tidak diupload,
                  kategori tetap dapat dibuat.
                </p>
              </div>
              {/* Upload Image */}
              <div className="space-y-1">
                <Controller
                  control={control}
                  name="imageUrl"
                  render={({ field }) => (
                    <InputFile
                      {...field}
                      isDroppable
                      className={cn(errors.imageUrl && "border-red-500")}
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
                {errors.imageUrl && (
                  <p className="text-red-500 text-sm">
                    {errors.imageUrl.message}
                  </p>
                )}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="flex flex-col gap-w items-start">
              <h2 className="text-lg font-semibold">Detail Kategori</h2>
              <p className="text-sm text-foreground-500">Isi detail kategori</p>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col gap-4">
                <div className="space-y-1">
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <Input
                        label="Nama Kategori"
                        variant="bordered"
                        {...field}
                        isInvalid={!!errors.name}
                      />
                    )}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
          <div className="flex justify-end gap-2">
            <Button
              variant="flat"
              onPress={() => router.push("/admin/dashboard/category")}
            >
              Batal
            </Button>
            <Button
              className="text-white"
              color="success"
              disabled={
                isPendingCreateCategory ||
                isPendingUploadFile ||
                isPendingUpdateCategory
              }
              isLoading={isPendingCreateCategory || isPendingUpdateCategory}
              type="submit"
            >
              {type === "create" ? "Buat Kategori" : "Ubah Kategori"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
