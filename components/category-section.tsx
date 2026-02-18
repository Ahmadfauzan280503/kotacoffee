"use client";

import { Card, CardBody, Skeleton } from "@heroui/react";
import Link from "next/link";
import React from "react";
import { FaCoffee } from "react-icons/fa";
import { GiCupcake } from "react-icons/gi";
import { IoFastFood } from "react-icons/io5";

import { TCategory } from "@/types/category";
import useCategory from "@/hooks/useCategory";

const CategorySection = () => {
  const { dataCategories, isLoadingCategories } = useCategory();

  // Grouping logic with icons
  const groupedCategories = React.useMemo(() => {
    if (!dataCategories?.categories) return [];

    const coffeeGroup = {
      id: "coffee-group",
      name: "Coffee",
      icon: <FaCoffee className="text-success" size={60} />,
      productCount: 0,
      link: "/explore?category_group=coffee",
    };

    const nonCoffeeGroup = {
      id: "non-coffee-group",
      name: "Non Coffee",
      icon: <GiCupcake className="text-success" size={60} />,
      productCount: 0,
      link: "/explore?category_group=non-coffee",
    };

    const foodGroup = {
      id: "food-group",
      name: "Food",
      icon: <IoFastFood className="text-success" size={60} />,
      productCount: 0,
      link: "/explore?category_group=food",
    };

    dataCategories.categories.forEach((cat: TCategory) => {
      const name = cat.name.toLowerCase();
      const count = cat.products?.length || 0;

      if (name.includes("coffee")) {
        coffeeGroup.productCount += count;
      } else if (
        name.includes("food") ||
        name.includes("makanan") ||
        name.includes("roti") ||
        name.includes("kentang")
      ) {
        foodGroup.productCount += count;
      } else {
        nonCoffeeGroup.productCount += count;
      }
    });

    return [coffeeGroup, nonCoffeeGroup, foodGroup];
  }, [dataCategories]);

  return (
    <section className="py-8" id="categories">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Kategori Menu
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoadingCategories ? (
            <>
              {Array.from({ length: 3 }, (_, index) => (
                <Skeleton key={index} className="w-full h-[200px] rounded-lg" />
              ))}
            </>
          ) : null}
          {!isLoadingCategories &&
            groupedCategories.map((group) => (
              <Card
                key={group.id}
                as={Link}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300"
                href={group.link}
                shadow="sm"
              >
                <CardBody className="p-6 text-center">
                  <div className="mb-4 flex justify-center items-center w-24 h-24 mx-auto rounded-full bg-success/10 border-2 border-success/30 group-hover:scale-110 group-hover:border-success transition-all duration-300">
                    {group.icon}
                  </div>
                  <h3 className="font-bold text-xl text-foreground mb-2">
                    {group.name}
                  </h3>
                  <p className="text-xs font-semibold text-success">
                    {group.productCount} Produk
                  </p>
                </CardBody>
              </Card>
            ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
