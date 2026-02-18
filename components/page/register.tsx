"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Input,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import Link from "next/link";
import { Controller } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import ModalTerms from "./modal-terms";

import useRegister from "@/hooks/useRegister";

const Register = () => {
  const {
    isVisiblePassword,
    setIsVisiblePassword,
    isVisibleConfirmPassword,
    setIsVisibleConfirmPassword,
    agreeToTerms,
    setAgreeToTerms,

    handleRegister,
    isPendingRegister,

    control,
    handleSubmit,
    errors,
  } = useRegister();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-col items-center pt-8">
        <h2 className="text-2xl font-bold">Daftar</h2>
        <p className="text-foreground-500 text-sm">
          Buat akun baru untuk mulai berbelanja sayuran segar
        </p>
      </CardHeader>
      <CardBody>
        <form className="space-y-3" onSubmit={handleSubmit(handleRegister)}>
          <div className="space-y-1">
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  {...field}
                  autoFocus
                  isInvalid={!!errors.name}
                  label="Nama Lengkap"
                  placeholder="Masukkan nama lengkap"
                  type="text"
                  variant="bordered"
                />
              )}
            />
            {errors.name && (
              <p className="text-danger text-xs">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Controller
              control={control}
              name="username"
              render={({ field }) => (
                <Input
                  {...field}
                  isInvalid={!!errors.username}
                  label="Username"
                  placeholder="Masukkan username"
                  type="text"
                  variant="bordered"
                />
              )}
            />
            {errors.username && (
              <p className="text-danger text-xs">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Input
                  {...field}
                  isInvalid={!!errors.email}
                  label="Email"
                  placeholder="example@email.com"
                  type="email"
                  variant="bordered"
                />
              )}
            />
            {errors.email && (
              <p className="text-danger text-xs">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <Input
                  {...field}
                  errorMessage={errors.phone?.message}
                  isInvalid={!!errors.phone}
                  label="Nomor Telepon"
                  placeholder="+62 8123456789"
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
            {errors.phone && (
              <p className="text-danger text-xs">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Controller
              control={control}
              name="address"
              render={({ field }) => (
                <Textarea
                  {...field}
                  isInvalid={!!errors.address}
                  label="Alamat"
                  placeholder="Masukkan alamat"
                  variant="bordered"
                />
              )}
            />
            {errors.address && (
              <p className="text-danger text-xs">{errors.address.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <div className="relative">
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <Input
                    {...field}
                    endContent={
                      <button
                        aria-label="toggle password visibility"
                        className="focus:outline-solid outline-transparent"
                        type="button"
                        onClick={() => setIsVisiblePassword(!isVisiblePassword)}
                      >
                        {isVisiblePassword ? (
                          <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <FaEye className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    isInvalid={!!errors.password}
                    label="Password"
                    placeholder="Enter your password"
                    type={isVisiblePassword ? "text" : "password"}
                    variant="bordered"
                  />
                )}
              />
            </div>
            {errors.password && (
              <p className="text-danger text-xs">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <div className="relative">
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field }) => (
                  <Input
                    {...field}
                    className="w-full"
                    endContent={
                      <button
                        aria-label="toggle password visibility"
                        className="focus:outline-solid outline-transparent"
                        type="button"
                        onClick={() =>
                          setIsVisibleConfirmPassword(!isVisibleConfirmPassword)
                        }
                      >
                        {isVisibleConfirmPassword ? (
                          <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <FaEye className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    isInvalid={!!errors.confirmPassword}
                    label="Konfirmasi Password"
                    placeholder="Enter your password"
                    type={isVisibleConfirmPassword ? "text" : "password"}
                    variant="bordered"
                  />
                )}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-danger text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={agreeToTerms}
              id="terms"
              onChange={() => setAgreeToTerms(!agreeToTerms)}
            />
            <label className="text-sm" htmlFor="terms">
              Saya setuju dengan{" "}
              <button
                className="text-primary hover:underline cursor-pointer"
                type="button"
                onClick={onOpenChange}
              >
                syarat dan ketentuan
              </button>
            </label>
          </div>
          <ModalTerms isOpen={isOpen} onOpenChange={onOpenChange} />
          <Button
            className="w-full text-white disabled:bg-green-500/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            color="success"
            disabled={!agreeToTerms || isPendingRegister}
            isLoading={isPendingRegister}
            type="submit"
          >
            Daftar
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-foreground-500">
            Sudah punya akun?{" "}
            <Link
              className="text-primary hover:underline font-medium"
              href="/auth/login"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

export default Register;
