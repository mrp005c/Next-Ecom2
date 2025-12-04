"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import NotFound from "@/app/not-found";
import Link from "next/link";

const PageOrder = () => {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState();
  const { data: session } = useSession();
  const params = useParams();
  const oid = params.oid;
  const [pay, setPay] = useState(searchParams.get("pay"));
  const [notfoundp, setNotfoundp] = useState(false);

  const checkout = async (formData) => {
    const payload = {
      orderId: formData._id,
      userId: formData.userId,
      products: formData.products,
    };

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    window.location.href = data.url;
  };

  const loadOrderId = useCallback(async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    try {
      const data = await fetch(
        `/api/orders/order/orderid?oid=${oid}`,
        requestOptions
      );
      const res = await data.json();
      setNotfoundp(res.error);
      if (res.success) {
        setOrder(res.result);
      }
    } catch (error) {
      console.log(error);
    }
  }, [oid]);

  useEffect(() => {
    const a = async () => {
      loadOrderId();
    };
    a();
  }, [loadOrderId]);

  useEffect(() => {
    if (order && pay === "yes") {
      const a = async () => {
        console.log(pay);
        await checkout(order);
      };
      a();
    }
  }, [order, pay]);

  useEffect(() => {
    if (notfoundp) {
      return notFound();
    }
  }, [notfoundp]);

  return (
    <div>
      {order ? (
        <div className="container mx-auto p-3 rounded-sm m-2 bg-gray100c flex flex-col gap-3">
          <span className="px-2 py-1 font-bold rounded-sm bg-violet100c w-full overflow-hidden text-ellipsis">
            Order Id: {order._id}
          </span>
          <h3 className="font-bold text-lg">Client Details</h3>

          <div className="info flex flex-wrap flex-col gap-3 font-semibold text-sm bg-violet100c">
            <span className="px-2 py-0.5 rounded-sm bg-gray50c">
              Name: {order.name}
            </span>
            <span className="px-2 py-0.5 rounded-sm bg-gray50c">
              Email: {order.email}
            </span>
            <span className="px-2 py-0.5 rounded-sm bg-gray50c">
              Phone: {order.phone}
            </span>
            <span className="px-2 py-0.5 rounded-sm bg-gray50c">
              Address: {order.address}
            </span>
            <span>Status</span>
            <div className="bg-gray50c space-x-3 px-3 py-2 rounded-sm">
              <span
                className={`p-2 rounded-sm box-border  ${
                  order.paid ? "bg-violet100c" : "bg-red300c"
                }`}
              >
                {order.paid ? "Paid" : "Unpaid"}
              </span>
              <span
                className={`p-2 rounded-sm box-border  ${
                  order.status != "pending" ? "bg-violet100c" : "bg-red300c"
                }`}
              >
                {order.paid ? "Confirmed" : "Pending"}
              </span>
            </div>
          </div>

          <h3 className="font-bold text-lg">Products</h3>
          <div className="flex flex-col justify-center items-stretch  gap-3 text-xs">
            <div className=" w-full font-bold max-w-[500px] flex-between gap-3 flex-1  mx-auto">
              <span className="p-2 flex-center rounded-sm bg-gray100c font-bold">
                No.
              </span>
              <span className="shrink flex-center flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                Name
              </span>
              <span className="flex-center">Price</span>
            </div>
            {order.products &&
              order.products.map((item, ind) => (
                <div
                  key={ind}
                  className=" w-full max-w-[500px] flex-between gap-3 flex-1  p-2 rounded-sm bg-violet200c mx-auto"
                >
                  <span className="p-2 rounded-sm bg-gray100c font-bold">
                    {ind + 1}
                  </span>
                  <Link
                    href={`/products/${item.productId}`}
                    className="shrink flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    {item.name}
                  </Link>
                  <span>${item.price}</span>
                </div>
              ))}
            <div className=" w-full text-base font-bold max-w-[500px] flex-between gap-3 flex-1  mx-auto">
              <span className="p-2 flex-center rounded-sm bg-gray100c font-bold">
                Total Items: {order.products && order.products.length}
              </span>
              {/* <span className="shrink flex-center flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                Name
              </span> */}
              <span className="flex-center">
                {" "}
                $
                {order.products &&
                  order.products.reduce((a, b) => a + b.price, 0).toFixed(2)}
              </span>
            </div>
          </div>
          {session && session.user.id === order.userId && !order.paid && (
            <Button
              className={"w-fit mx-auto text-sm"}
              onClick={() => checkout(order)}
            >
              Pay Now
            </Button>
          )}
        </div>
      ) : (
        <div className="flex-center container mx-auto py-2">
          <Skeleton
            className={"h-[500px] w-full p-3 rounded-sm flex-around flex-col"}
          >
            <Skeleton className={"h-[300px] w-full bg-gray100c"} />
            <Skeleton
              className={"h-[50px] w-full max-w-[300px] mx-auto bg-gray100c"}
            />
          </Skeleton>
        </div>
      )}
    </div>
  );
};

export default PageOrder;
