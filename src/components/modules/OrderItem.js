import Link from "next/link";
import React from "react";

const OrderItem = ({ item }) => {
  return (
    <div key={item._id} className="max-w-[1000px] w-full">
      <div className="flex flex-col ring-2 ring-gray500c rounded-md p-2 relative">
        <Link href={`/order/${item._id}`} className="absolute top-1 right-1 p-2 bg-violet300c rounded-md text-sm text-foreground">
          View
        </Link>
        <span className="text-ellipsis overflow-hidden text-xs rounded-md dark:bg-purple-800 bg-purple-200 p-2 max-w-fit">
          Order Id: {item._id}
        </span>
        <div className="flex items-center justify-start gap-x-3 w-full flex-wrap bg-gray100c  rounded-md text-lg">
          <span>Name: {item.name}</span>
          <span>Email: {item.email}</span>
          <span>Phone: {item.phone}</span>
          <span>Address: {item.address}</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-3">
          <span>
            Payble Amount:
            {item.products.length > 0 &&
              item.products.reduce((a, b) => a + b.price, 0)}
            $
          </span>
          <span>Items: {item.products.length}</span>
        </div>
        <div className="w-fit">
          Status:
          <span
            className={`rounded-md p-1 text-white ${
              item.status == "pending" ? "bg-blue-500 dark:bg-blue-700" : ""
            } ${item.status == "confirmed" ? "bg-gray-600" : ""} ${
              item.status == "delivered" ? "bg-green-500 dark:bg-green-700" : ""
            }`}
          >
            {item.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
