"use client";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

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
import Image from "next/image";
import LoadingOverlay from "@/components/modules/LoadingOverlay";
import { useForm } from "react-hook-form";

const DashNav = () => {
  const { data: session, status, update } = useSession();
  const [openD, setOpenD] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const router = useRouter();
  // form handle
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm();

  const handleEdit = async (e) => {
    reset({
      email: e.email,
      name: e.name,
      image: e.image,
      phone: e.phone,
      address: e.address,
    });
    setOpenD(true);
  };

  const handleSubmitEdit = async (data) => {
    setIsloading(true);

    if (data.password.length === 0) {
      delete data.password;
    }
    delete data.cpassword;

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
      const add = await fetch("/api/user", requestOptions);
      const res = await add.json();

      if (res.success) {
        toast.success(res.message);

        update({name: data.name, phone: data.phone, address: data.address, image: data.image});

        reset();

        setOpenD(false);
      } else {
        alert({ title: res.message });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <LoadingOverlay show={true} message={"Loading..."} />;
  }

  return (
    <>
      <Toaster />
      {/* diagram container  */}
      <LoadingOverlay show={isLoading} message={"Updating Profile..."} />

      {/* Edit profile dialog */}
      <Dialog open={openD} onOpenChange={setOpenD}>
        <DialogContent className="sm:max-w-[425px] overflow-auto max-h-screen">
          <form onSubmit={handleSubmit(handleSubmitEdit)}>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Make changes to your Profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  {...register("name", {
                    required: { value: true, message: "Name is required!" },
                  })}
                  id="name"
                  type="text"
                  placeholder="Enter Your Name"
                />
                {errors.name && (
                  <div className="text-red500c text-xs ">
                    {errors.name.message}
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Image</Label>
                <Input
                  {...register("image")}
                  placeholder="Image Url"
                  id="image"
                  type="text"
                />
                {errors.image && (
                  <div className="text-red500c text-xs ">
                    {errors.image.message}
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: { value: true, message: "Email is required!" },
                  })}
                  disabled
                  placeholder="Enter Email"
                />
                {errors.email && (
                  <div className="text-red500c text-xs ">
                    {errors.email.message}
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="text"
                  {...register("phone", {
                    required: {
                      value: true,
                      message: "Phone number is required!",
                    },
                    minLength: { value: 9, message: "At least 9 character" },
                    maxLength: { value: 15, message: "Maximum 15 character!" },
                  })}
                  placeholder="Enter Phone Number"
                />
                {errors.phone && (
                  <div className="text-red500c text-xs ">
                    {errors.phone.message}
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  {...register("address", {
                    required: { value: true, message: "Address is required!" },
                  })}
                  placeholder="Enter Address"
                />
                {errors.address && (
                  <div className="text-red500c text-xs ">
                    {errors.address.message}
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center font-bold">
                  <h4 className={'text-sm rounded-md bg-gray100c px-3 py-1'} >Change Password</h4>
                </div>
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  {...register("password", {
                    minLength: { value: 6, message: "At least 6 character!" },
                    maxLength: { value: 10, message: "Maximum 10 character!" },
                  })}
                  id="password"
                  type="password"
                  placeholder="Enter Password"
                />
                {errors.password && (
                  <div className="text-red500c text-xs ">
                    {errors.password.message}
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="cpassword">Confirm Password</Label>
                </div>
                <Input
                  id="cpassword"
                  type="password"
                  {...register("cpassword", {
                    minLength: { value: 6, message: "At least 6 character!" },
                    maxLength: { value: 10, message: "Maximum 10 character!" },
                    validate: (value) =>
                      value === getValues("password") ||
                      "Password do not match!",
                  })}
                  placeholder="Enter Password Again"
                />
                {errors.cpassword && (
                  <div className="text-red500c text-xs ">
                    {errors.cpassword.message}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <div className="mt-3 space-x-3">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>


      <div className="w-ful flex-between bg-gray100c my-2 rounded-md container mx-auto px-3 py-4 gap-3 max-[500px]:flex-col flex-wrap">
        <h1 className="text-2xl font-bold flex-center ">Dashboard</h1>
        <div className=" bg-gray50c p-2 rounded-md w-fit flex-between flex-wrap flex-col max-[500px]:flex-1 ">
          <div className="flex-center gap-3 w-fit flex-wrap md:flex-nowrap">
            <div className=" min-h-20 min-w-20 relative">
              <Image
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="rounded-full min-h-20 min-w-20 object-cover object-center"
                src={session.user.image || "/profilea.jpg"}
                alt=""
              />
            </div>
            <div className="flex flex-col w-fit overflow-hidden text-ellipsis text-nowrap">
              <span className="text-lg font-bold w-full overflow-hidden text-ellipsis text-wrap">{session.user.name}</span>
              <span className="overflow-hidden text-ellipsis text-nowrap w-full box-border text-xs">{session.user.email}</span>
            </div>
          </div>
          <div className="flex-center flex-wrap gap-2">
            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={() => handleEdit(session.user)}
              type="button"
            >
              Edit Profile
            </Button>
            <Button
              className="cursor-pointer"
              onClick={() => signOut()}
              type="button"
            >
              log Out
            </Button>
          </div>
        </div>
        {/* <div className="head h-12 ">{session.user.name}</div>
          <div className="head h-12 ">
            {session.user.email}
          </div>
 */}
      </div>
    </>
  );
};

export default DashNav;
