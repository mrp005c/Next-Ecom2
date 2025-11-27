"use client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Spinner } from "../ui/spinner";
import LoadingOverlay from "./LoadingOverlay";
import Link from "next/link";
import { useDialog } from "@/components/modules/AlertDialog";
import { IoAddCircle } from "react-icons/io5";

const AdProduct = ({ item, loadProducts }) => {
  const [openD, setOpenD] = useState(false);
  const [formData, setFormData] = useState({});
  const [ConfirmAlertDialog, alert, confirm] = useDialog();
  const [isloading, setIsloading] = useState(false);
  const router = useRouter();

  // Form change function
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // Upadate Product Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsloading(true);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(formData);

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      const upd = await fetch("/api/products/product", requestOptions);
      const res = await upd.json();
      if (res.success) {
        toast.success(res.message);
        setOpenD(false);
        setFormData({});
        loadProducts();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };

  // Delete product
  const handleDelete = async (e, productName) => {
    const ok = await confirm({
      title: "Delete Product?",
      description: `Are you sure you want to delete "${productName}"? This cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (!ok) {
      return;
    }
    const requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };
    try {
      const del = await fetch(`/api/products/product?id=${e}`, requestOptions);
      const res = await del.json();

      if (res.success) {
        toast.success(res.message);
        loadProducts();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {ConfirmAlertDialog}
      <Toaster />
      <LoadingOverlay show={isloading} message={"Updating... Please Wait!"} />
      {/* diagram container  */}
      <Dialog open={openD} onOpenChange={setOpenD}>
        <DialogContent className="sm:max-w-[425px] max-h-full overflow-auto">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Make changes to your productId here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">Name</Label>
                <Input
                  id="name-1"
                  onChange={handleChange}
                  value={formData.name || ""}
                  name="name"
                  placeholder="Product Name"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="image">Image</Label>
                {formData.image &&
                  formData.image.map((e, i) => (
                    <Input
                      key={i}
                      id={`image-${i}`}
                      onChange={(e) => {
                        const newImage = [...formData.image];
                        newImage[i] = e.target.value;
                        setFormData({ ...formData, image: newImage });
                      }}
                      value={e || ""}
                      name="image"
                      placeholder="Product Image Link"
                    />
                  ))}
                <Button
                  variant={"outline"}
                  size={"icon"}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, image: [...formData.image, ""] })
                  }
                  className={"flex-center"}
                >
                  <IoAddCircle />
                </Button>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="proid">Product Id</Label>
                <Input
                  id="proid"
                  onChange={handleChange}
                  value={formData.productId || ""}
                  name="productId"
                  placeholder="Product Id"
                />
              </div>
              <div className="flex gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    onChange={handleChange}
                    value={formData.price || ""}
                    id="price"
                    name="price"
                    type="number"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Ratings</Label>
                  <Input
                    onChange={handleChange}
                    type="number"
                    value={formData.rating || ""}
                    id="price"
                    name="rating"
                  />
                </div>
              </div>

              <div className="flex-between flex-wrap gap-2">
                <div className="flex-center">
                  <Label htmlFor="instock">In Stock</Label>
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, inStock: e.target.checked })
                    }
                    className="h-8 rounded-sm w-5 "
                    checked={!!formData.inStock}
                    id="instock"
                    name="inStock"
                    type="checkbox"
                  />
                </div>
                <div className="flex ">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    className="ring-1 ring-gray200c"
                    value={formData.category || ""}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                    name="category"
                    placeholder="Select One"
                    id="category"
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
                        <SelectItem value="uncategorized">
                          Uncategorized
                        </SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="fashion">Fashion</SelectItem>
                        <SelectItem value="home-appliances">
                          Home Appliances
                        </SelectItem>
                        <SelectItem value="beauty-health">
                          Beauty & Health
                        </SelectItem>
                        <SelectItem value="sports-outdoors">
                          Sports & Outdoors
                        </SelectItem>
                        <SelectItem value="toys-games">Toys & Games</SelectItem>
                        <SelectItem value="groceries">Groceries</SelectItem>
                        <SelectItem value="books">Books</SelectItem>
                        <SelectItem value="furniture">Furniture</SelectItem>
                        <SelectItem value="mobile">Mobile Phones</SelectItem>
                        <SelectItem value="computers">
                          Computers & Laptops
                        </SelectItem>
                        <SelectItem value="watches">Watches</SelectItem>
                        <SelectItem value="shoes">Shoes</SelectItem>
                        <SelectItem value="bags">Bags</SelectItem>
                        <SelectItem value="camera">
                          Cameras & Photography
                        </SelectItem>
                        <SelectItem value="kitchen">
                          Kitchen Essentials
                        </SelectItem>
                        <SelectItem value="automotive">Automotive</SelectItem>
                        <SelectItem value="gaming">Gaming</SelectItem>
                        <SelectItem value="pets">Pet Supplies</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              {/* <Button  type="submit" >Save changes</Button> */}
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <div className="flex justify-start items-start flex-col min-w-[280px] max-w-[380px] w-full flex-1 hover:bg-gray100c bg-gray200c p-2 box-border rounded-lg transition-all hover:shadow-md shadow-blue-300  hover:translate-y-[calc(-2px)] ">
        <div className="buttons flex-around text-2xl w-full py-2 rounded-md ">
          <button
            onClick={() => {
              setFormData({
                id: item._id,
                name: item.name,
                image: item.image,
                price: item.price,
                rating: item.rating,
                category: item.category,
                productId: item.productId,
                inStock: item.inStock,
              });
              setOpenD(true);
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
