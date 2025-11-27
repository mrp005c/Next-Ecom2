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

export default function SignInPage() {
  const { status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({});
  const [ConfirmAlertDialog, alert, confirm] = useDialog();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formd = new FormData(e.target);
    const cp = formd.get("cpassword");

    if (formData.password !== cp) {
      alert({ title: "Password Didn't Match!" });
      return;
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify(formData);
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
    }
  };
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  return (
    <div className="flex-center p-4">
      {ConfirmAlertDialog}
      <Card className="w-full max-w-sm bg-gray100c">
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
          <form onSubmit={handleSubmit}>
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
                  onChange={handleChange}
                  value={formData.email || ""}
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
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="cpassword">Confirm Password</Label>
                </div>
                <Input
                  name="cpassword"
                  id="cpassword"
                  type="password"
                  required
                />
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
