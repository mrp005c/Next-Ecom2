import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const SkeletonPage = () => {
  return (
    <>
        <div className="flex flex-col p-3 space-y-3 w-full">
          <Skeleton className="h-[130px] bg-gray100c w-full rounded-xl" />
          <div className="space-y-2 h-[150px] flex gap-5  flex-wrap">
            <Skeleton className="h-full bg-gray100c  w-full max-w-[200px]" />
            <Skeleton className="h-full w-full bg-gray100c  flex-1" />
          </div>
          <div className="space-y-4 flex flex-col">
            <Skeleton className="h-6 bg-gray100c  w-5/6" />
            <Skeleton className="h-6 bg-gray100c  w-4/6" />
          </div>
          <div className="space-y-2 h-[150px] flex gap-5  flex-wrap">
            <Skeleton className="h-full w-full bg-gray100c  flex-1" />
            <Skeleton className="h-full bg-gray100c  w-full max-w-[200px]" />
          </div>
          <div className="space-y-4 flex flex-col">
            <Skeleton className="h-6 bg-gray100c  w-4/6" />
            <Skeleton className="h-6 bg-gray100c  w-5/6" />
          </div>
          <div className="space-y-2 h-[150px] flex gap-5  flex-wrap">
            <Skeleton className="h-full bg-gray100c  w-full max-w-[200px]" />
            <Skeleton className="h-full w-full bg-gray100c  flex-1" />
          </div>
          <div className="space-y-4 flex flex-col">
            <Skeleton className="h-6 bg-gray100c  w-5/6" />
            <Skeleton className="h-6 bg-gray100c  w-4/6" />
          </div>
         
        </div>
    </>
  );
};

export default SkeletonPage;
