"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams, usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { fetchCart } from "@/store/cartSlice";
// css
import styles from "./id.module.css";
import LoadingOverlay from "@/components/kit/LoadingOverlay";

const ProductPage = ({ id }) => {
  // const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState();
  const [success, setSuccess] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // scroll image
  const [startX, setStartX] = useState(0);
  const [endX, setEndX] = useState(0);
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const pathname = usePathname();

  const handleCartLoad = async () => {
    if (session) {
      const userId = session.user.id;
      dispatch(fetchCart(userId));
    }
  };

  const loadProduct = useCallback(async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    try {
      const data = await fetch(
        `/api/products/product?productId=${id}`,
        requestOptions
      );
      const res = await data.json();

      setSuccess(res.success);
      if (res.success) {
        setItem(res.result);
      }
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  useEffect(() => {
    const a = async () => {
      loadProduct();
    };
    a();
  }, [loadProduct]);

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    setEndX(e.changedTouches[0].clientX);
    if (startX - endX > 50) nextImage(); // swipe left
    if (endX - startX > 50) prevImage(); // swipe right
  };

  const nextImage = () => setImageIndex((c) => (c + 1) % item.image.length);
  const prevImage = () =>
    setImageIndex((c) => (c - 1 + item.image.length) % item.image.length);

  const handleAddToCart = async (newCartItem) => {
    if (!session) {
      toast.info("Please Login First.");
      router.push(`/login?redurl=${encodeURIComponent(pathname)}`);
      // addToGuestCart(newCartItem)
      return;
    }
    setIsLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const withoutid = { ...newCartItem };
    delete withoutid._id;

    const raw = JSON.stringify({
      email: session.user.email,
      userId: session.user.id,
      products: withoutid,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      const add = await fetch("/api/cart", requestOptions);
      const res = await add.json();
      if (res.success) {
        toast.success(res.message, {
          description: new Date().toUTCString(),
          action: {
            label: "Check Out",
            onClick: () => router.push("/order"),
          },
        });

        handleCartLoad();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!success) {
    return notFound();
  }
  return (
    <>
      {" "}
      <LoadingOverlay show={isLoading} message={"Adding to cart"} />
      <Toaster />
      {item ? (
        <div className="w-full mx-auto bg-slate-50 dark:bg-slate-900">
          <div className="flex-center">
            <div className="flex flex-col max-w-[990px] gap-4 w-full bg-gray100c  p-4 box-border rounded-lg transition-all  ">
              <div
                className="h-[350px] w-full z-10 relative bg-gray200c  rounded-lg flex-center select-none"
                // onDragStart={(e) => e.preventDefault()} // disable drag
                draggable="false" // disable image dragging
                style={{ userSelect: "none" }}
              >
                <Image
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="eager"
                  src={item.image[imageIndex] || "/ecom.png"}
                  className="object-cover object-center rounded-lg"
                  alt=""
                  onDragStart={(e) => e.preventDefault()} // disable drag
                  draggable="false" // disable image dragging
                  style={{ userSelect: "none" }}
                />
                <div
                  className={`relative z-30 w-full h-full text-foreground flex-center ${styles.hoverp}`}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <Button
                    onClick={nextImage}
                    variant={"ghost"}
                    size={"icon-lg"}
                    className={`  absolute right-2 text-gray-200 dark:text-gray-200 ring-1 ring-gray-100 ${
                      item.image.length <= 1 ? "hidden" : ""
                    } ${styles.pnbuttons}`}
                  >
                    <IoIosArrowForward />
                  </Button>
                  <Button
                    onClick={prevImage}
                    variant={"ghost"}
                    size={"icon-lg"}
                    className={` absolute left-2 text-gray-200 dark:text-gray-200 ring-1 ring-gray-100 ${
                      item.image.length <= 1 ? "hidden" : ""
                    } ${styles.pnbuttons}`}
                  >
                    <IoIosArrowBack />
                  </Button>
                </div>
              </div>
              <div className="flex-between text-3xl">
                <h4 className="font-bold hover:underline underline-offset-2 transition ">
                  {item.name}
                </h4>
                <h4 className="font-bold bg-gray300c px-2 rounded-lg">
                  Price: {item.price}$
                </h4>
              </div>
              {/* <h4 className="font-bold text-nowrap overflow-hidden text-ellipsis">{item.name}</h4> */}
              <Link
                href={`/products/category/${item.category.toLowerCase()}`}
                className="hover:underline cursor-pointer transition-all w-fit text-sm from-gray700c"
              >
                {item.category}
              </Link>
              <div className="flex-around flex-wrap py-2">
                <Button
                  disabled={!item.inStock}
                  onClick={() => handleAddToCart(item)}
                >
                  Add To Cart
                </Button>
                <Button
                  disabled={!item.inStock}
                  onClick={() => handleAddToCart(item)}
                >
                  Buy Now
                </Button>
              </div>
              <div className="flex-between">
                <div className="flex-center gap-2">
                  <p className="p-1 rounded-md bg-gray300c">
                    Rating:{item.rating}
                  </p>
                  <p className="p-1 rounded-md bg-gray300c">
                    ProductId:{item.productId}
                  </p>
                </div>
                {item.inStock ? (
                  <p className="p-1 rounded-md bg-gray300c">In Stock</p>
                ) : (
                  <p className="p-1 rounded-md bg-red300c">Out of Stock</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col max-w-[890px] py-4  mx-auto space-y-3">
          <Skeleton className="h-[355px] w-full bg-gray300c rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4  bg-gray200c " />
            <Skeleton className="h-6 w-3/5  bg-gray200c " />
          </div>
          <div className="space-y-2 flex flex-around">
            <Skeleton className="h-6 w-[200px] bg-gray200c " />
            <Skeleton className="h-6 w-[180px]  bg-gray200c " />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductPage;
