"use client";

import { Card, CardBody, Spinner } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { FaMapPin, FaStar } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";

import { MagicCard } from "./ui/magic-card";

import { rupiahFormat } from "@/utils/rupiahFormat";
import { TProductResponse } from "@/types/product";
import useCart from "@/hooks/useCart";

const ProductCard = ({ product }: { product: TProductResponse }) => {
  const { name, price, imageUrl, seller } = product;
  const { mutateAddToCart, isPendingAddToCart } = useCart();
  // const discountedPrice = product.discount ? product.price - (product.price * product.discount) / 100 : product.price;

  return (
    <MagicCard
      className="p-1 cursor-pointer flex-col shadow-2xl rounded-2xl border-none"
      gradientColor={"#22c55e10"}
      gradientFrom={"#22c55e"}
      gradientSize={300}
      gradientTo={"#16a34a"}
    >
      <Card
        as={Link}
        className="group overflow-hidden bg-black/40 backdrop-blur-sm border-none transition-all duration-300 rounded-xl"
        href={`/product/${product.id}`}
        shadow="none"
      >
        <div className="relative">
          <Image
            alt={name}
            className="w-full h-32 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            height={500}
            src={
              imageUrl
                ? imageUrl.startsWith("http") || imageUrl.startsWith("/")
                  ? imageUrl
                  : `/images/${imageUrl}`
                : "/images/coffee/Coffee 1.jpg"
            }
            unoptimized={!!imageUrl && imageUrl.includes("supabase.co")}
            width={500}
          />
        </div>

        <CardBody className="p-2">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground line-clamp-2">
              {name}
            </h3>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <FaStar className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-foreground-500">{4.9}</span>
                <span className="text-xs text-foreground-500">({100})</span>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 text-xs text-foreground-500 bg-black/20 p-1.5 rounded-lg border border-white/5">
              <FaMapPin className="w-3.5 h-3.5 text-success animate-pulse" />
              <span className="truncate font-medium">
                {seller?.storeName ||
                  seller?.store_name ||
                  "Jl. A.P. Pettarani"}{" "}
                • {seller?.storeLocation || seller?.store_location || "Cabang"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-success">
                  {rupiahFormat(price)}
                </span>
                <span className="text-xs font-medium text-foreground-400">
                  / {product?.Unit?.symbol || "pcs"}
                </span>
                {/* {discount && (
                  <span className="text-sm text-foreground-500 line-through">
                    Rp {price.toLocaleString("id-ID")}
                  </span>
                )} */}
              </div>
            </div>

            <button
              className="w-full mt-3 text-white bg-success hover:bg-success-400 transition-colors duration-300 rounded-lg cursor-pointer flex items-center justify-center py-2 px-1 lg:px-4 gap-1 text-xs lg:text-sm disabled:bg-success-400 shrinik-0 text-center"
              disabled={isPendingAddToCart}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                mutateAddToCart({
                  payload: {
                    productId: product.id,
                    quantity: 1,
                    price: product.price,
                  },
                });
              }}
            >
              {isPendingAddToCart ? (
                <Spinner color="white" size="sm" />
              ) : (
                <FiShoppingCart className="w-4 h-4 mr-2 hidden lg:block" />
              )}
              Tambah ke Keranjang
            </button>
          </div>
        </CardBody>
      </Card>
    </MagicCard>
  );
};

export default ProductCard;
