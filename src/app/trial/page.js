"use client";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import React from "react";
import { toast } from "sonner";

const Page = () => {
  const checkout = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "230948",
        name: "Rakib",
        email: "mrp@gmail.com",
        phone: "10389182340",
        address: "Narayanpur, Natore",
        products: [{ name: "Test Product", price: 1000, quantity: 4 }],
      }),
    });

    const data = await res.json();
    window.location.href = data.url;
  };

  const handleClick = () => {
    toast.success("event has been created", {
      description: new Date().toUTCString(),
      action: {
        label: "Check Out",
        onClick: () => console.log("Undo"),
      },
    });
  };

  return (
    <div>
      <Toaster/>
      <Button onClick={checkout}>Checkout</Button>
      <Button onClick={handleClick}>Show Toast</Button>
    </div>
  );
};

export default Page;
