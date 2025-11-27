"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const redirect = async () => {
    setTimeout(() => {
      router.replace("/");
    }, 3000);
  };
  useEffect(() => {
    redirect();
  }, []);

  return <div>Your Order cancelled</div>;
};

export default Page;
