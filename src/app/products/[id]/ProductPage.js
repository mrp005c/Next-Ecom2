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
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pagination, Navigation } from "swiper/modules";

const ProductPage = ({ id }) => {
  // const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState();
  const [success, setSuccess] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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
          <div className="bg-gray100c max-w-[1900px] mx-auto p-4 box-border rounded-lg transition-all">
            <div className="flex flex-col lg:flex-row gap-4 w-full    ">
              {" "}
              <div
                className={`relative z-30  max-w-full w-[700px] mx-auto text-foreground flex-center ${styles.hoverp}`}
              >
                <Button
                  // onClick={nextImage}
                  variant={"ghost"}
                  size={"icon-lg"}
                  className={`custom-next z-40 absolute right-2 text-gray-200 dark:text-gray-200 ring-1 ring-gray-100 ${
                    item.image.length <= 1 ? "hidden" : ""
                  } ${styles.pnbuttons}`}
                >
                  <IoIosArrowForward />
                </Button>
                <Button
                  // onClick={prevImage}
                  variant={"ghost"}
                  size={"icon-lg"}
                  className={`custom-prev z-40 absolute left-2 text-gray-200 dark:text-gray-200 ring-1 ring-gray-100 ${
                    item.image.length <= 1 ? "hidden" : ""
                  } ${styles.pnbuttons}`}
                >
                  <IoIosArrowBack />
                </Button>
                <Swiper
                  slidesPerView={1}
                  spaceBetween={22}
                  loop={true}
                  pagination={{
                    clickable: true,
                  }}
                  // navigation={true}
                  modules={[Pagination, Navigation]}
                  navigation={{
                    prevEl: ".custom-prev",
                    nextEl: ".custom-next",
                  }}
                  className="mySwiper max-w-[700px] w-[700px] relative"
                >
                  {item.image &&
                    item.image.map((img, ind) => {
                      return (
                        <SwiperSlide className="w-fit" key={ind}>
                          <div className="h-[350px] max-w-full  w-[700px] z-10 relative bg-gray200c  rounded-lg flex-center select-none">
                            <Image
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              loading="eager"
                              src={item.image[ind] || "/ecom.png"}
                              className="object-cover object-center rounded-lg"
                              alt=""
                              onDragStart={(e) => e.preventDefault()} // disable drag
                              draggable="false" // disable image dragging
                              style={{ userSelect: "none" }}
                            />{" "}
                          </div>
                        </SwiperSlide>
                      );
                    })}
                </Swiper>{" "}
              </div>
              {/* <div
                className="h-[350px] max-w-full  w-[700px] z-10 relative bg-gray200c  rounded-lg flex-center select-none"
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
              </div> */}
              <div className="w-full flex-1 ">
                <div className="w-full flex flex-col ">
                  <h4 className="font-semibold text-justify w-full text-xl hover:underline underline-offset-2 transition ">
                    {item.name}
                  </h4>
                  <h4 className="w-fit box-border border-2  border-gray500c  px-2 rounded-lg">
                    <span className="font-bold "> Price:</span> {item.price}$
                  </h4>
                </div>
                {/* <h4 className="font-bold text-nowrap overflow-hidden text-ellipsis">{item.name}</h4> */}
                <Link
                  href={`/products/category/${item.category.toLowerCase()}`}
                  className="hover:underline cursor-pointer transition-all w-fit text-sm from-gray700c"
                >
                  {item.category}
                </Link>
                <div className="flex-around max-w-[500px] flex-wrap py-2">
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

                <div className="flex flex-col flex-wrap">
                  <p className="p-1 rounded-md ">Ratings:{item.rating}</p>
                  <p className="p-1 rounded-md ">ProductId:{item.productId}</p>
                  {item.inStock ? (
                    <p className="p-1 rounded-md bg-red300c w-fit">In Stock</p>
                  ) : (
                    <p className="p-1 rounded-md bg-red300c w-fit">
                      Out of Stock
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Description</h2>
              <p className="text-justify">
                {item.name} is available at an affordable price of {item.price}.
                This product belongs to the {item.category} category and is
                currently {item.inStock ? "In Stock" : "Out of Stock"}. Designed
                for quality and daily use, it’s a great choice for customers
                looking for reliability and value.
              </p>
              <p className="text-justify">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Accusamus amet nobis vitae animi laboriosam quos excepturi cum
                nihil in tenetur, blanditiis nostrum sint?
              </p>
              <p className="text-justify">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Veritatis ipsa unde quaerat eveniet officiis, iusto nobis nihil
                fugit. Nam expedita iure blanditiis dolorum quia amet, magnam
                vel! Culpa possimus eligendi ducimus, ea veniam quo at cum, amet
                eius id eum beatae magnam nesciunt quia saepe, dolor modi hic
                autem provident consequuntur doloremque? Perferendis,
                praesentium magni.
              </p>
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
