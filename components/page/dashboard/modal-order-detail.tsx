import {
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { FiBox, FiCheck, FiClock, FiCreditCard, FiTruck } from "react-icons/fi";

import { rupiahFormat } from "@/utils/rupiahFormat";
import { OrderResponse } from "@/types/order";
import useOrder from "@/hooks/useOrder";

const ModalOrderDetail = ({
  isOpen,
  onClose,
  order,
  type,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  order: OrderResponse;
  type: "user" | "seller" | "admin";
  isLoading: boolean;
}) => {
  const {
    mutateIsProcessing,
    isPendingIsProcessing,
    mutateIsDelivered,
    isPendingIsDelivered,
    mutateIsCompleted,
    isPendingIsCompleted,
  } = useOrder();

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen z-50 fixed inset-0 bg-foreground-500/15 backdrop-blur-sm">
        <Spinner color="success" size="lg" />
      </div>
    );

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      scrollBehavior="outside"
      size="2xl"
      onClose={onClose}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center justify-between gap-1 border-b border-b-foreground-300 pr-10">
              <p>Detail Pesanan #{order?.id?.slice(0, 8)}</p>
              <Chip
                color={
                  order?.status === "PENDING"
                    ? "warning"
                    : order?.status === "PAID"
                      ? "success"
                      : order?.status === "FAILED"
                        ? "danger"
                        : order?.status === "PROCESSING"
                          ? "secondary"
                          : order?.status === "COMPLETED"
                            ? "success"
                            : order?.status === "CANCELLED"
                              ? "danger"
                              : "danger"
                }
                variant="shadow"
              >
                {order?.status === "PENDING" && "Pending"}
                {order?.status === "PAID" && "Dibayar"}
                {order?.status === "FAILED" && "Gagal"}
                {order?.status === "PROCESSING" && "Diproses"}
                {order?.status === "DELIVERED" && "Dikirim"}
                {order?.status === "COMPLETED" && "Diterima"}
                {order?.status === "CANCELLED" && "Dibatalkan"}
              </Chip>
            </ModalHeader>
            <ModalBody>
              <div>
                {/* Informasi Pelanggan */}
                <h2 className="my-3 font-semibold">Informasi Pelanggan</h2>
                <table className="w-md">
                  <tbody>
                    <tr>
                      <td className="font-semibold">Nama</td>
                      <td>:</td>
                      <td>{order?.user?.name || "N/A"}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold">Email</td>
                      <td>:</td>
                      <td>{order?.user?.email || "N/A"}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold">Phone</td>
                      <td>:</td>
                      <td>
                        {order?.user?.phone ||
                          (order?.user as any)?.phoneNumber ||
                          "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                {/* Product item */}
                <div className="flex items-center justify-between">
                  <h2 className="my-3 font-semibold">Produk yang Dipesan</h2>
                  {order?.status === "PENDING" && type === "user" ? (
                    <Button
                      as={Link}
                      color="primary"
                      href={`${order?.paymentUrl}`}
                      size="sm"
                      startContent={<FiCreditCard />}
                      target="_blank"
                    >
                      Bayar
                    </Button>
                  ) : null}
                </div>
                {order?.items?.map((item) => (
                  <Card key={item.id} className="mb-2" radius="sm" shadow="sm">
                    <CardBody>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-3">
                          {item.product.imageUrl ||
                          (item.product as any).image_url ? (
                            <Image
                              alt={item.product.name}
                              className="aspect-square object-cover rounded-sm"
                              height={80}
                              src={(() => {
                                const url = (item.product.imageUrl ||
                                  (item.product as any).image_url) as string;

                                return url.startsWith("http") ||
                                  url.startsWith("/")
                                  ? url
                                  : `/images/${url}`;
                              })()}
                              unoptimized={(
                                item.product.imageUrl ||
                                (item.product as any).image_url
                              )?.includes?.("supabase.co")}
                              width={80}
                            />
                          ) : (
                            <div className="w-[80px] h-[80px] bg-gray-200 rounded-sm flex items-center justify-center text-xs text-gray-500">
                              No Image
                            </div>
                          )}
                          <div>
                            <p className="font-semibold">{item.product.name}</p>
                            <p className="text-sm text-foreground-500">
                              {item.quantity}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold">
                            {rupiahFormat(item.price)}
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>

              <Divider className="my-2" />

              {/* Total */}
              <div className="flex justify-between">
                <p className="font-semibold">Ongkir</p>
                <p className="font-semibold">
                  {rupiahFormat(
                    Number(
                      order?.shippingFee || (order as any)?.shipping_fee || 0,
                    ),
                  )}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">Total Harga</p>
                <p className="font-semibold">
                  {rupiahFormat(
                    Number(order?.totalPrice || order?.total_amount || 0),
                  )}
                </p>
              </div>

              {/* Button Action */}
              {type === "seller" || type === "admin" ? (
                <div>
                  <h2 className="my-3 font-semibold">Update Status</h2>
                  <div className="flex items-center gap-2">
                    <Button
                      color={
                        order?.status === "PENDING" ? "warning" : "default"
                      }
                      size="sm"
                      startContent={<FiClock />}
                      variant="bordered"
                    >
                      Pending
                    </Button>
                    <Button
                      color={order?.status === "PAID" ? "success" : "default"}
                      size="sm"
                      startContent={<FiCreditCard />}
                      variant="bordered"
                    >
                      Paid
                    </Button>
                    <Button
                      color={
                        order?.status === "PROCESSING" ? "secondary" : "default"
                      }
                      disabled={order?.status === "PENDING"}
                      isDisabled={isPendingIsProcessing}
                      isLoading={isPendingIsProcessing}
                      size="sm"
                      startContent={!isPendingIsProcessing ? <FiBox /> : null}
                      variant="bordered"
                      onPress={() => {
                        mutateIsProcessing(order?.id);
                      }}
                    >
                      Diproses
                    </Button>
                    <Button
                      color={
                        order?.status === "DELIVERED" ? "primary" : "default"
                      }
                      disabled={order?.status === "PENDING"}
                      isDisabled={isPendingIsDelivered}
                      isLoading={isPendingIsDelivered}
                      size="sm"
                      startContent={!isPendingIsDelivered ? <FiTruck /> : null}
                      variant="bordered"
                      onPress={() => {
                        mutateIsDelivered(order?.id);
                      }}
                    >
                      Dikirim
                    </Button>
                    <Button
                      color={
                        order?.status === "COMPLETED" ? "success" : "default"
                      }
                      disabled={order?.status === "PENDING"}
                      isDisabled={isPendingIsCompleted}
                      isLoading={isPendingIsCompleted}
                      size="sm"
                      startContent={!isPendingIsCompleted ? <FiCheck /> : null}
                      variant="bordered"
                      onPress={() => {
                        mutateIsCompleted(order?.id);
                      }}
                    >
                      Diterima
                    </Button>
                  </div>
                </div>
              ) : null}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalOrderDetail;
