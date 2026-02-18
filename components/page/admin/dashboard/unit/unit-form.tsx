"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader, Input } from "@heroui/react";
import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa";
import { TbWeight } from "react-icons/tb";
import { useEffect } from "react";

import { IUnit } from "@/types/unit";
import useUnit from "@/hooks/useUnit";

const UnitForm = ({
  type,
  data,
}: {
  type: "create" | "edit";
  data?: IUnit;
}) => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setValue,
    errors,
    handleCreateUnit,
    isPendingCreateUnit,
    handleUpdateUnit,
    isPendingUpdateUnit,
  } = useUnit();

  useEffect(() => {
    if (type === "edit") {
      if (data) {
        setValue("name", data?.name);
        setValue("symbol", data?.symbol);
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
          <TbWeight className="h-6 w-6 text-success" />
          <h1 className="text-2xl font-bold">
            {type === "create" ? "Buat Unit Baru" : "Ubah Unit"}
          </h1>
        </div>
      </div>
      <div>
        <form
          className="space-y-4"
          onSubmit={handleSubmit(
            type === "create" ? handleCreateUnit : handleUpdateUnit,
          )}
        >
          <Card>
            <CardHeader className="flex flex-col gap-w items-start">
              <h2 className="text-lg font-semibold">Detail Unit</h2>
              <p className="text-sm text-foreground-500">Isi detail unit</p>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <Input
                        label="Nama Satuan"
                        variant="bordered"
                        {...field}
                        errorMessage={errors.name?.message}
                        isInvalid={!!errors.name}
                      />
                    )}
                  />
                </div>

                <div className="space-y-1">
                  <Controller
                    control={control}
                    name="symbol"
                    render={({ field }) => (
                      <Input
                        label="Simbol Satuan"
                        variant="bordered"
                        {...field}
                        errorMessage={errors.symbol?.message}
                        isInvalid={!!errors.symbol}
                      />
                    )}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
          <div className="flex justify-end gap-2">
            <Button
              variant="flat"
              onPress={() => router.push("/admin/dashboard/unit")}
            >
              Batal
            </Button>
            <Button
              className="text-white"
              color="success"
              disabled={isPendingCreateUnit || isPendingUpdateUnit}
              isLoading={isPendingCreateUnit || isPendingUpdateUnit}
              type="submit"
            >
              {type === "create" ? "Buat Unit" : "Ubah Unit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnitForm;
