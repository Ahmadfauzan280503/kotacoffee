"use client";

import { Button } from "@heroui/button";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  RadioGroup,
  Skeleton,
  Textarea,
  addToast,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import {
  FiCreditCard,
  FiMapPin,
  FiSmartphone,
  FiShoppingCart,
  FiCheckCircle,
} from "react-icons/fi";
import { FaQrcode } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { FaCheck } from "react-icons/fa";
import { Controller } from "react-hook-form";

import CartItem from "../cart-item";
import { CustomRadio } from "../custom-radio";

import useOrder from "@/hooks/useOrder";
import { rupiahFormat } from "@/utils/rupiahFormat";
import useProfile from "@/hooks/useProfile";
import useCart from "@/hooks/useCart";
import { TCartItem } from "@/types/cart";

const Checkout = () => {
  const router = useRouter();
  const { dataUser, isLoadingUser } = useProfile();
  const { dataCarts, isLoadingCarts } = useCart();
  const {
    // form
    control,
    handleSubmit,
    setValue,
    errors,
    // create order
    handleCreateOrder,
    isPendingCreateOrder,
    watch,
    mutateGetMidtransToken,
    isPendingGetMidtransToken,
  } = useOrder();

  const [isPaymentVerified, setIsPaymentVerified] = useState(false);
  const [isMockLoading, setIsMockLoading] = useState(false);
  const selectedPaymentMethod = watch("paymentMethod");

  useEffect(() => {
    setIsPaymentVerified(false);
  }, [selectedPaymentMethod]);

  const handlePayment = async () => {
    try {
      const items = dataCarts?.data?.items?.map((item: TCartItem) => ({
        id: item.productId,
        price: item.product?.price,
        quantity: item.quantity,
        name: item.product?.name,
      }));

      const res = await mutateGetMidtransToken({
        amount: total,
        items,
      });

      if (res.success && res.data.token) {
        // @ts-ignore
        window.snap.pay(res.data.token, {
          onSuccess: function (result: any) {
            console.log("payment success", result);
            setIsPaymentVerified(true);
            addToast({
              title: "Pembayaran Berhasil",
              description:
                "Silahkan klik 'Buat Pesan' untuk menyelesaikan pesanan.",
              color: "success",
            });
          },
          onPending: function (result: any) {
            console.log("payment pending", result);
            addToast({
              title: "Pembayaran Tertunda",
              description: "Selesaikan pembayaran Anda di aplikasi pembayaran.",
              color: "warning",
            });
          },
          onError: function (result: any) {
            console.log("payment error", result);
            addToast({
              title: "Pembayaran Gagal",
              description: "Terjadi kesalahan saat memproses pembayaran.",
              color: "danger",
            });
          },
          onClose: function () {
            console.log(
              "customer closed the popup without finishing the payment",
            );
          },
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      addToast({
        title: "Gagal",
        description: "Gagal memulai proses pembayaran.",
        color: "danger",
      });
    }
  };

  const subTotal = dataCarts?.data?.items?.reduce(
    (total: number, item: TCartItem) =>
      total + (item.product?.price || 0) * item.quantity,
    0,
  );

  let shippingFee = 0;

  // set untuk menampung seller unique
  const uniqueSellers = new Set<string>();

  dataCarts?.data?.items.forEach((item: any) => {
    if (item.product?.seller?.storeName) {
      uniqueSellers.add(item.product.seller.storeName);
    }
  });
  shippingFee = uniqueSellers.size * 10000;

  const total = subTotal + shippingFee;

  useEffect(() => {
    if (dataUser) {
      setValue("address", dataUser?.address || "");
    }
  }, [dataUser]);

  return (
    <form onSubmit={handleSubmit(handleCreateOrder)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="col-span-2 space-y-4">
          {/* Alamat */}
          <Card radius="sm" shadow="sm">
            <CardHeader>
              <FiMapPin className="w-5 h-5 text-success mr-2" />
              <h2 className="text-xl lg:text-2xl font-semibold">Alamat</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-1">
                <Skeleton className="rounded-md" isLoaded={!isLoadingUser}>
                  <Controller
                    control={control}
                    name="address"
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        errorMessage={errors.address?.message}
                        isInvalid={!!errors.address}
                        label="Alamat"
                        placeholder="Masukkan alamat"
                        variant="bordered"
                      />
                    )}
                  />
                </Skeleton>
              </div>
            </CardBody>
          </Card>

          {/* Keranjang Belanja */}
          <Card radius="sm" shadow="sm">
            <CardHeader>
              <FiShoppingCart className="w-5 h-5 text-success mr-2" />
              <h2 className="text-xl lg:text-2xl font-semibold">
                Keranjang Belanja{" "}
                {dataCarts?.data?._count?.items &&
                  `(${dataCarts?.data?._count?.items} item)`}
              </h2>
            </CardHeader>
            <CardBody>
              <div className="flex items-center justify-between flex-col gap-4">
                {isLoadingCarts ? (
                  <Skeleton
                    className="w-full rounded-md h-24"
                    isLoaded={!!dataCarts?.data?.items}
                  />
                ) : (
                  dataCarts?.data?.items?.map((item: TCartItem) => (
                    <CartItem key={item?.id} isCheckout item={item} />
                  ))
                )}

                {!dataCarts?.data?.items?.length && (
                  <Skeleton
                    className="w-full rounded-md h-24"
                    isLoaded={!isLoadingCarts}
                  >
                    <div className="w-full flex items-center justify-center flex-col gap-4">
                      <p className="text-slate-600 font-semibold">
                        Silahkan pilih produk yang ingin dibeli
                      </p>
                      <Button
                        className="text-white"
                        color="success"
                        onPress={() => router.push("/")}
                      >
                        Belanja Sekarang
                      </Button>
                    </div>
                  </Skeleton>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Metode Pembayaran */}
          <Card radius="sm" shadow="sm">
            <CardHeader>
              <FiCreditCard className="w-5 h-5 text-success mr-2" />
              <h2 className="text-xl lg:text-2xl font-semibold">
                Metode Pembayaran
              </h2>
            </CardHeader>
            <CardBody>
              <Controller
                control={control}
                name="paymentMethod"
                render={({ field }) => (
                  <RadioGroup
                    className="flex flex-row gap-4"
                    errorMessage={errors.paymentMethod?.message}
                    isInvalid={!!errors.paymentMethod}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                      <CustomRadio description="Scan QR Code" value="QRIS">
                        <div className="flex items-center gap-2">
                          <FaQrcode className="w-4 h-4 text-success" />
                          <span>QRIS</span>
                        </div>
                      </CustomRadio>
                      <CustomRadio
                        description="Transfer Manual"
                        value="BANK_TRANSFER"
                      >
                        <div className="flex items-center gap-2">
                          <FiCreditCard className="w-4 h-4 text-success" />
                          <span>Transfer Bank</span>
                        </div>
                      </CustomRadio>
                      <CustomRadio
                        description="OVO, GoPay, Dana"
                        value="E_WALLET"
                      >
                        <div className="flex items-center gap-2">
                          <FiSmartphone className="w-4 h-4 text-success" />
                          <span>E-wallet</span>
                        </div>
                      </CustomRadio>
                    </div>
                  </RadioGroup>
                )}
              />
            </CardBody>
          </Card>

          {/* Payment Display Section */}
          {selectedPaymentMethod && (
            <Card border-color="success" radius="sm" shadow="sm">
              <CardHeader className="flex flex-col items-start gap-1 pb-2">
                <h3 className="text-lg font-bold">Instruksi Pembayaran</h3>
                <p className="text-xs text-foreground-500">
                  Selesaikan pembayaran Anda untuk melanjutkan pesanan.
                </p>
              </CardHeader>
              <CardBody>
                <div className="flex flex-col md:flex-row items-center gap-6 justify-center p-4 bg-default-50 rounded-xl">
                  {selectedPaymentMethod === "QRIS" && (
                    <div className="flex flex-col items-center gap-4 w-full">
                      <div className="flex items-center justify-between w-full bg-white p-4 rounded-xl shadow-sm border border-success/20">
                        <div className="flex flex-col">
                          <span className="text-xs text-foreground-500 font-medium">
                            Pembayaran via
                          </span>
                          <span className="font-bold text-lg text-success">
                            QRIS (QR Code)
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <img
                            alt="QRIS"
                            className="h-6 object-contain"
                            src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-md border-2 border-dashed border-success/30 w-full max-w-[320px]">
                        <div className="relative">
                          <FaQrcode className="w-32 h-32 text-slate-200" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Button
                              className="font-bold text-white px-8"
                              color="success"
                              isLoading={isPendingGetMidtransToken}
                              variant="shadow"
                              onPress={handlePayment}
                            >
                              Tampilkan QR Code
                            </Button>
                          </div>
                        </div>
                        <p className="text-center text-[10px] text-foreground-400">
                          Klik tombol di atas untuk menggenerate QR Code
                          transaksi aman.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 w-full">
                        <div className="bg-success/5 p-2 rounded-lg border border-success/10 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                          <span className="text-[10px] font-bold text-success/80">
                            Real-time Verification
                          </span>
                        </div>
                        <div className="bg-success/5 p-2 rounded-lg border border-success/10 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-success" />
                          <span className="text-[10px] font-bold text-success/80">
                            Secure Payment
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === "E_WALLET" && (
                    <div className="flex flex-col gap-4 w-full">
                      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-5 rounded-2xl border border-primary/20 shadow-inner">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest text-primary font-black">
                              Digital Wallet
                            </span>
                            <span className="text-xl font-bold">
                              E-Wallet Payment
                            </span>
                          </div>
                          <FiSmartphone className="text-3xl text-primary animate-bounce-slow" />
                        </div>

                        <div className="space-y-3 mb-4">
                          <p className="text-xs text-foreground-600 leading-relaxed bg-white/50 p-2 rounded-lg border border-white/80">
                            Bayar instan menggunakan saldo smartphone Anda.
                            Mendukung berbagai platform populer:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <div className="bg-white px-3 py-1 rounded-full shadow-sm text-[10px] font-bold text-blue-600 border border-blue-100 italic">
                              GoPay
                            </div>
                            <div className="bg-white px-3 py-1 rounded-full shadow-sm text-[10px] font-bold text-purple-600 border border-purple-100 italic">
                              OVO
                            </div>
                            <div className="bg-white px-3 py-1 rounded-full shadow-sm text-[10px] font-bold text-blue-500 border border-blue-50 italic font-black uppercase">
                              DANA
                            </div>
                            <div className="bg-white px-3 py-1 rounded-full shadow-sm text-[10px] font-bold text-red-500 border border-red-50 italic">
                              ShopeePay
                            </div>
                          </div>
                        </div>

                        <Button
                          className="w-full font-black text-white shadow-lg shadow-primary/30 py-6"
                          color="primary"
                          isLoading={isPendingGetMidtransToken}
                          startContent={<FiSmartphone />}
                          variant="solid"
                          onPress={handlePayment}
                        >
                          BAYAR DENGAN E-WALLET
                        </Button>
                      </div>

                      <div className="flex justify-between items-center px-2">
                        <span className="text-xs font-semibold text-foreground-500 italic">
                          Total Tagihan:
                        </span>
                        <span className="text-xl font-black text-primary tracking-tighter">
                          {rupiahFormat(total)}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === "BANK_TRANSFER" && (
                    <div className="flex flex-col gap-3 w-full">
                      <div className="p-4 border-2 border-dashed border-success/30 rounded-xl bg-success/5">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-sm font-semibold text-foreground-500">
                              Seabank
                            </p>
                            <p className="text-xs text-foreground-400">
                              Atas Nama: Ahmad Fauzan
                            </p>
                          </div>
                          <span className="text-[10px] bg-success/20 text-success px-2 py-0.5 rounded-full font-bold">
                            UTAMA
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-foreground-500 mb-1">
                          Nomor Rekening
                        </p>
                        <p className="text-2xl font-black tracking-widest text-success">
                          1234 5678 9012
                        </p>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Total Pembayaran:</span>
                        <span className="font-bold text-lg">
                          {rupiahFormat(total)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-4 max-w-[300px] w-full">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        1. Lakukan pembayaran sesuai nominal.
                      </p>
                      <p className="text-sm font-medium">
                        2. Tunggu sebentar atau klik verifikasi.
                      </p>
                      <p className="text-sm font-medium">
                        3. Jika sudah, klik 'Buat Pesan'.
                      </p>
                    </div>
                    {selectedPaymentMethod === "BANK_TRANSFER" && (
                      <Button
                        className="w-full font-bold"
                        color={isPaymentVerified ? "success" : "primary"}
                        isDisabled={isPaymentVerified}
                        isLoading={isMockLoading}
                        startContent={
                          isPaymentVerified ? (
                            <FiCheckCircle />
                          ) : (
                            <FiCreditCard />
                          )
                        }
                        variant={isPaymentVerified ? "flat" : "solid"}
                        onPress={handlePayment}
                      >
                        {isPaymentVerified
                          ? "Pembayaran Terverifikasi"
                          : "Bayar Sekarang"}
                      </Button>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Right */}
        <div className="lg:col-span-1 col-span-2">
          <Card radius="sm" shadow="sm">
            <CardHeader>
              <h2 className="text-xl font-semibold">Ringkasan Pesanan</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({dataCarts?.data?._count?.items} item)</span>
                  <span>
                    {isLoadingCarts ? (
                      <Skeleton className="w-32 h-6 rounded-md" />
                    ) : (
                      rupiahFormat(subTotal)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Ongkos Kirim</span>
                  <span>
                    {isLoadingCarts ? (
                      <Skeleton className="w-32 h-6 rounded-md" />
                    ) : (
                      rupiahFormat(shippingFee)
                    )}
                  </span>
                </div>
                <Divider />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-success">
                    {isLoadingCarts ? (
                      <Skeleton className="w-32 h-6 rounded-md" />
                    ) : (
                      rupiahFormat(total)
                    )}
                  </span>
                </div>
              </div>

              <div className="bg-warning/10 p-3 rounded-lg my-4">
                <p className="text-sm text-warning font-medium">
                  ✨ Hemat Rp 5.000
                </p>
                <p className="text-xs text-foreground-500">
                  Pembelian Pesan Online
                </p>
              </div>

              <Button
                className="text-white w-full"
                color="success"
                disabled={isPendingCreateOrder || !isPaymentVerified}
                isLoading={isPendingCreateOrder}
                startContent={!isPendingCreateOrder && <FaCheck />}
                type="submit"
              >
                {isPaymentVerified ? "Buat Pesan" : "Selesaikan Pembayaran"}
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </form>
  );
};

export default Checkout;
