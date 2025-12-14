"use client";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { IoCartOutline, IoReload } from "react-icons/io5";
import { RiCoupon4Line } from "react-icons/ri";
import { MdManageAccounts, MdOutlinePayment, MdSettings } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "@/store/cartSlice";
import LoadingOverlay from "@/components/kit/LoadingOverlay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderItem from "@/components/kit/OrderItem";
import CartProductItem from "@/components/kit/cartProduct";

const DashBoardPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { cartItems, loading, error } = useSelector((state) => state.cart);
  const [tab, setTab] = useState(searchParams.get("tab"));
  // Orders
  const [orders, setOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [isloading, setIsloading] = useState(false);

  const LoadCart = useCallback(
    async (id) => {
      dispatch(fetchCart(id));
    },
    [dispatch]
  );

  const loadOrders = useCallback(async (id) => {
    setIsloading(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    try {
      const data = await fetch(
        `/api/orders/order?userid=${id}`,
        requestOptions
      );
      const res = await data.json();
      if (res.success) {
        setOrders(res.result);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  }, []);

  // tab change effect
  useEffect(() => {
    if (session && tab === "cart" && cartItems.length === 0) {
      LoadCart(session.user.id);
    }
    if (session && tab === "orders" && orders.length === 0) {
      loadOrders(session.user.id);
    }
  }, [tab, LoadCart, cartItems.length, orders.length, session, loadOrders]);

  const handleRomoveFromCart = async (newCartItem) => {
    if (!session) {
      toast.info("Please Login First.");
      router.push("/login");
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const userId = session.user.id;
    const raw = JSON.stringify({
      email: session.user.email,
      userId: session.user.id,
      products: newCartItem,
    });

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      const add = await fetch("/api/cart", requestOptions);
      const res = await add.json();
      if (res.success) {
        await LoadCart(userId);
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const u = async () => {
      if (orders && orders.length > 0) {
        setPendingOrders(orders.filter((e) => e.status === "pending"));
        setConfirmedOrders(orders.filter((e) => e.status === "confirmed"));
        setDeliveredOrders(orders.filter((e) => e.status === "delivered"));
      }
    };
    u();
  }, [orders]);

  if (status === "authenticated") {
    return (
      <div className="container mx-auto ">
        <LoadingOverlay show={isloading} message={"Loading"} />
        {/* Tab links  */}
        <div className=" flex-center gap-2 flex-wrap p-3 bg-gray200c  border border-gray200c rounded-md">
          <button
            className={`${
              tab === "profile" || !tab ? "bg-red200c" : ""
            } sec-btn transition-all `}
            onClick={() => {
              setTab("profile");
              router.push("/dashboard?tab=profile");
            }}
            type="button"
          >
            <MdManageAccounts className="text-4xl" />
            <span className="text-xs">Profile</span>
          </button>
          <button
            className={`${
              tab === "cart" ? "bg-red200c" : ""
            } sec-btn transition-all `}
            onClick={() => {
              setTab("cart");
              router.push("/dashboard?tab=cart");
            }}
            type="button"
          >
            <IoCartOutline className="text-4xl" />
            <span className="text-xs">Cart</span>
          </button>
          <button
            className={`${
              tab === "orders" ? "bg-red200c" : ""
            } sec-btn transition-all `}
            onClick={() => {
              setTab("orders");
              router.push("/dashboard?tab=orders");
            }}
            type="button"
          >
            <MdOutlinePayment className="text-4xl" />
            <span className="text-xs">Orders</span>
          </button>
          <button
            className={`${
              tab === "coupon" ? "bg-red200c" : ""
            } sec-btn transition-all `}
            onClick={() => {
              setTab("coupon");
              router.push("/dashboard?tab=coupon");
            }}
            type="button"
          >
            <RiCoupon4Line className="text-4xl" />
            <span className="text-xs">Coupon</span>
          </button>
          <button
            className={`${
              tab === "setting" ? "bg-red200c" : ""
            } sec-btn transition-all `}
            onClick={() => {
              setTab("setting");
              router.push("/dashboard?tab=setting");
            }}
            type="button"
          >
            <MdSettings className="text-4xl" />
            <span className="text-xs">Setting</span>
          </button>
        </div>
        {/* {container } */}
        <div className="flex-1 bg-gray50c border border-gray200c rounded-md p-2">
          {/* home tab  */}
          {(tab === "profile" || !tab) && (
            <>
              <div className="flex-between bg-violet100c p-2 border border-gray200c rounded-md">
                <h1 className="text-2xl font-bold ">Profile</h1>
                <Button
                  size={"icon"}
                  // onClick={analytics}
                  variant="outline"
                  className="font-bold text-2xl"
                >
                  <IoReload />
                </Button>
              </div>
              {session && (
                <div className="overflow-auto">
                  <table className=" bg-gray50c rounded-xl space-y-3 w-full text-sm">
                    <tbody>
                      <tr className="">
                        <td className="border px-2 font-bold">Name:</td>
                        <td className="px-2  py-1 border border-gray200c rounded-xs box-border bg-gray100c w-full">
                          {session.user.name}
                        </td>
                      </tr>
                      <tr className="">
                        <td className="border px-2 font-bold">Email:</td>
                        <td className="px-2  py-1 border border-gray200c rounded-xs box-border bg-gray100c">
                          {session.user.email}
                        </td>
                      </tr>
                      <tr className="">
                        <td className="border px-2 font-bold">Phone:</td>
                        <td className="px-2 py-1 border border-gray200c rounded-xs box-border bg-gray100c">
                          {session.user.phone}
                        </td>
                      </tr>
                      <tr className="">
                        <td className="border px-2 font-bold">Address:</td>
                        <td className="px-2 py-1 border border-gray200c rounded-xs box-border bg-gray100c">
                          {session.user.address}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Products tab */}
          {tab === "cart" && (
            <div className="space-y-3">
              <div className="flex-between bg-violet100c p-2 border border-gray200c rounded-md">
                <h2 className="text-2xl font-bold ">Cart</h2>

                <Button
                  size={"icon"}
                  onClick={() => LoadCart(session.user.id)}
                  variant="outline"
                  className="font-bold text-2xl"
                >
                  <IoReload />
                </Button>
              </div>
              <div className="p-2 bg-gray100c  rounded-md flex-center flex-col gap-2">
                {cartItems && cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <CartProductItem
                      key={item.cartP}
                      item={item}
                      handleRomoveFromCart={handleRomoveFromCart}
                    />
                  ))
                ) : (
                  <h1>No item to show!</h1>
                )}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {tab === "orders" && (
            <div>
              <div className="flex-between bg-violet100c p-2 border border-gray200c rounded-md">
                <h1 className="text-2xl font-bold ">Orders</h1>
                <Button
                  size={"icon"}
                  onClick={() => loadOrders()}
                  variant="outline"
                  className="font-bold text-2xl"
                >
                  <IoReload />
                </Button>
              </div>
              <Tabs defaultValue="pending">
                <div className="flex-center p-2">
                  <TabsList className={"flex-center flex-wrap"}>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                    <TabsTrigger value="delivered">Delivered</TabsTrigger>
                    <TabsTrigger value="all">All</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="pending">
                  <div className="p-3 space-y-3 flex-center flex-col">
                    {pendingOrders &&
                      pendingOrders.map((item) => (
                        <OrderItem key={item._id} item={item} />
                      ))}
                  </div>
                </TabsContent>
                <TabsContent value="confirmed">
                  <div className="p-3 space-y-3 flex-center flex-col">
                    {confirmedOrders &&
                      confirmedOrders.map((item) => (
                        <OrderItem key={item._id} item={item} />
                      ))}
                  </div>
                </TabsContent>
                <TabsContent value="delivered">
                  <div className="p-3 space-y-3 flex-center flex-col">
                    {deliveredOrders &&
                      deliveredOrders.map((item) => (
                        <OrderItem key={item._id} item={item} />
                      ))}
                  </div>
                </TabsContent>
                <TabsContent value="all">
                  <div className="p-3 space-y-3 flex-center flex-col">
                    {orders &&
                      orders.map((item) => (
                        <OrderItem key={item._id} item={item} />
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* coupon tab */}
          {tab === "coupon" && (
            <>
              <div className="flex-between bg-violet100c p-2 border border-gray200c rounded-md">
                <h1 className="text-2xl font-bold ">Coupon</h1>
                <Button
                  size={"icon"}
                  // onClick={analytics}
                  variant="outline"
                  className="font-bold text-2xl"
                >
                  <IoReload />
                </Button>
              </div>
            </>
          )}
          {/* setting tab */}
          {tab === "setting" && (
            <>
              <div className="flex-between bg-violet100c p-2 border border-gray200c rounded-md">
                <h1 className="text-2xl font-bold ">Setting</h1>
                <Button
                  size={"icon"}
                  // onClick={analytics}
                  variant="outline"
                  className="font-bold text-2xl"
                >
                  <IoReload />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
};

export default DashBoardPage;
