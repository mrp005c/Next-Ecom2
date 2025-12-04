"use client";
import React, { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoMenuOutline, IoReload } from "react-icons/io5";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import AdminHeader from "./AdminHeader";
import { FaCartPlus } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import CartProductItem from "./modules/cartProduct";
import { fetchCart } from "@/store/cartSlice";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { cartItems, loading, error } = useSelector((state) => state.cart);
  const { data: session, status } = useSession();
  const { setTheme } = useTheme();
  const cartMenu = useRef(null);

  const handleCartLoad = useCallback(async () => {
    if (session) {
      const userId = session.user.id;
      dispatch(fetchCart(userId));
    }
  }, [session, dispatch]);

  useEffect(() => {
    handleCartLoad();
  }, [handleCartLoad]);

  useEffect(() => {
    cartMenu.current.classList.remove("open");
  }, [pathname]);

  // cart remove
  const handleRomoveFromCart = async (newCartItem) => {
    if (!session) {
      toast.info("Please Login First.");
      router.push("/login");
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email: session.user.email,
      userId: session.user.id,
      products: newCartItem,
    });

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      const add = await fetch("/api/cart", requestOptions);
      const res = await add.json();
      if (res.success) {
        toast.success(res.message);
        dispatch(fetchCart(session.user.id));
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="flex-center flex-wrap bg-gray200c box-border sticky z-40 top-0 w-full text-foreground">
      <AdminHeader />
      <Toaster />
      {!pathname.toString().startsWith("/admin") && (
        <div className="container mx-auto flex-center px-2 py-3 box-border z-40 relative">
          {/* main nav  */}
          <div className="w-full flex-between ">
            <Link href="/" className="relative h-12 w-[130px]">
              <Image
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="eager"
                src="/ecom.png"
                alt="sitelogo"
              />
            </Link>
            <div className="buttons flex-center gap-2">
              {status === "authenticated" ? (
                <div className="flex-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      className="cursor-pointer relative h-12 w-12"
                    >
                      <Image
                        height={50}
                        width={50}
                        className="object-cover rounded-full "
                        src={session.user.image || "/profilea.jpg"}
                        alt="image"
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                      <DropdownMenuLabel className={"font-semibold"}>
                        My Account
                      </DropdownMenuLabel>
                      <DropdownMenuGroup>
                        <Link href="/dashboard">
                          <DropdownMenuItem className="cursor-pointer">
                            Dashboard
                            <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </Link>

                        {session.user.role === "admin" && (
                          <Link href="/admin">
                            <DropdownMenuItem className="cursor-pointer">
                              Admin Panel
                              <DropdownMenuShortcut>⇧⌘A</DropdownMenuShortcut>
                            </DropdownMenuItem>
                          </Link>
                        )}
                        <DropdownMenuItem disabled>
                          Settings
                          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <Button
                              variant="outline"
                              size="icon"
                              className="bg-background rounded-full"
                            >
                              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                              <span className="sr-only">Toggle theme</span>
                            </Button>
                            Theme
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() => setTheme("light")}
                              >
                                Light
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setTheme("dark")}
                              >
                                Dark
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setTheme("system")}
                              >
                                System
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => signOut()}>
                        Log out
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <>
                  <Link href="/login" className="primary-btn">
                    Log In
                  </Link>{" "}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-background rounded-full"
                      >
                        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                        <span className="sr-only">Toggle theme</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setTheme("light")}>
                        Light
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("dark")}>
                        Dark
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("system")}>
                        System
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
              <Button
                onClick={() => {
                  cartMenu.current.classList.toggle("open");
                }}
                className={"text-accent-foreground"}
                variant={"outline"}
                size={"icon"}
              >
                <FaCartPlus />
              </Button>

              <div className="flex-center flex sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    className="cursor-pointer text-3xl font-bold flex-center rounded-full hover:bg-gray50c active:bg-gray300c transition-all"
                  >
                    <IoMenuOutline />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuLabel>Navigation Links</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <Link href="/#">
                        <DropdownMenuItem className="cursor-pointer">
                          Home
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <Link href="/#about-us">
                        <DropdownMenuItem className="cursor-pointer">
                          About Us
                        </DropdownMenuItem>
                      </Link>

                      <DropdownMenuSeparator />
                      <Link href="/#contact">
                        <DropdownMenuItem className="cursor-pointer">
                          Contact
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <Link href="/products">
                        <DropdownMenuItem className="cursor-pointer">
                          Products
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* sec nav  */}
          <nav className="absolute   sm:flex hidden">
            <ul className="flex-between gap-2">
              <li>
                <Link
                  className="hover:bg-gray400c rounded-md transition-all active:bg-gray700c p-1"
                  href="/"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="hover:bg-gray400c rounded-md transition-all active:bg-gray700c p-1"
                  href="/#about-us"
                >
                  About
                </Link>
              </li>
              {/* <li>
                <Link
                  className="hover:bg-gray400c rounded-md transition-all active:bg-gray700c p-1"
                  // href="/#contact"
                  href="/trial"
                >
                  Trial
                </Link>
              </li> */}
              <li>
                <Link
                  className="hover:bg-gray400c rounded-md transition-all active:bg-gray700c p-1"
                  href="/#contact"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  className="hover:bg-gray400c rounded-md transition-all active:bg-gray700c p-1"
                  href="/products"
                >
                  Products
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
      {/* cart menu */}
      <div
        ref={cartMenu}
        className=" cart-menu box-border max-h-[calc(100vh-150px)] text-accent-foreground bg-accent transition-all p-2 rounded-md  duration-300 z-500 translate-y-[-135%] w-screen max-w-[400px] h-screen absolute right-0 top-full"
      >
        <div className="head bg-violet200c rounded-md flex-between px-2 py-1">
          <h3 className="text-lg font-bold ">Cart</h3>
          <span className="gap-3 flex">
            <Button
              onClick={() => {
                handleCartLoad();
              }}
              className={"text-accent-foreground"}
              variant={"outline"}
              size={"icon-sm"}
            >
              <IoReload />
            </Button>
            <Button
              onClick={() => {
                cartMenu.current.classList.toggle("open");
              }}
              className={"text-accent-foreground"}
              variant={"outline"}
              size={"icon-sm"}
            >
              <RxCross2 />
            </Button>
          </span>
        </div>
        <div className="space-y-2 overflow-auto flex-1 bg-violet100c h-[calc(100%-120px)]">
          {cartItems && cartItems.length > 0 ? (
            cartItems.map((item) => (
              <CartProductItem
                key={item.cartP}
                item={item}
                handleRomoveFromCart={handleRomoveFromCart}
              />
            ))
          ) : (
            <h1>No item to show!</h1>
          )}
        </div>
        <div className="calculate flex-between justify-end text-xs font-bold gap-3 flex-wrap px-2 bg-background py-2 rounded-sm">
          <span>Items: {cartItems && cartItems.length}</span>
          <span>
            Total Price:{" "}
            {cartItems &&
              cartItems.length > 0 &&
              cartItems.reduce((a, b) => a + b.price, 0)}
          </span>
        </div>
        <Link
          href={"/order"}
          className={
            "mx-auto mt-3 flex w-fit  px-3 py-2 rounded-md text-accent bg-accent-foreground "
          }
        >
          Check Out
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
