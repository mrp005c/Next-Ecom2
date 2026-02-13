import Image from "next/image";
import Link from "next/link";
import React from "react";

const SiteLogo = () => {
  return (
    <Link href={"/"} className="p-3 w-fit mx-auto rounded-bl-4xl rounded-xs rounded-tr-4xl flex-center bg-violet200c">
      <span className="flex-center relative h-12 w-12">
        <Image
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="eager"
          src="/favicon.ico"
          alt="sitelogo"
          className="w-12 overflow-hidden object-contain object-left"
        />
      </span>
      <span className="italic font-semibold text-xl text-background text-shadow-md text-shadow-foreground">Next Ecom</span>

      
    </Link>
  );
};

export default SiteLogo;
