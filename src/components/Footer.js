"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Footer = () => {
  const pathname = usePathname();
  if (pathname.startsWith("/login") || pathname.startsWith("/signup") ) {
    return;
  }
  return (
    <footer className="py-4 px-2 bg-gray300c">
      <div className="flex-center container flex-col text-xs text-gray700c mx-auto">
        <span>
          &copy; {new Date().getFullYear()} All Right Reserved.
          <Link className="text-blue-400" href="/">
            Next-Ecom
          </Link>
        </span>
        <span>
          Developed By
          <Link href={"mailto:mrp005c@gmail.com"}>
            <i>
              <b>Muhammad Rakib</b>{" "}
            </i>
          </Link>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
