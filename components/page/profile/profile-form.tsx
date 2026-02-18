"use client";

import { Button } from "@heroui/button";
import {
  Card,
  CardBody,
  CardHeader,
  DatePicker,
  Input,
  Select,
  SelectItem,
  Skeleton,
  Textarea,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { FaGenderless, FaUser, FaUserLock } from "react-icons/fa";
import { FiCalendar, FiMail, FiPhone } from "react-icons/fi";
import { I18nProvider } from "@react-aria/i18n";
import { MdLocationPin } from "react-icons/md";

import {
  calendarDateToString,
  stringToCalendarDate,
} from "@/utils/stringToCalendarDate";
import useProfile from "@/hooks/useProfile";

const ProfileForm = () => {
  const router = useRouter();
  const {
    dataUser,
    isPendingUpdateUser,
    handleSubmit,
    handleUpdateUser,
    control,
    errors,
    setValue,
  } = useProfile();

  useEffect(() => {
    if (dataUser) {
      setValue("name", dataUser?.name || "");
      setValue("email", dataUser?.email || "");
      setValue("address", dataUser?.address || "");
      setValue("phone", dataUser?.phone || "");
      setValue("username", dataUser?.username || "");
      setValue("gender", dataUser?.gender || "");
      const birthDate = dataUser?.birthDate
        ? dataUser.birthDate.split("T")[0]
        : "";

      setValue("birthDate", birthDate);
      setValue("photo", dataUser?.photo || "");
    }
  }, [dataUser]);

  return (
    <div className="lg:col-span-2">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col items-start">
          <h2 className="text-xl flex items-center gap-2">
            <FaUser className="h-5 w-5 text-emerald-600" />
            Informasi Pribadi
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Perbarui informasi pribadi Anda di sini
          </p>
        </CardHeader>

        <CardBody>
          <form className="space-y-8" onSubmit={handleSubmit(handleUpdateUser)}>
            {/* Basic Information */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Informasi Dasar
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <Skeleton className="rounded-lg" isLoaded={!!dataUser}>
                    <Controller
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <Input
                          {...field}
                          isRequired
                          errorMessage={errors.name?.message}
                          isInvalid={!!errors.name}
                          label="Nama Lengkap"
                          placeholder="Masukkan nama lengkap"
                          startContent={
                            <FaUser className="h-4 w-4 text-gray-400" />
                          }
                          variant="bordered"
                        />
                      )}
                    />
                  </Skeleton>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <Skeleton className="rounded-lg" isLoaded={!!dataUser}>
                    <Controller
                      control={control}
                      name="username"
                      render={({ field }) => (
                        <Input
                          {...field}
                          disabled
                          isRequired
                          errorMessage={errors.username?.message}
                          isInvalid={!!errors.username}
                          label="Username"
                          placeholder="Masukkan username"
                          startContent={
                            <FaUserLock className="h-4 w-4 text-gray-400" />
                          }
                        />
                      )}
                    />
                  </Skeleton>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <Skeleton className="rounded-lg" isLoaded={!!dataUser}>
                    <Controller
                      control={control}
                      name="gender"
                      render={({ field }) => (
                        <Select
                          {...field}
                          errorMessage={errors.gender?.message}
                          isInvalid={!!errors.gender}
                          label="Jenis Kelamin"
                          selectedKeys={field.value ? [field.value] : []}
                          startContent={
                            <FaGenderless className="h-4 w-4 text-gray-400" />
                          }
                          variant="bordered"
                        >
                          <SelectItem key="male">Laki-laki</SelectItem>
                          <SelectItem key="female">Perempuan</SelectItem>
                        </Select>
                      )}
                    />
                  </Skeleton>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <Skeleton className="rounded-lg" isLoaded={!!dataUser}>
                    <Controller
                      control={control}
                      name="birthDate"
                      render={({ field }) => (
                        <I18nProvider locale="id">
                          <DatePicker
                            {...field}
                            errorMessage={errors.birthDate?.message}
                            isInvalid={!!errors.birthDate}
                            label="Tanggal Lahir"
                            startContent={<FiCalendar />}
                            value={stringToCalendarDate(field.value)}
                            variant="bordered"
                            onChange={(val) =>
                              field.onChange(calendarDateToString(val))
                            }
                          />
                        </I18nProvider>
                      )}
                    />
                  </Skeleton>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Informasi Kontak
                </h3>
                <div className="space-y-4">
                  <Skeleton className="rounded-lg" isLoaded={!!dataUser}>
                    <Controller
                      control={control}
                      name="email"
                      render={({ field }) => (
                        <Input
                          {...field}
                          disabled
                          isRequired
                          errorMessage={errors.email?.message}
                          isInvalid={!!errors.email}
                          label="Alamat Email"
                          placeholder="Masukkan alamat email"
                          startContent={
                            <FiMail className="h-4 w-4 text-gray-400" />
                          }
                        />
                      )}
                    />
                  </Skeleton>

                  <Skeleton className="rounded-lg" isLoaded={!!dataUser}>
                    <Controller
                      control={control}
                      name="phone"
                      render={({ field }) => (
                        <Input
                          {...field}
                          errorMessage={errors.phone?.message}
                          isInvalid={!!errors.phone}
                          label="Nomor Telepon"
                          placeholder="8123456789"
                          startContent={
                            <FiPhone className="h-4 w-4 text-gray-400" />
                          }
                          variant="bordered"
                          onChange={(e) => {
                            let val = e.target.value;

                            // kalau user hapus +62, tambahkan lagi
                            if (!val.startsWith("+62")) {
                              val = "+62" + val.replace(/^(\+62|62|0)/, "");
                            }

                            field.onChange(val);
                          }}
                        />
                      )}
                    />
                  </Skeleton>

                  <Skeleton className="rounded-lg" isLoaded={!!dataUser}>
                    <Controller
                      control={control}
                      name="address"
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          errorMessage={errors.address?.message}
                          isInvalid={!!errors.address}
                          label="Alamat Lengkap"
                          minRows={3}
                          placeholder="Masukkan alamat lengkap"
                          startContent={
                            <MdLocationPin className="h-4 w-4 text-gray-400" />
                          }
                          variant="bordered"
                        />
                      )}
                    />
                  </Skeleton>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                className="flex-1"
                type="button"
                variant="bordered"
                onPress={() => router.back()}
              >
                Batal
              </Button>
              <Button
                className="flex-1 text-white"
                color="success"
                disabled={isPendingUpdateUser}
                isLoading={isPendingUpdateUser}
                type="submit"
              >
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProfileForm;
