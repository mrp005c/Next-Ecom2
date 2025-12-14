"use client";
import { Button } from "@/components/ui/button";
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
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDialog } from "@/components/kit/AlertDialog";
import { useEffect, useState } from "react";
import { IoLogoGithub, IoLogoGoogle } from "react-icons/io5";
import { useForm } from "react-hook-form";
import LoadingOverlay from "@/components/kit/LoadingOverlay";
import SiteLogo from "@/components/kit/SiteLogo";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redUrl = searchParams.get("redurl");
  const [ConfirmAlertDialog, alert] = useDialog();
  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors },
  } = useForm();

  const handleSubmitLg = async (data) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (!res.error) {
      router.push(`${decodeURI(redUrl)}`); // auto redirect, admin will be redirected later
    } else {
      if (res.error == "Invalid password") {
        setError("password", { message: res.error });
        setFocus("password");
      }
      if (res.error == "User not found") {
        setError("email", { message: res.error });
        setFocus("email");
      }

      console.log(res);
      // alert({ title: res.error , description: "Try with another!"});
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      if (window.opener?.location) {
        // window.opener.location.reload();
        window.close();
      }
      if (redUrl) {
        return router.push(`${decodeURI(redUrl)}`);
      }
      return router.push("/");
    }
  }, [status, router, redUrl]);

  if (status === "loading") {
    return <LoadingOverlay show={true} message={"Loading..."} />;
  }
  return (
    <div className="flex-center p-4 min-h-screen">
      {ConfirmAlertDialog}
      {/* <input type="email" name="" id="" /> */}
      <Card className="w-full max-w-md bg-gray100c">
        <SiteLogo/>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Link className="h-full w-full" href="/signup">
              <Button className="cursor-pointer" variant="link">
                Sign Up
              </Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleSubmitLg)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register("email", {
                    required: { value: true, message: "Email is required!" },
                  })}
                  id="email"
                  type="email"
                  placeholder="Enter Username / Email"
                  className={`${errors.email ? "border-l-8 border-l-red-500" : ""}`}
                />
                {errors.email && (
                  <div className="text-red500c text-xs ">
                    {errors.email.message}
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  {...register("password", {
                    required: { value: true, message: "Password is required!" },
                  })}
                  id="password"
                  type="password"
                  placeholder="Enter Password"
                  className={`${errors.password ? "border-l-8 border-l-red-500" : ""}`}
                />
                {errors.password && (
                  <div className="text-red500c text-xs ">
                    {errors.password.message}
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full my-3">
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            onClick={() => signIn("google")}
            variant="outline"
            className="w-full"
          >
            <IoLogoGoogle /> Login with Google
          </Button>
          <Button
            onClick={() => signIn("github")}
            variant="outline"
            className="w-full"
          >
            <IoLogoGithub /> Login with GitHub
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
