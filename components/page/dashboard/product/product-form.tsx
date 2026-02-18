"use client";

import { Button } from "@heroui/button";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Switch,
  Textarea,
} from "@heroui/react";
import { FaArrowLeft } from "react-icons/fa";
import { FiPackage } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import Image from "next/image";

import useCategory from "@/hooks/useCategory";
import useProduct from "@/hooks/useProduct";
import cn from "@/utils/cn";
import useUnit from "@/hooks/useUnit";
import { TProductResponse } from "@/types/product";
import InputFile from "@/components/input-file";

interface PropTypes {
  type: "create" | "edit";
  data?: TProductResponse;
}

// Daftar gambar lokal yang tersedia
const LOCAL_IMAGES = [
  { label: "Coffee 1", value: "coffee/Coffee 1.jpg", category: "Coffee" },
  { label: "Coffee 2", value: "coffee/coffee 2.jpg", category: "Coffee" },
  {
    label: "Non Coffee 1",
    value: "non-coffee/Non Coffee 1.jpg",
    category: "Non-Coffee",
  },
  {
    label: "Non Coffee 2",
    value: "non-coffee/Non Coffee 2.jpg",
    category: "Non-Coffee",
  },
  {
    label: "Non Coffee 3",
    value: "non-coffee/Non Coffee 3.jpg",
    category: "Non-Coffee",
  },
  {
    label: "Non Coffee 4",
    value: "non-coffee/Non Coffee 4.jpg",
    category: "Non-Coffee",
  },
  {
    label: "Roti Bakar Tiramisu",
    value: "food/Roti bakar Tiramisu.jpg",
    category: "Food",
  },
];

