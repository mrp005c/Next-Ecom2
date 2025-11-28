"use client";
import { useSession } from "next-auth/react";
import DashNav from "./DashNav";
import { useRouter } from "next/navigation";

import { useEffect } from "react";
import SkeletonPage from "@/components/modules/SkeletonPage";

export default function LoginLayout({ children }) {

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <SkeletonPage />;
  }
  if (session) {
    return (
      <div >
        <DashNav />
        {children}
      </div>
    );
  }
}
