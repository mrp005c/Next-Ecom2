"use client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { Toaster } from "@/components/ui/sonner";
import LoadingOverlay from "./LoadingOverlay";
import Link from "next/link";
import { useDialog } from "@/components/modules/AlertDialog";

const AdProduct = ({ item, handleDelete, reset2, setOpenEdit }) => {

  const [formData, setFormData] = useState({});
  const [ConfirmAlertDialog, alert, confirm] = useDialog();
  const [isloading, setIsloading] = useState(false);
  const router = useRouter();


  // Delete product


  return (
    <>
      {ConfirmAlertDialog}
      <Toaster />
      <LoadingOverlay show={isloading} message={"Updating... Please Wait!"} />
   
      <div className="flex justify-start items-start flex-col min-w-[280px] max-w-[380px] w-full flex-1 hover:bg-gray100c bg-gray200c p-2 box-border rounded-lg transition-all hover:shadow-md shadow-blue-300  hover:translate-y-[calc(-2px)] ">
        <div className="buttons flex-around text-2xl w-full py-2 rounded-md ">
          <button
            onClick={() => {
              reset2({
                id: item._id,
                name: item.name,
                image: item.image,
                price: item.price,
                rating: item.rating,
                category: item.category,
                productId: item.productId,
                inStock: item.inStock,
              });
              setOpenEdit(true);
            }}
            className="p-2 rounded-full flex-center bg-gray300c hover:bg-gray200c active:bg-gray400c transition-all"
            type="button"
          >
            <MdEdit />
          </button>
          <button
            onClick={() => handleDelete(item._id, item.name)}
            className="p-2 rounded-full flex-center bg-gray300c hover:bg-gray200c active:bg-gray400c transition-all"
            type="button"
          >
            <MdDelete />
          </button>
        </div>
        <Link
          href={`/products/${item.productId}`}
          className="h-[200px] w-full z-10 relative cursor-pointer bg-gray200c rounded-lg"
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
        <div className="flex-between text-[10px] flex-wrap">
          <div className="flex-center flex-wrap">
            <p className="p-1 rounded-md bg-gray300c">Rating:{item.rating}</p>
            <p className="p-1 rounded-md bg-gray300c overflow-hidden text-ellipsis text-nowrap">
              Id:{item.productId}
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

export default AdProduct;
