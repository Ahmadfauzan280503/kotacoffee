"use client";

import { useState } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { MdOutlineReceipt, MdOutlineShoppingCart } from "react-icons/md";
import { clsx } from "clsx";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
  Button,
  useDisclosure,
  Badge,
  Avatar,
  Divider,
  DropdownSection,
} from "@heroui/react";
import { link as linkStyles } from "@heroui/theme";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { FiLogIn, FiLogOut, FiPackage, FiUser } from "react-icons/fi";

import Cart from "./cart";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import useCart from "@/hooks/useCart";
import useProfile from "@/hooks/useProfile";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { dataCarts } = useCart();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { dataUser } = useProfile();

  return (
    <HeroUINavbar
      isBlurred
      isMenuOpen={isMenuOpen}
      maxWidth="xl"
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-2" href="/">
            <Image
              priority
              alt="logo"
              className="object-contain"
              height={40}
              src="/images/logo-kotacoffee.png"
              width={40}
            />
            <div>
              <p className="font-bold text-inherit">Kotacoffee.id</p>
              <p className="text-xs text-default-500">Kopi Trotoar</p>
            </div>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems
            .filter((item) => {
              if (item.href === "/admin/dashboard") {
                return (
                  status === "authenticated" && session?.user?.role === "admin"
                );
              }

              if (item.href === "/dashboard") {
                return false; // Sesuai permintaan, dashboard disembunyikan untuk user biasa
              }

              return true;
            })
            .map((item) => (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    pathname === item.href && "text-success font-medium",
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            ))}
        </ul>
      </NavbarContent>

      <NavbarContent className="hidden lg:flex" justify="end">
        <NavbarItem className="hidden lg:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>

        {status === "authenticated" ? (
          <Dropdown radius="md">
            <Badge
              className="bg-success text-white"
              content={dataCarts?.data?._count?.items}
              isInvisible={(dataCarts?.data?._count?.items ?? 0) <= 0}
            >
              <DropdownTrigger>
                <Button
                  isIconOnly
                  className="flex items-center p-2 justify-center cursor-pointer text-slate-600 dark:text-slate-200"
                  variant="light"
                >
                  <MdOutlineShoppingCart size={22} />
                </Button>
              </DropdownTrigger>
            </Badge>
            <DropdownMenu>
              <DropdownSection
                aria-label="Cart"
                className="h-80 overflow-y-auto"
              >
                <DropdownItem
                  key="cart"
                  isReadOnly
                  className="[&[data-hover=true]]:bg-transparent [&[data-focus=true]]:bg-transparent"
                >
                  <Cart items={dataCarts?.data?.items} />
                </DropdownItem>
              </DropdownSection>
              <DropdownSection>
                <DropdownItem
                  key="Next-button"
                  className="[&[data-hover=true]]:bg-transparent [&[data-focus=true]]:bg-transparent"
                >
                  {dataCarts?.data?.items?.length ? (
                    <div>
                      <Button
                        className="w-full text-white"
                        color="success"
                        size="sm"
                        onPress={() => {
                          router.push(`/checkout/${dataUser?.id}`);
                        }}
                      >
                        Lanjut ke Pembayaran
                      </Button>
                    </div>
                  ) : null}
                </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        ) : null}

        <NavbarItem className="hidden lg:flex">
          {status === "authenticated" ? (
            <Dropdown placement="bottom-start" radius="sm">
              <DropdownTrigger>
                <User
                  as="button"
                  avatarProps={{
                    isBordered: true,
                    src: dataUser?.photo
                      ? dataUser?.photo
                      : `https://ui-avatars.com/api/?name=${session?.user.name}&background=random`,
                  }}
                  className="transition-transform"
                  description={`@${session?.user?.username || session?.user?.name?.split(" ")[0].toLowerCase() || "user"}`}
                  name={session?.user.name}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem
                  key="profile"
                  textValue="Profil"
                  onPress={() => router.push("/profile")}
                >
                  <span className="flex items-center gap-2 w-full">
                    <FiUser />
                    Profil
                  </span>
                </DropdownItem>
                {session?.user?.role === "admin" ? (
                  <DropdownItem
                    key="manage-product"
                    textValue="Kelola Produk"
                    onPress={() => router.push("/dashboard/product")}
                  >
                    <span className="flex items-center gap-2 w-full text-success font-medium">
                      <FiPackage />
                      Kelola Produk
                    </span>
                  </DropdownItem>
                ) : null}
                {session?.user?.role !== "admin" ? (
                  <DropdownItem
                    key="my-order"
                    showDivider
                    textValue="Pesanan Saya"
                    onPress={() => router.push("/dashboard/my-order")}
                  >
                    <span className="flex items-center gap-2 w-full">
                      <MdOutlineReceipt />
                      Pesanan Saya
                    </span>
                  </DropdownItem>
                ) : null}

                <DropdownItem
                  key="logout"
                  color="danger"
                  textValue="Keluar"
                  onPress={() => signOut()}
                >
                  <span className="flex items-center gap-2 w-full">
                    <FiLogOut />
                    Keluar
                  </span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button
              className="text-white"
              color="success"
              onPress={() => router.push("/auth/login")}
            >
              <FiLogIn />
              Masuk
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      {/* Mobile */}
      <NavbarContent className="lg:hidden flex pl-4" justify="end">
        {/* Theme Switch */}
        <NavbarMenuItem>
          <div className="items-center justify-center cursor-pointer text-slate-600 hidden lg:flex">
            <ThemeSwitch />
          </div>
        </NavbarMenuItem>
        <NavbarItem>
          {status === "authenticated" ? (
            <Dropdown radius="md">
              <Badge
                className="bg-success text-white"
                content={dataCarts?.data?._count?.items}
                isInvisible={(dataCarts?.data?._count?.items ?? 0) <= 0}
              >
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    className="flex items-center p-2 justify-center cursor-pointer text-slate-600 dark:text-slate-200"
                    variant="light"
                  >
                    <MdOutlineShoppingCart size={22} />
                  </Button>
                </DropdownTrigger>
              </Badge>
              <DropdownMenu>
                <DropdownSection
                  aria-label="Cart"
                  className="h-80 overflow-y-auto"
                >
                  <DropdownItem
                    key="cart"
                    isReadOnly
                    className="[&[data-hover=true]]:bg-transparent [&[data-focus=true]]:bg-transparent"
                  >
                    <Cart items={dataCarts?.data?.items} />
                  </DropdownItem>
                </DropdownSection>
                <DropdownSection>
                  <DropdownItem
                    key="Next-button"
                    className="[&[data-hover=true]]:bg-transparent [&[data-focus=true]]:bg-transparent"
                  >
                    {dataCarts?.data?.items?.length ? (
                      <div>
                        <Button
                          className="w-full text-white"
                          color="success"
                          size="sm"
                          onPress={() => {
                            router.push(`/checkout/${dataUser?.id}`);
                          }}
                        >
                          Lanjut ke Pembayaran
                        </Button>
                      </div>
                    ) : null}
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button
              className="text-white"
              color="success"
              size="sm"
              onPress={() => router.push("/auth/login")}
            >
              <FiLogIn />
              Masuk
            </Button>
          )}
        </NavbarItem>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="lg:hidden"
        />
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="z-50">
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {/* Navigation items */}
          {siteConfig.navItems
            .filter((item) => {
              if (item.href === "/admin/dashboard") {
                return (
                  status === "authenticated" && session?.user?.role === "admin"
                );
              }

              if (item.href === "/dashboard") {
                return false; // Sesuai permintaan, dashboard disembunyikan untuk user biasa
              }

              return true;
            })
            .map((item, index) => (
              <NavbarMenuItem key={`${item.href}-${index}`}>
                <NextLink
                  className={clsx(
                    "w-full",
                    linkStyles({ color: "foreground" }),
                    pathname === item.href && "text-success font-medium",
                  )}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </NextLink>
              </NavbarMenuItem>
            ))}
          <NavbarMenuItem>
            <div className="flex items-center gap-2">
              <span className="mr-2 text-sm">Theme: </span>
              <ThemeSwitch />
            </div>
          </NavbarMenuItem>

          {/* Authentication */}
          <NavbarMenuItem>
            {status === "authenticated" ? (
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center gap-2 py-2">
                  <Avatar
                    size="sm"
                    src={
                      dataUser?.photo
                        ? dataUser?.photo
                        : `https://ui-avatars.com/api/?name=${session?.user.name}&background=random`
                    }
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {session?.user.name}
                    </span>
                    <span className="text-xs text-default-500">
                      @{session?.user.username}
                    </span>
                  </div>
                </div>

                <Button
                  className="justify-start"
                  variant="light"
                  onPress={() => {
                    router.push("/profile");
                    setIsMenuOpen(false);
                  }}
                >
                  <span className="flex items-center gap-2">
                    <FiUser />
                    Profil
                  </span>
                </Button>
                {session?.user?.role === "admin" ? (
                  <Button
                    className="justify-start text-success font-medium"
                    variant="light"
                    onPress={() => {
                      router.push("/dashboard/product");
                      setIsMenuOpen(false);
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <FiPackage />
                      Kelola Produk
                    </span>
                  </Button>
                ) : null}
                {session?.user?.role !== "admin" ? (
                  <Button
                    className="justify-start"
                    variant="light"
                    onPress={() => {
                      router.push("/dashboard/my-order");
                      setIsMenuOpen(false);
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <MdOutlineReceipt />
                      Pesanan Saya
                    </span>
                  </Button>
                ) : null}
                <Divider />
                <Button
                  className="justify-start"
                  color="danger"
                  variant="light"
                  onPress={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                >
                  <span className="flex items-center gap-2">
                    <FiLogOut />
                    Keluar
                  </span>
                </Button>
              </div>
            ) : null}
          </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
