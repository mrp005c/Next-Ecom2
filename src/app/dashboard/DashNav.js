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

const DashNav = () => {
  const { data: session, status, update } = useSession();
  const [formData, setFormData] = useState({});
  const [openD, setOpenD] = useState(false);
  const router = useRouter();

  const handleEdit = async (e) => {
    setFormData({
      email: e.email,
      name: e.name,
      image: e.image,
      phone: e.phone,
      address: e.address,
    });
    setOpenD(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const cpass = form.get("cpassword") ?? "";
    if ((cpass || formData.password) && cpass != formData.password) {
      toast.error("Password doesn't match");
      return;
    }

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
      const add = await fetch("/api/user", requestOptions);
      const res = await add.json();

      if (res.success) {
        toast.success(res.message);
        await update({
          user: {
            ...session.user,
            name: formData.name,
            image: formData.image,
            phone: formData.phone,
            address: formData.address,
          },
        });
        setFormData({});
        setOpenD(false);
      } else {
        alert({ title: res.message });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <LoadingOverlay show={true} message={"Loading..."}/>
  }

  return (
    <>
      <Toaster />
      {/* diagram container  */}
      <Dialog open={openD} onOpenChange={setOpenD}>
        <DialogContent className="sm:max-w-[425px] overflow-auto max-h-screen">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Make changes to your Profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    onChange={handleChange}
                    value={formData.name || ""}
                    name="name"
                    id="name"
                    type="text"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Image</Label>
                  <Input
                    onChange={handleChange}
                    value={formData.image || ""}
                    name="image"
                    id="image"
                    type="text"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    disabled
                    value={session.user.email ?? ""}
                    name="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="number"
                    onChange={handleChange}
                    value={formData.phone || ""}
                    name="phone"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    type="text"
                    onChange={handleChange}
                    value={formData.address || ""}
                    name="address"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    onChange={handleChange}
                    value={formData.password || ""}
                    name="password"
                    id="password"
                    type="password"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="cpassword">Confirm Password</Label>
                  </div>
                  <Input name="cpassword" id="cpassword" type="password" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <div className="mt-3">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <div className="w-ful flex-between bg-gray300c rounded-md container mx-auto px-3 py-4 flex-wrap">
        <h1 className="text-2xl font-bold flex-center ">Dashboard</h1>
        <div className=" bg-gray100c p-2 rounded-md flex-between flex-wrap flex-col">
          <div className="flex-center gap-3 ">
            <div className=" min-h-20 min-w-20 relative">
              <Image
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="rounded-full min-h-20 min-w-20 object-cover object-center"
                src={session.user.image || "/profilea.jpg"}
                alt=""
              />
            </div>
            <div className="flex flex-col w-full overflow-hidden text-ellipsis text-nowrap">
              <span className="text-lg font-bold">{session.user.name}</span>
              <span>{session.user.email}</span>
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
