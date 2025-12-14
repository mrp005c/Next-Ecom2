"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const AdminHeader = ({ children }) => {
  const { data: session, status } = useSession();

  if (session && session.user.role === "admin") {
    return (
      <div className="h-8 max-h-fit w-full bg-gray300c text-foreground text-sm flex-between px-2 md:px-3 sticky top-0 z-60">
        <h3 className="text-md font-bold space-x-2">
          <Link href="/admin" className="px-2 py-1 rounded-sm bg-gray200c">
            Admin Panel
          </Link>
          <Link href="/" className="px-2 py-1 rounded-sm bg-gray200c">
            Site
          </Link>
        </h3>
        <div className="flex-center gap-4 flex-wrap">
          {children}

          <div className="text-[10px] overflow-hidden text-ellipsis">
            <Link
              className="rounded-md px-2 py-0.5 bg-gray200c"
              href={"/dashboard"}
            >
              {session.user.email}
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return;
};

export default AdminHeader;
