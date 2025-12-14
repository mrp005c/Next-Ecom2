"use client";
import React from "react";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";
import Link from "next/link";

const CartProductItem = ({ item, handleRomoveFromCart }) => {
  return (
    <div className="flex items-center gap-2 bg-gray200c w-full relative max-w-[500px] hover:bg-violet200c p-2 rounded-sm transition-all">
      <Link
        href={`/products/${item.productId}`}
        className="h-12 w-12 relative rounded-sm"
      >
        <Image
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center rounded-sm"
          src={item.image[0] ?? "/econ/png"}
          alt=""
        />
      </Link>
      <div className="flex flex-col flex-1 ">
        <Link href={`/products/${item.productId}`} className=" w-full">
          {item.name}
        </Link>
        <span className="flex text-[10px] gap-2">
          <span>{item.category}</span>
          <span>Product Id: {item.productId}</span>
        </span>
        <span>Price: {item.price}</span>
      </div>
      <button
        onClick={() => handleRomoveFromCart(item)}
        type="button"
        className="absolute top-1 right-1 text-lg hover:bg-gray50c  active:bg-gray400c"
      >
        <RxCross2 />
      </button>
    </div>
  );
};

export default CartProductItem;
