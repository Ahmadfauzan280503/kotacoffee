"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { FaShieldAlt, FaShoppingCart } from "react-icons/fa";
import { FiTruck } from "react-icons/fi";
import { LuLeaf } from "react-icons/lu";
import Image from "next/image";
import Link from "next/link";
import { useDisclosure } from "@heroui/react";

import ModalConfirmBeseller from "./modal-confirm-beseller";

import useProfile from "@/hooks/useProfile";
import heroVegetables from "@/public/images/Halaman page utama.png";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { AnimatedGroup } from "@/components/motion-primitives/animated-group";

const HeroSection = () => {
  const { dataUser } = useProfile();
  const { isOpen, onOpenChange } = useDisclosure();
  const isVerifiedSeller = dataUser?.Seller?.[0]?.verified;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="relative bg-background py-16 overflow-hidden min-h-[500px] flex items-center justify-center">
        <div className="container mx-auto px-4 animate-pulse">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="h-12 w-3/4 bg-success/10 rounded-lg" />
              <div className="h-12 w-1/2 bg-success/5 rounded-lg" />
              <div className="h-24 w-full bg-foreground/5 rounded-lg" />
              <div className="flex gap-4">
                <div className="h-12 w-32 bg-success/20 rounded-lg" />
                <div className="h-12 w-32 bg-foreground/5 rounded-lg" />
              </div>
            </div>
            <div className="h-[400px] w-full bg-success/5 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative bg-gradient py-16 overflow-hidden">
      <ModalConfirmBeseller isOpen={isOpen} onOpenChange={onOpenChange} />

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Text effect start */}
            <TextEffect
              className="text-4xl lg:text-5xl font-bold text-foreground leading-tight"
              delay={0.5}
              per="char"
              preset="fade"
            >
              KotaCoffee.id
            </TextEffect>
            <TextEffect
              className="text-4xl lg:text-5xl font-bold block bg-gradient-to-r from-green-500 to-green-300 bg-clip-text text-transparent py-2 -mt-8"
              delay={0.5}
              per="char"
              preset="fade"
            >
              Kualitas Terbaik
            </TextEffect>
            <TextEffect
              className="text-lg text-foreground-500 max-w-md"
              delay={1}
              per="char"
              segmentTransition={{
                duration: 0.3,
                type: "spring",
                bounce: 0.3,
              }}
            >
              Dapatkan kualitas terbaik dari produk kami. Dikirim hari ini,
              sampai besok pagi.
            </TextEffect>
            {/* Text effect end */}

            <AnimatedGroup
              className="flex flex-col lg:flex-row gap-4"
              preset="slide"
              variants={{
                container: {
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.05,
                    },
                  },
                },
                item: {
                  hidden: { opacity: 0, y: 40 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 1.2,
                      type: "spring",
                      bounce: 0.3,
                    },
                  },
                },
              }}
            >
              <Button
                as={Link}
                className="text-white w-full"
                color="success"
                href="#products"
                size="lg"
                variant="shadow"
              >
                <FaShoppingCart className="w-5 h-5 mr-2" />
                Mulai Belanja
              </Button>
              {!isVerifiedSeller && dataUser?.role !== "superadmin" ? (
                <Button
                  as={Link}
                  className="w-full font-bold border-success text-success hover:bg-success hover:text-white transition-all"
                  href="#products"
                  size="lg"
                  variant="bordered"
                >
                  Get Started
                </Button>
              ) : null}
            </AnimatedGroup>

            {/* Features */}

            <AnimatedGroup
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8"
              preset="slide"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-green-500/10 p-2 rounded-lg">
                  <FiTruck className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">
                    Gratis Ongkir
                  </p>
                  <p className="text-xs text-muted-foreground">Min. Rp 50rb</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-green-500/10 p-2 rounded-lg">
                  <FaShieldAlt className="w-5 h-5 text-green-800" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">
                    Jaminan Segar
                  </p>
                  <p className="text-xs text-muted-foreground">100% Fresh</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-orange-500/10 p-2 rounded-lg">
                  <LuLeaf className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">
                    Produk Organik
                  </p>
                  <p className="text-xs text-muted-foreground">Tersedia</p>
                </div>
              </div>
            </AnimatedGroup>
          </div>

          {/* Right Image */}
          <div className="relative">
            <AnimatedGroup
              className="relative z-10"
              preset="slide"
              variants={{
                item: {
                  hidden: { opacity: 0, y: 40 },
                  visible: {
                    opacity: 1,
                    y: 0,

                    transition: {
                      duration: 1.2,
                      type: "spring",
                      bounce: 0.3,
                    },
                  },
                },
              }}
            >
              <div className=" bg-gradient-to-br from-success/20 to-success-200/10 dark:from-emerald-500/10 dark:to-emerald-500/20 rounded-3xl p-4">
                <Image
                  priority
                  alt="Sayuran Segar"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                  src={heroVegetables}
                />
              </div>
            </AnimatedGroup>

            {/* Background Decoration */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-fresh/30 to-organic/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-gradient-to-tr from-vegetable/20 to-fresh/20 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
