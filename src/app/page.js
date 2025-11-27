"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import Image from "next/image";
import { toast } from "sonner";
import { useEffect, useMemo, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/store/productSlice";
import Product from "@/components/modules/Product";
import SkeletonProduct from "@/components/modules/SkeletonProduct";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import styles from "./home.module.css";
import { ArrowLeft, ArrowRightIcon } from "lucide-react";
import { fetchCart } from "@/store/cartSlice";
import { useSession } from "next-auth/react";

export default function Home() {
  const [email, setEmail] = useState();
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const { items, loading, error } = useSelector((state) => state.products);
  const [homeItems, setHomeItems] = useState([]);
  const [load, setload] = useState(false);
  const scrollRef = useRef(null);
  const [scrollInfo, setScrollInfo] = useState({
    visible: 0,
    total: 0,
    left: 0,
  });

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      setScrollInfo({
        visible: el.clientWidth,
        total: el.scrollWidth,
        left: el.scrollLeft,
      });
    };
    // Set initial values
    handleScroll();

    // Listen for scrolling or resizing
    el.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [items, homeItems]);
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (session) {
      dispatch(fetchCart(session.user.id));
    }
  }, [session, dispatch]);

  useEffect(() => {
    let a = async () => {
      if (items && items.length > 0) {
        setHomeItems(items.filter((item) => item.inStock).slice(-10));
      }
    };
    a();
  }, [items]);

  // 2️⃣ Define functions to scroll left/right
  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -scrollInfo.visible + (scrollInfo.visible * 10) / 100,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: scrollInfo.visible - (scrollInfo.visible * 10) / 100,
      behavior: "smooth",
    });
  };

  const handleSubs = (e) => {
    e.preventDefault();
    toast.info(`Subscribed with ${email}`, {
      description: `${new Date().toUTCString()}`,
    });
    setEmail("");
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const formd = new FormData(e.target);
    const name_m = formd.get("name");
    const email_m = formd.get("email");
    const message_m = formd.get("message");

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      name: name_m,
      email: email_m,
      message: message_m,
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      const add = await fetch("/api/message", requestOptions);
      const res = await add.json();

      if (res.success) {
        toast.success(res.message);
        e.target.reset();
      } else {
        alert({ title: res.message });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-auto bg-gray400c ">
      <Toaster />
      {/* Hero Section  */}
      <section
        id=" "
        className="flex-center min-h-[calc(100vh-40px)]  bg-gray400c bg-linear-65 from-purple-500 to-pink-500"
      >
        <div className="min-h-[600px] py-4 flex-center items-stretch gap-2 flex-col md:flex-row w-screen container mx-auto">
          {/* right side */}
          <div className="flex-1 box-border px-3 flex-col flex gap-4">
            <h1 className="text-start text-5xl text-shadow-lg text-shadow-blue-600 font-bold w-2/3 sm:w-1/2 ">
              Welcome To Our Next-Ecom Website
            </h1>
            <p className="text-sm w-2/3 sm:w-1/3 ">
              Boost sales, enhance customer experience, and streamline
              operations with our cutting-edge AI technology.
            </p>
            {/* subsctibe  */}
            <h3 className="text-lg font-bold text-gray200c">
              Get Promotional Email
            </h3>
            <form
              onSubmit={handleSubs}
              className="flex gap-3 flex-col sm:flex-row"
            >
              <Input
                type="email"
                name="email"
                id="subemail"
                onChange={(e) => setEmail(e.target.value)}
                value={email || ""}
                className=" bg-gray300c placeholder:text-gray50c0 "
                placeholder="Enter Email"
                required
              />
              <button type="submit" className="w-fit primary-btn text-background">
                Subscribe
              </button>
            </form>
          </div>

          {/* left side */}
          <div className="flex-1 p-3 min-h-[400px] relative ">
            <Image
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="eager"
              priority
              className="rounded-lg object-cover object-center  mix-blend-darken"
              src="/hero-header-landing-page.jpg"
              alt=""
            />
          </div>
        </div>
      </section>

      {/* about section  */}
      <section
        id="about-us"
        className="min-h-[500px] pt-16 py-4 bg-gray700c bg-linear-65 from-red500c to-blue-500"
      >
        <div className="flex-center items-stretch flex-col md:flex-row">
          {/* left side */}
          <div className="left w-full flex-1  max-w-[700px] flex justify-center flex-col gap-4 p-3">
            <h1 className="text-3xl font-bold text-shadow-lg text-shadow-blue-400">
              About Us
            </h1>
            <p className="text-sm font-light text-gray600c w-full">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam
              iusto, magni fugiat animi est doloremque odit illum qui deserunt
              neque earum veritatis dignissimos quo, ipsam deleniti ipsum minima
              ab perspiciatis exercitationem iure. Numquam, odit?
            </p>
            <Button
              onClick={() => console.log("know more")}
              variant={"destructive"}
              type="button"
              className={"w-fit"}
            >
              Know More
            </Button>
          </div>
          <div className="left flex-1 min-h-[500px] w-full max-w-[500px] relative p-3">
            <Image
              fill
              src="/about-us-landing-page.jpg"
              className="w-full h-full object-cover object-center mix-blend-darken"
              alt="about image"
            />
          </div>
        </div>
      </section>
      {/* Contact section  */}
      <section
        id="contact"
        className="min-h-[500px] pt-16 bg-background bg-linear-65 from-cyan-400 to-pink-500"
      >
        <h2 className="w-fit mx-auto py-3 text-2xl font-bold">Contact Us</h2>

        <div className="flex-center items-stretch flex-col md:flex-row relative ">
          {/* left side */}{" "}
          <div className="left flex-center flex-1 min-h-[500px] w-full max-w-[550px] relative p-3">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14533.228807213362!2d88.96267738897703!3d24.405392899359143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fc115ab462286b%3A0xe61e93f095bf7093!2sNatore%20Station%20Bypass!5e0!3m2!1sen!2sbd!4v1761743426306!5m2!1sen!2sbd"
              className="w-full min-h-[500px] mx-auto h-full rounded-md border-2 border-gray500c"
              loading="lazy"
            ></iframe>
            <div className=" font-bold p-3 flex flex-col absolute z-20 bottom-5 ring ring-fuchsia-400 bg-gray100c rounded-md">
              <span>
                <a href="tel:+09222333444">Phone : +09222333444</a>
              </span>
              <span>
                <a href="mailto:admin@ne.com">Email : admin@ne.com</a>
              </span>
            </div>
          </div>
          <div className="left w-full flex-1  max-w-[700px] flex justify-center flex-col gap-4 p-3">
            <h1 className="text-3xl font-bold text-shadow-lg text-shadow-blue-400">
              Contact Us
            </h1>
            <form
              onSubmit={handleSendMessage}
              className="flex flex-col bg-gray200c rounded-md border-2 border-gray400c p-3"
            >
              <h3 className="text-lg font-semibold">Leave A Message Here!</h3>
              <div className="grid grid-cols-1 space-y-2">
                <Label htmlFor="name">Name </Label>
                <Input
                  placeholder="Enter Your Name"
                  type="text"
                  name="name"
                  id="name"
                  className={"rounded-md p-2  bg-gray100c"}
                  required
                />
              </div>
              <div className="grid grid-cols-1 space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  placeholder="Enter Email"
                  type="email"
                  name="email"
                  id="email"
                  className={"rounded-md p-2  bg-gray100c"}
                  required
                />
              </div>
              <div className="grid grid-cols-1 space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea
                  placeholder="Write a message..."
                  name="message"
                  id="message"
                  className={"bg-gray100c h-[100px] p-2 "}
                  required
                />
              </div>
              <Button type="submit" className={"w-fit my-3"}>
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* about section  */}
      <section
        id="services"
        className="min-h-[500px] p-4 pt-16 bg-gray700c bg-linear-65 from-green-500 to-blue-500 flex-col relative"
      >
        <h2 className="w-fit mx-auto py-3 text-2xl font-bold">
          Recently Added Products
        </h2>
        <div className="relative items-center flex">
          <Button
            variant={"outline"}
            size={"icon-lg"}
            onClick={scrollLeft}
            className={`absolute left-2 z-30 ${
              scrollInfo.left === 0 ? "hidden" : ""
            }`}
          >
            <ArrowLeft />
          </Button>
          <Button
            variant={"outline"}
            size={"icon-lg"}
            onClick={scrollRight}
            className={`absolute right-2 z-30 ${
              scrollInfo.left > scrollInfo.total - scrollInfo.visible - 10
                ? "hidden "
                : ""
            }`}
          >
            <ArrowRightIcon />
          </Button>
          <div
            ref={scrollRef}
            className={`flex bg-violet100c p-4 gap-3 rounded-md w-full overflow-auto items-center ${styles.hidescrollbar}`}
          >
            {homeItems && homeItems.length > 0
              ? homeItems.map((item) => {
                  return (
                    <div key={item.productId} className="shrink-0">
                      <Product item={item} />
                    </div>
                  );
                })
              : Array.from("rakib").map((e, ind) => (
                  <div key={ind} className="flex flex-col space-y-3 w-[350px]">
                    <Skeleton className="h-[225px] w-[350px] bg-gray200c rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-3/4  bg-gray200c" />
                      <Skeleton className="h-6 w-3/5  bg-gray200c" />
                    </div>
                  </div>
                ))}
          </div>
        </div>
        <div className="flex-center">
          <Button
            onClick={() => router.push("/products")}
            variant={"outline"}
            className={"w-fit mx-auto"}
          >
            Show All
          </Button>
        </div>
      </section>
    </div>
  );
}
