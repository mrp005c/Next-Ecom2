import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const SkeletonPage = () => {
  return (
    <>
        <div className="flex flex-col space-y-3 w-full">
          <Skeleton className="h-[230px] w-full rounded-xl" />
          <div className="space-y-2 flex gap-5 ">
            <Skeleton className="h-[300px] w-full max-w-[200px]" />
            <Skeleton className="h-[300px] flex-1" />
          </div>
          <div className="space-y-2 flex flex-col gap-5 ">
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-4/6" />
          </div>
        </div>
    </>
  );
};

export default SkeletonPage;
