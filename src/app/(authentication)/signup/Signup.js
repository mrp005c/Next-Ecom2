"use client";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoLogoGithub, IoLogoGoogle } from "react-icons/io5";
import { useDialog } from "@/components/modules/AlertDialog";
import Link from "next/link";

import { useForm, SubmitHandler } from "react-hook-form";
import LoadingOverlay from "@/components/modules/LoadingOverlay";

export default function SignInPage() {
  const { status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [ConfirmAlertDialog, alert] = useDialog();
  // form handle
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const handleSubmitSign = async (data) => {
    setIsLoading(true);
    delete data.cpassword;
    
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
      const add = await fetch("/api/user", requestOptions);
      const res = await add.json();

      if (res.success) {
        router.replace("/login");
      } else {
        alert({ title: res.message });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  return (
    <div className="flex-center p-2">
      <LoadingOverlay show={isLoading} message={"Singing In... Wait!"}/>
      {ConfirmAlertDialog}
      <Card className="w-full max-w-md bg-gray100c">
        <CardHeader>
          <CardTitle>Sign Up your account</CardTitle>
          <CardDescription>
            Enter your name, email, phone, passowrd below to sign in to your
            account
          </CardDescription>
          <CardAction>
            <Link href="/login">
              <Button className="cursor-pointer" variant="link">
                Log in
              </Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleSubmitSign)}>
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
                <Input {...register("image")} placeholder="Image Url" id="image" type="text" />
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
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  {...register("password", {
                    required: { value: true, message: "Password is required!" },
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
                    required: {
                      value: true,
                      message: "Confirm password is required!",
                    },
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
            <Button type="submit" className="w-full my-3">
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            onClick={() => signIn("google")}
            variant="outline"
            className="w-full"
          >
            <IoLogoGoogle /> Sign up with Google
          </Button>
          <Button
            onClick={() => signIn("github")}
            variant="outline"
            className="w-full"
          >
            <IoLogoGithub /> Sign up with GitHub
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
