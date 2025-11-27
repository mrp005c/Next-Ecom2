"use client";
import Product from "@/components/modules/Product";
import SkeletonProduct from "@/components/modules/SkeletonProduct";
import { fetchProducts } from "@/store/productSlice";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoReloadCircleOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

const ProductPage = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);

  const loadProducts = async () => {
    dispatch(fetchProducts());
  };

  useEffect(() => {
    const a = async () => {
      loadProducts();
    };
    if (items.length === 0) {
      a();
    }
  }, []);

  return (
    <div className=" container mx-auto">
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
            return <Product key={item.productId} item={item} />;
          })
        ) : (
          <SkeletonProduct />
        )}
      </div>
    </div>
  );
};

export default ProductPage;
