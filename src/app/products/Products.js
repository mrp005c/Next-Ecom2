"use client";
import LoadingOverlay from "@/components/modules/LoadingOverlay";
import Product from "@/components/modules/Product";
import SkeletonProduct from "@/components/modules/SkeletonProduct";
import { fetchCart } from "@/store/cartSlice";
import { fetchProducts } from "@/store/productSlice";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { IoReloadCircleOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { usePathname, useRouter } from "next/navigation";

const ProductPage = () => {
  const dispatch = useDispatch();
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession();
  const { items, loading, error } = useSelector((state) => state.products);
  const [isLoading, setIsLoading] = useState(false);

  const loadProducts = useCallback(async () => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleCartLoad = async () => {
    if (session) {
      const userId = session.user.id;
      dispatch(fetchCart(userId));
    }
  };

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

  useEffect(() => {
    const a = async () => {
      loadProducts();
    };
    if (items.length === 0) {
      a();
    }
  }, [items.length, loadProducts]);

  return (
    <div className=" container mx-auto">
      <LoadingOverlay show={isLoading} message={"Adding to Cart"} />
      <Toaster />
      <div className="flex-between bg-gray300c  px-3">
        <h1 className="text-2xl font-bold py-4 ">All Products</h1>
        <button
          className="text-3xl font-bold cursor-pointer p-2 rounded-full bg-gray100c  hover:bg-gray50c active:bg-gray300c "
          onClick={loadProducts}
        >
          <IoReloadCircleOutline />
        </button>
      </div>
      <div className="flex-center flex-wrap gap-3 text-foreground px-3 py-2">
        {items.length > 0 && !loading ? (
          items.map((item) => {
            return (
              <Product
                key={item.productId}
                item={item}
                handleAddToCart={handleAddToCart}
              />
            );
          })
        ) : (
          <SkeletonProduct />
        )}
      </div>
    </div>
  );
};

export default ProductPage;
