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
import { useDialog } from "@/components/modules/AlertDialog";
import { useEffect, useState } from "react";
import { IoLogoGithub, IoLogoGoogle } from "react-icons/io5";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const redUrl = searchParams.get("redurl");
  const [ConfirmAlertDialog, alert] = useDialog();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (!res.error) {
      router.push(`${decodeURI(redUrl)}`); // auto redirect, admin will be redirected later
    } else {
      alert({title: res.error});
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      if (redUrl) {
        return router.push(`${decodeURI(redUrl)}`);
      }
      return router.push("/")
    }
  }, [status, router, redUrl]);
  if (status === "loading") {
    return <div>Loading your page</div>;
  }
  return (
    <div className="flex-center p-2 md:p-4">
      {ConfirmAlertDialog}
      {/* <input type="email" name="" id="" /> */}
      <Card className="w-full max-w-sm bg-gray100c">
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
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  onChange={handleChange}
                  value={formData.email || ""}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
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
                  onChange={handleChange}
                  value={formData.password || ""}
                  name="password"
                  id="password"
                  type="password"
                  required
                />
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
