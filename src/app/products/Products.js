"use client";
import LoadingOverlay from "@/components/kit/LoadingOverlay";
import Product from "@/components/kit/Product";
import SkeletonProduct from "@/components/kit/SkeletonProduct";
import { fetchCart } from "@/store/cartSlice";
import { fetchProducts } from "@/store/productSlice";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { IoReloadCircleOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const ProductPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { items, loading, error } = useSelector((state) => state.products);
  const [itemsFl, setItemsFl] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStr, setFilterStr] = useState("");

  useEffect(() => {
    let arrays = [];
    setItemsFl(
      items.filter((item, index) => {
        return item.name.toLowerCase().includes(filterStr);
      })
    );
    // console.log(itemsFl)
  }, [items, filterStr]);

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
      <div className="flex-between bg-violet100c rounded-sm  px-3">
        <h1 className="text-2xl font-bold py-4 ">
          Products({itemsFl && itemsFl.length})
        </h1>
        <div className="flex-center gap-3">
          <div className="flex-center bg-gray100c dark:bg-gray100c w-fit focus-within:ring-2 ring-gray400c rounded-sm transition-all px-2 ">
            <input
              type={"text"}
              placeholder="Search Product"
              value={filterStr}
              onChange={(e) => setFilterStr(e.target.value)}
              className={
                "bg-gray100c dark:bg-gray100c w-48 px-2 py-1 rounded-sm outline-0"
              }
            />
            <Search className="font-bold " />
          </div>

          <button
            className="text-3xl font-bold cursor-pointer p-2 rounded-full bg-gray100c  hover:bg-gray50c active:bg-gray300c "
            onClick={loadProducts}
          >
            <IoReloadCircleOutline />
          </button>
        </div>
      </div>
      <div className="flex-center flex-wrap gap-3 text-foreground px-3 py-2">
        {itemsFl.length > 0 && !loading ? (
          itemsFl.map((item) => {
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
