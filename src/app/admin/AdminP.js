"use client";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { IoAdd, IoAddCircle, IoReload } from "react-icons/io5";
import AdProduct from "@/components/modules/AdminProduct";
import SkeletonProduct from "@/components/modules/SkeletonProduct";
import SkeletonPage from "@/components/modules/SkeletonPage";
import LoadingOverlay from "@/components/modules/LoadingOverlay";
import UserControl from "@/components/modules/UserControl";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/store/productSlice";
// Messages tab
import MessageModule from "@/components/modules/MessageModule";
import { useDialog } from "@/components/modules/AlertDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderItem from "@/components/modules/OrderItem";

import { useFieldArray, useForm, Controller } from "react-hook-form";
import { MdDeleteForever } from "react-icons/md";

const AdminPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState(searchParams.get("tab"));
  // data load container
  const [dbInfo, setDbInfo] = useState();
  const [users, setUsers] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [formData, setFormData] = useState({ image: [""] });

  const [isloading, setIsloading] = useState(false);
  const { items, loading } = useSelector((state) => state.products);
  // Messages tab
  const [messages, setMessages] = useState([]);
  const [unreadMessage, setUnreadMessage] = useState();
  const [readMessage, setReadMessage] = useState();
  // orders tab
  const [orders, setOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [ConfirmAlertDialog, alert, confirm] = useDialog();

  // form

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    setFocus,
    formState: { errors },
  } = useForm({
    defaultValues: {
      image: [""], // empty, valid field
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "image",
  });

  const {
    register: register2,
    control: control2,
    handleSubmit: handleSubmit2,
    reset: reset2,
    setError: setError2,
    setFocus: setFocus2,
    formState: { errors: errors2 },
  } = useForm({
    defaultValues: {
      image: [""],
    },
  });

  const {
    fields: fields2,
    append: append2,
    remove: remove2,
  } = useFieldArray({
    control: control2,
    name: "image",
  });

  // load product
  const loadProducts = useCallback(async () => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // tab change effect
  useEffect(() => {
    if (tab === "users" && users.length === 0) {
      loadUsers(true);
    }
    if (tab === "products" && items.length === 0) {
      loadProducts();
    }
    if (tab === "messages" && messages.length === 0) {
      loadMessages(true);
    }
    if (tab === "orders" && orders.length === 0) {
      loadOrders();
    }
  }, [
    tab,
    items.length,
    messages.length,
    orders.length,
    users.length,
    loadProducts,
  ]);

  // tab home content
  const analytics = async () => {
    setIsloading(true);
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    try {
      const f = await fetch("/api/admin/analytics", requestOptions);
      const res = await f.json();
      if (res.success) {
        setDbInfo(res.result);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };
  useEffect(() => {
    const a = async () => {
      analytics();
    };
    a();
  }, []);

  /* Product tab content
  and other handler */

  // Add product
  const handleSubmitAdd = async (data) => {
    setIsloading(true);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(data);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      const add = await fetch("/api/products/product", requestOptions);
      const res = await add.json();
      console.log(res);
      if (res.success) {
        toast.success(res.message);
        setOpenAdd(false);
        loadProducts();
        router.push(`/admin?tab=products#${res.result.productId}`)
        reset();
      } else {
        if (res.result.code == 11000) {
          setError("productId", {
            message: "Duplicate Product id not allowed!",
          });
          setFocus("productId")
        }
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

  // Upadate Product Submit
  const handleSubmitEdit = async (data) => {
    setIsloading(true);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(data);

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      const upd = await fetch("/api/products/product", requestOptions);
      const res = await upd.json();
      console.log(res);
      if (res.success) {
        toast.success(res.message);
        setOpenEdit(false);
        await loadProducts();
        router.push(`/admin?tab=products#${res.result.productId}`)
      } else {
        if (res.result.code == 11000) {
          setError2("productId", {
            message: "Duplicate Product id not allowed!",
          });
          setFocus2("productId")
          console.log("object");
        }
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };

  // users info
  const loadUsers = async (loadLoayout) => {
    setIsloading(loadLoayout);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    try {
      const data = await fetch(`/api/user`, requestOptions);
      const res = await data.json();
      if (res.success) {
        let short = res.result;
        short.sort((a, b) => a.role.localeCompare(b.role));
        setUsers(short);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };

  /* loadMessages
  and other handler */
  const loadMessages = async (loadLoayout) => {
    setIsloading(loadLoayout);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    try {
      const data = await fetch(`/api/message`, requestOptions);
      const res = await data.json();
      if (res.success) {
        let short = res.result.reverse();
        setMessages(short);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };
  // filter the messages
  useEffect(() => {
    const u = async () => {
      if (messages && messages.length > 0) {
        setUnreadMessage(messages.filter((e) => !e.readStatus));
        setReadMessage(messages.filter((e) => e.readStatus));
      }
    };
    u();
  }, [messages]);

  // filter the orders
  useEffect(() => {
    const u = async () => {
      if (orders && orders.length > 0) {
        setPendingOrders(orders.filter((e) => e.status === "pending"));
        setConfirmedOrders(orders.filter((e) => e.status === "confirmed"));
        setDeliveredOrders(orders.filter((e) => e.status === "delivered"));
      }
    };
    u();
  }, [orders]);
  // Read Message or Unread handler
  const handleDoneMessage = async (id, isRead) => {
    // return
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      readStatus: !isRead,
    });
    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      const data = await fetch(`/api/message?id=${id}`, requestOptions);
      const res = await data.json();
      if (res.success) {
        loadMessages(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //Delete Message handler
  const handleDeleteMessage = async (id) => {
    const ok = await confirm({
      title: "Delete The Message?",
      confirmText: "Delete",
    });
    if (!ok) {
      return;
    }
    // return
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };
    try {
      const data = await fetch(`/api/message?id=${id}`, requestOptions);
      const res = await data.json();
      if (res.success) {
        loadMessages(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Load orders
  const loadOrders = async () => {
    setIsloading(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    try {
      const data = await fetch(`/api/orders`, requestOptions);
      const res = await data.json();
      if (res.success) {
        setOrders(res.result);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };

  if (!session)
    return (
      <div className="container mx-auto">
        {/* <LoadingOverlay show={true} message={"Loading Page..."}/> */}
        <SkeletonPage />
      </div>
    );
  return (
    <div className=" max-w-[1980px] mx-auto">
      {ConfirmAlertDialog}
      <Toaster />
      <LoadingOverlay show={isloading} message={"Loading... Please Wait!"} />
      {/* add */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="sm:max-w-[425px] max-h-full overflow-auto my-3">
          <form onSubmit={handleSubmit(handleSubmitAdd)}>
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
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
                  {...register("name", {
                    required: { value: true, message: "Name is required!" },
                  })}
                  placeholder="Product Name"
                />
                {errors.name && (
                  <div className="text-red500c text-xs ">
                    {errors.name.message}
                  </div>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="image">Image</Label>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 my-2">
                    <Input
                      {...register(`image.${index}`)}
                      placeholder="Image URL"
                    />

                    <Button
                      type="button"
                      variant="destructive"
                      size={"icon-lg"}
                      onClick={() => remove(index)}
                    >
                      <MdDeleteForever />
                    </Button>
                  </div>
                ))}
                <Button
                  variant={"outline"}
                  // size={"icon-lg"}
                  type="button"
                  className={"flex-center w-fit"}
                  onClick={() => append("")}
                >
                  <IoAddCircle />
                  Add Image
                </Button>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="productId">Product Id</Label>
                <Input
                  {...register("productId", {
                    required: { value: true, message: "Product is required!" },
                  })}
                  id="productId"
                  type="text"
                  placeholder="Enter Product Id"
                />
                {errors.productId && (
                  <div className="text-red500c text-xs ">
                    {errors.productId.message}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    {...register("price", {
                      required: { value: true, message: "Price is required!" },
                    })}
                    id="price"
                    type="number"
                    placeholder="Enter Product Price"
                  />
                  {errors.price && (
                    <div className="text-red500c text-xs ">
                      {errors.price.message}
                    </div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ratings">Ratings</Label>
                  <Input
                    {...register("rating", {
                      max: { value: 5, message: "Max ratings rating is 5!" },
                    })}
                    placeholder="Enter Ratings"
                    type="number"
                    id="ratings"
                  />
                  {errors.rating && (
                    <div className="text-red500c text-xs ">
                      {errors.rating.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-between flex-wrap gap-2">
                <div className="flex-center">
                  <Label htmlFor="instock">In Stock</Label>
                  <input
                    {...register("inStock")}
                    className="h-8 rounded-sm w-5 "
                    id="instock"
                    type="checkbox"
                  />
                </div>
                <div className="flex gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Controller
                    name="category"
                    control={control}
                    defaultValue={"uncategorized"}
                    render={({ field }) => (
                      <Select
                        // {...register("category")}
                        onValueChange={field.onChange}
                        value={field.value}
                        placeholder="Category"
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
                            <SelectItem value="accessories">
                              Accessories
                            </SelectItem>
                            <SelectItem value="electronics">
                              Electronics
                            </SelectItem>
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
                            <SelectItem value="toys-games">
                              Toys & Games
                            </SelectItem>
                            <SelectItem value="groceries">Groceries</SelectItem>
                            <SelectItem value="books">Books</SelectItem>
                            <SelectItem value="furniture">Furniture</SelectItem>
                            <SelectItem value="mobile">
                              Mobile Phones
                            </SelectItem>
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
                            <SelectItem value="automotive">
                              Automotive
                            </SelectItem>
                            <SelectItem value="gaming">Gaming</SelectItem>
                            <SelectItem value="pets">Pet Supplies</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* edit product diagram */}
      {/* diagram container  */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-[425px] max-h-full overflow-auto">
          <form onSubmit={handleSubmit2(handleSubmitEdit)}>
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
                  {...register2("name", {
                    required: { value: true, message: "Name is required!" },
                  })}
                  placeholder="Product Name"
                />
                {errors2.name && (
                  <div className="text-red500c text-xs ">
                    {errors2.name.message}
                  </div>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="image">Image</Label>
                {fields2.map((field, index) => (
                  <div key={field.id} className="flex gap-2 my-2">
                    <Input
                      {...register2(`image.${index}`)}
                      placeholder="Image URL"
                    />

                    <Button
                      type="button"
                      variant="destructive"
                      size={"icon-lg"}
                      onClick={() => remove2(index)}
                    >
                      <MdDeleteForever />
                    </Button>
                  </div>
                ))}
                <Button
                  variant={"outline"}
                  // size={"icon"}
                  type="button"
                  className={"flex-center w-fit"}
                  onClick={() => append2("")}
                >
                  <IoAddCircle /> Add Image
                </Button>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="productId">Product Id</Label>
                <Input
                  {...register2("productId", {
                    required: { value: true, message: "Pfoduct is required!" },
                  })}
                  id="productId"
                  type="text"
                  placeholder="Enter Product Id"
                />
                {errors2.productId && (
                  <div className="text-red500c text-xs ">
                    {errors2.productId.message}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    {...register2("price", {
                      required: { value: true, message: "Price is required!" },
                    })}
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="Enter Product Price"
                  />
                  {errors2.price && (
                    <div className="text-red500c text-xs ">
                      {errors2.price.message}
                    </div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ratings">Ratings</Label>
                  <Input
                    {...register2("rating", {
                      max: { value: 5, message: "Max ratings rate is 5!" },
                    })}
                    placeholder="Enter Ratings"
                    type="number"
                    step="0.01"
                    id="ratings"
                  />
                  {errors2.rating && (
                    <div className="text-red500c text-xs ">
                      {errors2.rating.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-between flex-wrap gap-2">
                <div className="flex-center">
                  <Label htmlFor="instock">In Stock</Label>
                  <input
                    {...register2("inStock")}
                    className="h-8 rounded-sm w-5 "
                    id="instock"
                    type="checkbox"
                  />
                </div>
                <div className="flex gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Controller
                    name="category"
                    control={control2}
                    defaultValue={"uncategorized"}
                    render={({ field }) => (
                      <Select
                        // {...register("category")}
                        onValueChange={field.onChange}
                        value={field.value}
                        placeholder="Category"
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
                            <SelectItem value="accessories">
                              Accessories
                            </SelectItem>
                            <SelectItem value="electronics">
                              Electronics
                            </SelectItem>
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
                            <SelectItem value="toys-games">
                              Toys & Games
                            </SelectItem>
                            <SelectItem value="groceries">Groceries</SelectItem>
                            <SelectItem value="books">Books</SelectItem>
                            <SelectItem value="furniture">Furniture</SelectItem>
                            <SelectItem value="mobile">
                              Mobile Phones
                            </SelectItem>
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
                            <SelectItem value="automotive">
                              Automotive
                            </SelectItem>
                            <SelectItem value="gaming">Gaming</SelectItem>
                            <SelectItem value="pets">Pet Supplies</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Admin Panel Header */}
      <div className="head p-3 bg-gray200c  flex-between flex-wrap">
        <h1 className="text-2xl font-bold mb-2">Admin Panel</h1>
        <div className="bg-gray100c  rounded-md px-3 py-2 font-bold flex-center relative gap-3">
          <Image
            height={80}
            width={80}
            className="rounded-full  object-cover h-20 w-20"
            src={session.user.image || "/profilea.jpg"}
            alt="sdfsdf"
          />
          <div className="flex flex-col">
            <span className="font-bold text-lg">
              Welcome, {session.user.name}
            </span>
            <span className="font-light text-sm">{session.user.email}</span>

            <Button
              variant="destructive"
              className="font-semibold px-3 rounded-md bg-red500c hover:bg-red300c active:bg-red500c transition-all w-fit"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
      <div className="cont p-2 flex gap-2 flex-col sm:flex-row">
        {/* tabs  */}
        <div className="tabs sm:max-w-[200px]  sm:w-full h-fit gap-1 flex-wrap flex-center sm:flex-col">
          <h3 className="flex-center sm:w-full  text-lg font-semibold bg-gray300c rounded-md">
            Quick Tabs
          </h3>
          <div className="gap-1 w-full flex-wrap flex-center sm:flex-col">
            <Button
              onClick={() => {
                setTab("home");
                router.push("/admin?tab=home");
              }}
              variant="secondary"
              // className={`w-full hover:bg-gray200c ${tab === "home"? "bg-red200c": ""}`}
              className={`sm:w-full  hover:bg-gray200c ${
                tab === "home" || !tab ? "bg-red200c" : ""
              }`}
            >
              Home
            </Button>
            <Button
              onClick={() => {
                setTab("products");
                router.push("/admin?tab=products");
              }}
              variant="secondary"
              className={`sm:w-full hover:bg-gray200c ${
                tab === "products" ? "bg-red200c" : ""
              }`}
            >
              Products
            </Button>
            <Button
              onClick={() => {
                setTab("users");
                router.push("/admin?tab=users");
              }}
              variant="secondary"
              className={`sm:w-full  hover:bg-gray200c ${
                tab === "users" ? "bg-red200c" : ""
              }`}
            >
              Users
            </Button>
            <Button
              onClick={() => {
                setTab("messages");
                router.push("/admin?tab=messages");
              }}
              variant="secondary"
              className={`sm:w-full  hover:bg-gray200c ${
                tab === "messages" ? "bg-red200c" : ""
              }`}
            >
              Messages
            </Button>
            <Button
              onClick={() => {
                setTab("orders");
                router.push("/admin?tab=orders");
              }}
              variant="secondary"
              className={`sm:w-full  hover:bg-gray200c ${
                tab === "orders" ? "bg-red200c" : ""
              }`}
            >
              Orders
            </Button>

            <Button
              onClick={() => {
                setTab("settings");
                router.push("/admin?tab=settings");
              }}
              variant="secondary"
              className={`sm:w-full  hover:bg-gray200c ${
                tab === "settings" ? "bg-red200c" : ""
              }`}
            >
              Settings
            </Button>
          </div>
        </div>

        {/* {container } */}
        <div className="flex-1 bg-gray50c rounded-md p-2">
          {/* home tab  */}
          {(tab === "home" || !tab) && (
            <>
              <div className="flex-between bg-violet100c p-2 rounded-md">
                <h1 className="text-2xl font-bold ">Home</h1>
                <Button
                  size={"icon"}
                  onClick={analytics}
                  variant="outline"
                  className="font-bold text-2xl"
                >
                  <IoReload />
                </Button>
              </div>
              {dbInfo && (
                <div className="container mx-auto p-4 flex-center gap-3 flex-wrap text-xs">
                  {/* Products here */}
                  <div className="message bg-gray300c h-40 w-40 rounded-full ring-2 space-y-3 ring-gray400c flex-center flex-col">
                    <h3 className="text-xl font-bold ">Products</h3>
                    <div className="flex flex-col p-1 bg-gray200c  rounded-md">
                      <span>Total: {dbInfo.product}</span>
                    </div>
                  </div>
                  {/* Order here */}
                  <div className="message bg-gray300c h-40 w-40 rounded-full ring-2 space-y-3 ring-gray400c flex-center flex-col">
                    <h3 className="text-xl font-bold ">Orders</h3>
                    <div className="flex flex-col p-1 bg-gray200c  rounded-md">
                      <span>Total: {dbInfo.order}</span>
                    </div>
                  </div>
                  {/* user here */}
                  <div className="message bg-gray300c h-40 w-40 rounded-full ring-2 space-y-3 ring-gray400c flex-center flex-col">
                    <h3 className="text-xl font-bold ">Users</h3>
                    <div className="flex flex-col p-1 bg-gray200c  rounded-md">
                      <span>User: {dbInfo.user.user}</span>
                      <span>Admin: {dbInfo.user.admin}</span>
                      <span>Total: {dbInfo.user.user + dbInfo.user.admin}</span>
                    </div>
                  </div>
                  {/* Messages here */}
                  <div className="message bg-gray300c h-40 w-40 rounded-full ring-2 space-y-3 ring-gray400c flex-center flex-col">
                    <h3 className="text-xl font-bold ">Messages</h3>
                    <div className="flex flex-col p-1 bg-gray200c  rounded-md">
                      <span>Read: {dbInfo.message.read}</span>
                      <span>Unread: {dbInfo.message.unread}</span>
                      <span>
                        Total: {dbInfo.message.unread + dbInfo.message.read}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Products tab */}
          {tab === "products" && (
            <div className="space-y-3">
              <div className="flex-between bg-violet100c p-2 rounded-md">
                <h2 className="text-2xl font-bold ">Products</h2>
                <div className="buttons flex-center flex-wrap gap-2">
                  <Button
                    onClick={() => {
                      setOpenAdd(true);
                    }}
                    variant="outline"
                    className=""
                  >
                    <IoAdd /> Add New
                  </Button>
                  <Button
                    size={"icon"}
                    onClick={loadProducts}
                    variant="outline"
                    className="font-bold text-2xl"
                  >
                    <IoReload />
                  </Button>
                </div>
              </div>
              {items && !loading ? (
                <div className="flex justify-center  items-stretch flex-wrap gap-3 text-foreground px-3 box-border py-2">
                  {items.map((item) => {
                    return (
                      <AdProduct
                        handleDelete={handleDelete}
                        key={item.productId}
                        item={item}
                        reset2={reset2}
                        setOpenEdit={setOpenEdit}
                      />
                    );
                  })}
                </div>
              ) : (
                <SkeletonProduct className="bg-gray400c" />
                // <div>rakib</div>
              )}
            </div>
          )}

          {/* Users tab */}
          {tab === "users" && (
            <div className="space-y-3">
              <div className="flex-between bg-violet100c p-2 rounded-md">
                <h1 className="text-2xl font-bold ">Users</h1>
                <Button
                  size={"icon"}
                  onClick={() => loadUsers(true)}
                  variant="outline"
                  className="font-bold text-2xl"
                >
                  <IoReload />
                </Button>
              </div>
              <div className="flex flex-col items-stretch w-fit mx-auto gap-2">
                {users.length > 0
                  ? users.map((user) => (
                      <UserControl key={user._id} user={user} />
                    ))
                  : Array.from("rakib").map((v, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-3 border rounded-lg"
                      >
                        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-12" />
                          </div>
                          <Skeleton className="h-3 w-3/4" />
                        </div>
                        <div className="flex gap-2 space-y-1">
                          <Skeleton className="h-6 w-6 rounded" />
                          <Skeleton className="h-6 w-6 rounded" />
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          )}

          {tab === "messages" && (
            <div>
              <div className="flex-between bg-violet100c p-2 rounded-md">
                <h1 className="text-2xl font-bold ">Messages</h1>
                <Button
                  size={"icon"}
                  onClick={() => loadMessages(true)}
                  variant="outline"
                  className="font-bold text-2xl"
                >
                  <IoReload />
                </Button>
              </div>
              <Tabs defaultValue="unreadMessages" className="">
                <div className="flex-center flex-wrap">
                  <TabsList className={"flex-center flex-wrap"}>
                    <TabsTrigger value="unreadMessages">Unread</TabsTrigger>
                    <TabsTrigger value="readMessages">Read</TabsTrigger>
                    <TabsTrigger value="allMessages">All</TabsTrigger>
                  </TabsList>
                </div>
                <div className=" rounded-lg transition-all">
                  <TabsContent value="unreadMessages">
                    <div className="space-y-3">
                      <h2 className=" font-bold text-xl">Unread Messages</h2>
                      {unreadMessage && unreadMessage.length > 0 ? (
                        unreadMessage.map((message) => (
                          <MessageModule
                            key={message._id}
                            message={message}
                            handleDeleteMessage={handleDeleteMessage}
                            handleDoneMessage={handleDoneMessage}
                          />
                        ))
                      ) : (
                        <h2 className="text-center font-bold text-3xl">
                          No Unread Message !
                        </h2>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="readMessages">
                    <div className="space-y-3">
                      <h2 className=" font-bold text-xl">Read Messages</h2>
                      {readMessage && readMessage.length > 0 ? (
                        readMessage.map((message) => (
                          <MessageModule
                            key={message._id}
                            message={message}
                            handleDeleteMessage={handleDeleteMessage}
                            handleDoneMessage={handleDoneMessage}
                          />
                        ))
                      ) : (
                        <h2 className="text-center font-bold text-3xl">
                          No Read Message !
                        </h2>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="allMessages">
                    <div className="space-y-3">
                      <h2 className=" font-bold text-xl">All Messages</h2>
                      {messages && messages.length > 0 ? (
                        messages.map((message) => (
                          <MessageModule
                            key={message._id}
                            message={message}
                            handleDeleteMessage={handleDeleteMessage}
                            handleDoneMessage={handleDoneMessage}
                          />
                        ))
                      ) : (
                        <h2 className="text-center font-bold text-3xl">
                          No Message !
                        </h2>
                      )}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          )}

          {/* Orders Tab */}
          {tab === "orders" && (
            <div>
              <div className="flex-between bg-violet100c p-2 rounded-md">
                <h1 className="text-2xl font-bold ">Orders</h1>
                <Button
                  size={"icon"}
                  onClick={() => loadOrders()}
                  variant="outline"
                  className="font-bold text-2xl"
                >
                  <IoReload />
                </Button>
              </div>
              <Tabs defaultValue="pending">
                <div className="flex-center p-2">
                  <TabsList className={"flex-center flex-wrap"}>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                    <TabsTrigger value="delivered">Delivered</TabsTrigger>
                    <TabsTrigger value="all">All</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="pending">
                  <div className="p-3 space-y-3 flex-center flex-col">
                    {pendingOrders &&
                      pendingOrders.map((item) => (
                        <OrderItem key={item._id} item={item} />
                      ))}
                  </div>
                </TabsContent>
                <TabsContent value="confirmed">
                  <div className="p-3 space-y-3 flex-center flex-col">
                    {confirmedOrders &&
                      confirmedOrders.map((item) => (
                        <OrderItem key={item._id} item={item} />
                      ))}
                  </div>
                </TabsContent>
                <TabsContent value="delivered">
                  <div className="p-3 space-y-3 flex-center flex-col">
                    {deliveredOrders &&
                      deliveredOrders.map((item) => (
                        <OrderItem key={item._id} item={item} />
                      ))}
                  </div>
                </TabsContent>
                <TabsContent value="all">
                  <div className="p-3 space-y-3 flex-center flex-col">
                    {orders &&
                      orders.map((item) => (
                        <OrderItem key={item._id} item={item} />
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
