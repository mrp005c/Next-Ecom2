"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import React from "react";

const TrialPage = () => {
  const { data: session, status, update } = useSession();
  const handleClick = async () => {
    await update({ name: "Muhammad Rakib" });
  };

  if (status === "authenticated") {
    return (
      <div>
        <Button onClick={()=> update({...session.user, name: 'Muhammad Rakib patoyari'})}>Edit name</Button>
        <div>Name: {session.user.name}</div>
      </div>
    );
  }

  return <div>login</div>;
};

export default TrialPage;
