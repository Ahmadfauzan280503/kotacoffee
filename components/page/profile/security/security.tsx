"use client";

import React from "react";
import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { FaEye, FaEyeSlash, FaKey, FaUserShield } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";

import useChangePassword from "@/hooks/useChangePassword";

const Security = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    errors,
    handleChangePassword,
    isPendingChangePassword,
    // visibility
    isVisibleOldPassword,
    setIsVisibleOldPassword,
    isVisibleNewPassword,
    setIsVisibleNewPassword,
    isVisibleConfirmPassword,
    setIsVisibleConfirmPassword,
  } = useChangePassword();

  return (
    <div className="lg:col-span-2">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col items-start">
          <h2 className="text-xl flex items-center gap-2">
            <FaUserShield className="h-5 w-5 text-emerald-600" />
            Keamanan
          </h2>
          <p className="text-gray-600 text-sm">
            Perbarui kata sandi Anda di sini
          </p>
        </CardHeader>

        <CardBody>
          <form
            className="space-y-8"
            onSubmit={handleSubmit(handleChangePassword)}
          >
            {/* Basic Information */}
            <div className="space-y-6">
              <div>
                <div className="grid grid-cols-1 gap-4">
                  <Controller
                    control={control}
                    name="oldPassword"
                    render={({ field }) => (
                      <Input
                        {...field}
                        endContent={
                          <button
                            aria-label="toggle password visibility"
                            className="focus:outline-solid outline-transparent"
                            type="button"
                            onClick={() =>
                              setIsVisibleOldPassword(!isVisibleOldPassword)
                            }
                          >
                            {isVisibleOldPassword ? (
                              <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                              <FaEye className="text-2xl text-default-400 pointer-events-none" />
                            )}
                          </button>
                        }
                        errorMessage={errors.oldPassword?.message}
                        isInvalid={!!errors.oldPassword}
                        label="Kata Sandi Lama"
                        placeholder="Masukkan kata sandi lama"
                        startContent={
                          <FaKey className="h-4 w-4 text-gray-400" />
                        }
                        type={isVisibleOldPassword ? "text" : "password"}
                        variant="bordered"
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="newPassword"
                    render={({ field }) => (
                      <Input
                        {...field}
                        endContent={
                          <button
                            aria-label="toggle password visibility"
                            className="focus:outline-solid outline-transparent"
                            type="button"
                            onClick={() =>
                              setIsVisibleNewPassword(!isVisibleNewPassword)
                            }
                          >
                            {isVisibleNewPassword ? (
                              <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                              <FaEye className="text-2xl text-default-400 pointer-events-none" />
                            )}
                          </button>
                        }
                        errorMessage={errors.newPassword?.message}
                        isInvalid={!!errors.newPassword}
                        label="Kata Sandi Baru"
                        placeholder="Masukkan kata sandi baru"
                        startContent={
                          <FaKey className="h-4 w-4 text-gray-400" />
                        }
                        type={isVisibleNewPassword ? "text" : "password"}
                        variant="bordered"
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <Input
                        {...field}
                        endContent={
                          <button
                            aria-label="toggle password visibility"
                            className="focus:outline-solid outline-transparent"
                            type="button"
                            onClick={() =>
                              setIsVisibleConfirmPassword(
                                !isVisibleConfirmPassword,
                              )
                            }
                          >
                            {isVisibleConfirmPassword ? (
                              <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                              <FaEye className="text-2xl text-default-400 pointer-events-none" />
                            )}
                          </button>
                        }
                        errorMessage={errors.confirmPassword?.message}
                        isInvalid={!!errors.confirmPassword}
                        label="Konfirmasi Kata Sandi Baru"
                        placeholder="Masukkan konfirmasi kata sandi baru"
                        startContent={
                          <FaKey className="h-4 w-4 text-gray-400" />
                        }
                        type={isVisibleConfirmPassword ? "text" : "password"}
                        variant="bordered"
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button className="flex-1" type="button" variant="bordered">
                Batal
              </Button>
              <Button
                className="flex-1 text-white"
                color="success"
                disabled={isPendingChangePassword}
                isLoading={isPendingChangePassword}
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

export default Security;