const ProductForm = ({ type, data }: PropTypes) => {
  const router = useRouter();
  const { dataCategories, isLoadingCategories } = useCategory();
  const { dataUnits, isLoadingUnits } = useUnit();
  const [useLocalImage, setUseLocalImage] = useState(false);
  const [selectedLocalImage, setSelectedLocalImage] = useState("");

  const {
    // form
    control,
    handleSubmit,
    errors,
    reset,
    // mutation
    handleCreateProduct,
    isPendingCreateProduct,
    handleUpdateProduct,
    isPendingUpdateProduct,
    // handle image
    handleUploadImage,
    isPendingUploadFile,
    handleDeleteImage,
    isPendingDeleteFile,
    preview,
    setValue,
  } = useProduct();

  useEffect(() => {
    if (type === "edit") {
      setValue("name", data?.name || "");
      setValue("price", data?.price || 0);
      setValue("stock", data?.stock || 0);
      setValue("unitId", data?.unitId || "");
      setValue("categoryId", data?.categoryId || "");
      setValue("description", data?.description || "");
      setValue("imageUrl", data?.imageUrl || "");
      setValue("isFeatured", data?.isFeatured || false);
      // Check if existing image is a local image
      if (data?.imageUrl && !data.imageUrl.startsWith("http")) {
        setUseLocalImage(true);
        setSelectedLocalImage(data.imageUrl);
      }
    }
  }, [type, data]);

  // Handle local image selection
  const handleLocalImageSelect = (value: string) => {
    setSelectedLocalImage(value);
    setValue("imageUrl", value);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center mb-4">
        <Button isIconOnly variant="light" onPress={() => router.back()}>
          <FaArrowLeft />
        </Button>

        <div className="flex items-center gap-2">
          <FiPackage className="h-6 w-6 text-success" />
          <h1 className="text-2xl font-bold">
            {type === "create" ? "Buat Produk Baru" : "Ubah Produk"}
          </h1>
        </div>
      </div>
      <div>
        <form
          className="space-y-4"
          onSubmit={handleSubmit(
            type === "create" ? handleCreateProduct : handleUpdateProduct,
          )}
        >
          <Card>
            <CardHeader className="flex flex-col gap-w items-start">
              <h2 className="text-lg font-semibold">Foto Produk</h2>
              <p className="text-sm text-foreground-500">
                Unggah foto produk Anda atau pilih dari gambar yang tersedia
              </p>
            </CardHeader>
            <CardBody>
              {/* Toggle between upload and local selection */}
              <div className="flex gap-2 mb-4">
                <Button
                  color={!useLocalImage ? "success" : "default"}
                  size="sm"
                  variant={!useLocalImage ? "solid" : "bordered"}
                  onPress={() => {
                    setUseLocalImage(false);
                    setSelectedLocalImage("");
                  }}
                >
                  Upload Gambar
                </Button>
                <Button
                  color={useLocalImage ? "success" : "default"}
                  size="sm"
                  variant={useLocalImage ? "solid" : "bordered"}
                  onPress={() => setUseLocalImage(true)}
                >
                  Pilih Gambar Tersedia
                </Button>
              </div>

              {/* Upload Image */}
              {!useLocalImage && (
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
              )}

              {/* Local Image Selection */}
              {useLocalImage && (
                <div className="space-y-4">
                  <Select
                    label="Pilih Gambar"
                    placeholder="Pilih gambar dari daftar"
                    selectedKeys={
                      selectedLocalImage ? [selectedLocalImage] : []
                    }
                    variant="bordered"
                    onChange={(e) => handleLocalImageSelect(e.target.value)}
                  >
                    {LOCAL_IMAGES.map((img) => (
                      <SelectItem key={img.value} textValue={img.label}>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-foreground-500">
                            [{img.category}]
                          </span>
                          <span>{img.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </Select>

                  {/* Preview selected local image */}
                  {selectedLocalImage && (
                    <div className="flex flex-col items-center gap-2 p-4 border rounded-lg border-dashed border-success">
                      <p className="text-sm text-foreground-500">Preview:</p>
                      <Image
                        alt="Preview"
                        className="object-contain rounded-md"
                        height={200}
                        src={`/images/${selectedLocalImage}`}
                        width={200}
                      />
                      <p className="text-xs text-foreground-500">
                        {selectedLocalImage}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="flex flex-col gap-w items-start">
              <h2 className="text-lg font-semibold">Detail Produk</h2>
              <p className="text-sm text-foreground-500">
                Isi detail produk Anda
              </p>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col gap-4">
                <div className="space-y-1">
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <Input
                        label="Nama Produk"
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
                <div className="space-y-1">
                  <Controller
                    control={control}
                    name="price"
                    render={({ field }) => (
                      <Input
                        {...field}
                        isInvalid={!!errors.price}
                        label="Harga Produk"
                        type="number"
                        value={field.value?.toString() || ""}
                        variant="bordered"
                        onChange={(e) =>
                          field.onChange(Number(e.target.value) || 0)
                        }
                      />
                    )}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Controller
                      control={control}
                      name="stock"
                      render={({ field }) => (
                        <Input
                          {...field}
                          isInvalid={!!errors.stock}
                          label="Stok Produk"
                          type="number"
                          value={field.value?.toString() || ""}
                          variant="bordered"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value) || 0)
                          }
                        />
                      )}
                    />
                    {errors.stock && (
                      <p className="text-red-500 text-sm">
                        {errors.stock.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Controller
                      control={control}
                      name="unitId"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isDisabled={
                            isLoadingUnits || !dataUnits?.data?.length
                          }
                          isInvalid={!!errors?.unitId}
                          isLoading={isLoadingUnits}
                          label="Satuan Produk"
                          placeholder="Pilih Satuan"
                          selectedKeys={field.value ? [field.value] : []}
                          variant="bordered"
                        >
                          {(dataUnits?.data || []).map(
                            (unit: { id: string; symbol: string }) => (
                              <SelectItem key={unit.id}>
                                {unit.symbol}
                              </SelectItem>
                            ),
                          )}
                        </Select>
                      )}
                    />
                    {errors.unitId && (
                      <p className="text-red-500 text-sm">
                        {errors.unitId.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <Controller
                    control={control}
                    name="categoryId"
                    render={({ field }) => (
                      <Select
                        {...field}
                        isDisabled={
                          isLoadingCategories ||
                          !dataCategories?.categories?.length
                        }
                        isInvalid={!!errors.categoryId}
                        isLoading={isLoadingCategories}
                        label="Kategori Produk"
                        placeholder="Pilih Kategori"
                        selectedKeys={field.value ? [field.value] : []}
                        variant="bordered"
                      >
                        {(dataCategories?.categories || []).map(
                          (category: { id: string; name: string }) => (
                            <SelectItem key={category.id}>
                              {category.name}
                            </SelectItem>
                          ),
                        )}
                      </Select>
                    )}
                  />
                  {errors.categoryId && (
                    <p className="text-red-500 text-sm">
                      {errors.categoryId.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        isInvalid={!!errors.description}
                        label="Deskripsi Produk"
                        variant="bordered"
                      />
                    )}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <Controller
                    control={control}
                    name="isFeatured"
                    render={({ field }) => (
                      <div className="flex items-center justify-between p-3 bg-default-50 rounded-lg border border-default-200">
                        <div>
                          <p className="font-semibold text-sm">
                            Tampilkan di Produk Unggulan
                          </p>
                          <p className="text-xs text-foreground-500">
                            Tampilkan produk ini di section Produk Unggulan
                            landing page
                          </p>
                        </div>
                        <Switch
                          color="success"
                          isSelected={field.value}
                          onValueChange={field.onChange}
                        />
                      </div>
                    )}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
          <div className="flex justify-end gap-2">
            <Button
              variant="flat"
              onPress={() => router.push("/dashboard/product")}
            >
              Batal
            </Button>
            <Button
              className="text-white"
              color="success"
              disabled={
                isPendingCreateProduct ||
                isPendingUploadFile ||
                isPendingUpdateProduct
              }
              isLoading={
                isPendingCreateProduct ||
                isPendingUploadFile ||
                isPendingUpdateProduct
              }
              type="submit"
            >
              {type === "create" ? "Buat Produk" : "Ubah Produk"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
