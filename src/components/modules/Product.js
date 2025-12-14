"use client";
import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { Toaster } from "../ui/sonner";

const Product = ({ item, handleAddToCart, children, showButton = true }) => {
  return (
    <>
      <div className="flex flex-col max-w-[430px] w-[350px] bg-gray100c  p-2 box-border rounded-lg transition-all hover:shadow-lg shadow-blue500c  hover:translate-y-[calc(-2px)] ">
        {children}
        <Link
          href={`/products/${item.productId}`}
          className="h-[250px] w-full z-10 relative cursor-pointer bg-gray200c rounded-lg"
        >
          <Image
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="eager"
            src={item.image[0] || "/ecom.png"}
            className="object-cover h-full w-full object-center rounded-lg"
            alt=""
          />
        </Link>
        <div className="flex-between">
          <Link
            href={`/products/${item.productId}`}
            className="font-bold hover:underline underline-offset-2 cursor-pointer transition "
          >
            {item.name}
          </Link>
          <h4 className="font-bold bg-gray300c px-2 rounded-lg">
            ${item.price}
          </h4>
        </div>
        {/* <h4 className="font-bold text-nowrap overflow-hidden text-ellipsis">{item.name}</h4> */}
        <Link
          href={`/products/category/${item.category.toLowerCase()}`}
          className="hover:underline cursor-pointer transition-all w-fit text-sm from-gray700c"
        >
          {item.category}
        </Link>
       {showButton && <div className="flex-around flex-wrap py-2">
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
        </div>}
        <div className="flex-between text-sm">
          <div className="flex-center gap-2">
            <p className="p-1 rounded-md bg-gray300c">Rating:{item.rating}</p>
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
    </>
  );
};

export default Product;
