import { Edit2Icon } from "lucide-react";
import React from "react";
import { MdBlock } from "react-icons/md";
import { Button } from "../ui/button";
import Image from "next/image";

const UserControl = ({ user }) => {
  const handleEdit = () => {
    console.log("edit user");
  };
  const handleBlock = () => {
    console.log("block user");
  };
  return (
    <div className={`userinfo flex-1 overflow-hidden max-w-[800px] flex-wrap flex-between p-2 gap-2  rounded-md border-2 border-gray600c transition-all hover:translate-y-[-2px] ${user.role === "admin"? "bg-violet200c hover:bg-violet100c": "bg-gray200c hover:bg-gray50c"}`}>
      <div className="flex flex-wrap gap-2 max-w-full flex-1">
        <div className=" max-h-14 max-w-14 min-h-14 min-w-14 flex-center relative">
          <Image
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded-full min-h-14 min-w-14  object-cover object-center"
            src={user.image || "/profilea.jpg"}
            alt="image"
          />
        </div>
        <div className="flex justify-center max-w-full  flex-col">
          <span className="font-bold max-w-[calc(100vw-40px)] overflow-hidden text-ellipsis text-nowrap">
            {user.name} ({user.role})
          </span>
          <span className="overflow-hidden max-w-[calc(100vw-40px)] text-ellipsis text-nowrap">
            {user.email}
          </span>
        </div>
      </div>
      <div className="flex justify-center  gap-2">
        <Button onClick={handleEdit} variant={"outline"} size="icon-sm">
          <Edit2Icon />
        </Button>
        <Button onClick={handleBlock} variant={"outline"} size="icon-sm">
          <MdBlock />
        </Button>
      </div>
    </div>
  );
};

export default UserControl;
