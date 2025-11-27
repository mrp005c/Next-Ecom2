"use client";
import AdminHeader from "@/components/AdminHeader";
import React, { useEffect, useState } from "react";
import { fetchCart } from "@/store/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { DeleteIcon } from "lucide-react";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";
import CartProductItem from "@/components/modules/cartProduct";
import LoadingOverlay from "@/components/modules/LoadingOverlay";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { cartItems, loading, error } = useSelector((state) => state.cart);
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false)

  const handleCartLoad = async () => {
    if (session) {
      const userId = session.user.id;
      // const userId = "6901a8c510a4bdea0659aa2c";
      dispatch(fetchCart(userId));
    }
    return;
  };

  const handleAddToCart = async (newCartItem) => {
    if (!session) {
      toast.info("Please Login First.");
      router.push("/login");
      return;
    }
setIsLoading(true)
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email: session.user.email,
      userId: session.user.id,
      products: { name: "new web dev course", price: 935 },
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
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
    }finally{
      setIsLoading(false)
    }
  };

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
        // loadProducts();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const item = {
    cartP: {
      $oid: "6908d584df9704ba2458049a",
    },
    name: "Wireless Bluetooth Headphones",
    image: [
      "https://images.unsplash.com/photo-1733556046403-2d090cf359a3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ymx1dGhvb3RoJTIwaGVhZHBob25lfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
      "https://images.unsplash.com/photo-1733556046403-2d090cf359a3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ymx1dGhvb3RoJTIwaGVhZHBob25lfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
    ],
    price: 49.99,
    category: "Accessories",
    rating: 4.7,
    inStock: true,
    productId: 1,
    _id: {
      $oid: "6908d584df9704ba2458049b",
    },
  };

  return (
    <div> <LoadingOverlay show={isLoading} message={'Adding to cart'}/>
      <Toaster />
      <Button onClick={handleCartLoad}>Load cart</Button>
      <Button onClick={handleAddToCart}>Post cart</Button>
      <Button onClick={handleRomoveFromCart}>Delete a cart item</Button>
      <CartProductItem
        item={item}
        handleRomoveFromCart={handleRomoveFromCart}
      />
      {cartItems &&
        cartItems.map((item, index) => (
          <div key={index}>
            <div>{item.name}</div>
            <div>{item.price}</div>
            <Button onClick={() => handleRomoveFromCart(item)}>
              <DeleteIcon />
            </Button>
          </div>
        ))}

      <div className="flex items-center gap-2 bg-gray200c w-full relative max-w-[500px] hover:bg-gray100c  p-2 rounded-sm transition-all">
        <div className="h-12 w-12 relative rounded-sm">
          <Image
            fill
            className="object-cover object-center rounded-sm"
            src={item.image[0] ?? "/econ/png"}
            alt=""
          />
        </div>
        <div className="flex flex-col flex-1 ">
          <span className=" w-full">{item.name}</span>
          <span className="flex text-[10px] gap-2">
            <span>{item.category}</span>
            <span>Product Id: {item.productId}</span>
          </span>
          <span>Price: {item.price}</span>
        </div>
        <button
          type="button"
          className="absolute top-1 right-1 text-lg hover:bg-gray50c  active:bg-gray400c"
        >
          <RxCross2 />
        </button>
      </div>
    </div>
  );
};

export default Page;
