"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

const PageOrder = () => {
  const [order, setOrder] = useState();
  const { data: session } = useSession();
  const params = useParams();
  const oid = params.oid;

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

  // const order = {
  //   _id: "69252519f9e578e8d07acc35",
  //   userId: "1432",
  //   name: "Admin NE",
  //   email: "admin@ne.com",
  //   phone: "01756535801",
  //   address: "Natore, Narayanput, Tebaria",
  //   products: [
  //     {
  //       productId: 3,
  //       name: "Men’s Casual Leather Jacket",
  //       price: 90.99,
  //       quantity: 1,
  //     },
  //     {
  //       productId: 2,
  //       name: "Men’s Casual Leather Jacket",
  //       price: 90.99,
  //       quantity: 1,
  //     },
  //     {
  //       productId: 1,
  //       name: "Men’s Casual  as;ldfk as;ldkfsathis is a very good product for usd;flk Leather Jacket",
  //       price: 90.99,
  //       quantity: 1,
  //     },
  //   ],
  //   status: "pending",
  //   paid: false,
  //   createdAt: "2025-11-25T03:40:09.687Z",
  //   updatedAt: " 2025-11-25T03:40:09.687Z",
  //   __v: 0,
  // };

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
      if (res.success) {
        setOrder(res.result);
        console.log(res.result);
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

  return (
    <div>
      {order ? (
        <div className="container mx-auto p-3 rounded-sm m-2 bg-gray100c flex flex-col gap-3">
          <span className="px-2 py-1 font-bold rounded-sm bg-violet100c w-full overflow-hidden text-ellipsis">
            Order Id: {order._id}
          </span>
          <h3 className="font-bold text-lg">Client Details</h3>

          <div className="info flex flex-wrap gap-3 font-semibold text-sm bg-violet100c">
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
          </div>
          <h3 className="font-bold text-lg">Products</h3>
          <div className="flex flex-col justify-center items-stretch  gap-3 text-xs">
            {order.products &&
              order.products.map((item, ind) => (
                <div
                  key={item.productId}
                  className=" w-full max-w-[500px] flex-between gap-3 flex-1  p-2 rounded-sm bg-violet200c mx-auto"
                >
                  <span className="p-2 rounded-sm bg-gray100c font-bold">
                    {ind + 1}
                  </span>
                  <span className="shrink flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    {item.name}
                  </span>
                  <span>${item.price}</span>
                </div>
              ))}
          </div>
          <div className="flex-center bg-violet300c  px-3 py-2 rounded-sm font-semibold text-sm gap-3 flex-wrap">
            <span className="p-1 rounded-xs bg-violet200c">
              Total Items: {order.products && order.products.length}
            </span>
            <span className="p-1 rounded-xs bg-violet200c">
              Total Amount:
              ${order.products &&
                order.products.reduce((a, b) => a + b.price, 0).toFixed(2)}
            </span>
            <span
              className={`p-2 rounded-sm box-border  ${
                order.paid ? "bg-violet100c" : "bg-red300c"
              }`}
            >
              {order.paid ? "Paid" : "Unpaid"}
            </span>
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
