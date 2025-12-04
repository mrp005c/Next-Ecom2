import Link from "next/link";
import React from "react";
import { RiErrorWarningFill } from "react-icons/ri";

const Page = ({ searchParams }) => {

  const oid = searchParams.oid;

  return (
    <div className="flex-center w-full  h-full my-4  overflow-hidden">
      <div className="p-3 rounded-md bg-gray100c flex-center flex-col gap-4">
        <h3 className="text-3xl font-bold ">Payment Unseccessful! </h3>
        <div className="text-6xl font-bold">
          <RiErrorWarningFill />
        </div>
        <Link className="primary-btn" href="/">
          Return Home
        </Link>

        {oid && (
          <Link className="sec-btn text-sm" href={`/order/${oid}`}>
            View Order
          </Link>
        )}
        <div>{oid}</div>
      </div>
    </div>
  );
};

export default Page;

export const metadata = {
  title: "Payment Cancelled  | Next Ecom",
  description: "Details of this page",
};
