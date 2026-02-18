"use client";

import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import Link from "next/link";
import { Controller } from "react-hook-form";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";

import useLogin from "@/hooks/useLogin";

const Login = () => {
  const {
    isVisiblePassword,
    setIsVisiblePassword,
    control,
    handleSubmit,
    errors,
    handleLogin,
    isPendingLogin,
  } = useLogin();

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-col items-center pt-8">
        <h2 className="text-2xl font-bold">Masuk</h2>
        <p className="text-foreground-500 text-sm">
          Masuk untuk mulai berbelanja sayuran segar
        </p>
      </CardHeader>
      <CardBody>
        <form className="space-y-3" onSubmit={handleSubmit(handleLogin)}>
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

          <Button
            className="w-full text-white disabled:bg-green-500/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            color="success"
            disabled={isPendingLogin}
            isLoading={isPendingLogin}
            type="submit"
          >
            Masuk
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-default-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-content1 px-2 text-foreground-500">
              Atau masuk dengan
            </span>
          </div>
        </div>

        <Button
          className="w-full flex items-center justify-center gap-2"
          variant="bordered"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <FaGoogle className="text-danger" />
          Google
        </Button>

        <div className="mt-6 text-center">
          <p className="text-sm text-foreground-500">
            Belum punya akun?{" "}
            <Link
              className="text-primary hover:underline font-medium"
              href="/auth/register"
            >
              Daftar di sini
            </Link>
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

export default Login;
