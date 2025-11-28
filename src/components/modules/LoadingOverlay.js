"use client";

// import { Loader2 } from "lucide-react";
import { Mosaic } from "react-loading-indicators";

export default function LoadingOverlay({ show = false, message }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex-center flex-col  bg-[#524d4d92] backdrop-blur-sm p-3 z-9999">
        <div className="flex-center flex-col h-full w-full bg-[#faf6f6f8] rounded-md max-h-[300px] max-w-[400px] box-border ">
      <Mosaic speedPlus={-2} color="#32cd32" size="medium" text="" textColor="" />
      {message && (
          <p className="mt-3 text-base  text-gray700c font-medium">{message}</p>
        )}
        </div>
    </div>
  );
}

     
