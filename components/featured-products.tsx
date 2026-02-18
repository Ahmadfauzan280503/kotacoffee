"use client";

import { Button, Skeleton } from "@heroui/react";
import Link from "next/link";

import ProductCard from "./product-card";
import { MagicCard } from "./ui/magic-card";

import { TProduct } from "@/types/product";
import useProduct from "@/hooks/useProduct";

const FeatureProduct = () => {
  const { dataFeaturedProducts, isLoadingFeaturedProducts } = useProduct();

  return (
    <section className="py-12 bg-background" id="products">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Produk Unggulan
            </h2>
            <p className="text-foreground-500">
              Nikmati berbagai pilihan Coffee, Non-Coffee, dan Makanan favorit
              Anda
            </p>
          </div>
          <Button
            as={Link}
            className="hover:text-success-300 font-medium"
            color="success"
            href="/explore"
            variant="light"
          >
            Lihat Semua →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoadingFeaturedProducts && (
            <>
              {Array.from({ length: 3 }, (_, index) => (
                <Skeleton
                  key={index}
                  className="w-full lg:h-[400px] h-[350px] rounded-2xl"
                />
              ))}
            </>
          )}
          {dataFeaturedProducts?.data?.slice(0, 3).map((product: TProduct) => (
            <MagicCard
              key={product.id}
              className="p-1 cursor-pointer flex-col shadow-2xl rounded-2xl border-none"
              gradientColor={"#22c55e10"}
              gradientFrom={"#22c55e"}
              gradientSize={300}
              gradientTo={"#16a34a"}
            >
              <ProductCard product={product} />
            </MagicCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureProduct;
