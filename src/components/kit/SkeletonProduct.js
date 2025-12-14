import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const SkeletonProduct = () => {
  let a = "rakibismynamer";
  const array = Array.from(a);
  return (
      <div className="flex-center flex-wrap gap-5 ">
        {array.map((e, ind) => (
          <div key={ind} className="flex flex-col space-y-3 w-[350px]">
            <Skeleton className="h-[225px] w-[350px] bg-gray200c rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4  bg-gray200c" />
              <Skeleton className="h-6 w-3/5  bg-gray200c" />
            </div>
          </div>
        ))}
      </div>
  );
};

export default SkeletonProduct;
