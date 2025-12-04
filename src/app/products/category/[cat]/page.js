"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const CatagoryPage = () => {
  const params = useParams();
  const cat = params.cat;
  console.log(cat);
  return (
    <div className="flex-center gap-3 min-h-[calc(100vh-300px)] mx-auto box-border  min-w-[calc(100vw-100)] p-2 bg-gray100c rounded-md">
      <span>find with category</span>
      <span className="font-semibold rounded-sm bg-gray200c p-2">{cat}</span>
    </div>
  );
};

export default CatagoryPage;
