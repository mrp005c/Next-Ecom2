"use client"
import { Button } from '@/components/ui/button';
import React from 'react'

const Page = () => {
    const openLoginPopup = () => {
  window.open(
    "/login",
    "login",
    "width=500,height=600"
  );
};

  return (
    <div>
      <Button onClick={openLoginPopup}>Login</Button>
    </div>
  )
}

export default Page

