import React from "react";
import { LuCalendarX2 } from "react-icons/lu";
import { SickDialog } from "../components/SickDialog";

type TSickDetailsCardProps = {
  name: string;
  message: string;
  id?: string;
};

const SickDetailsCard = ({
  name,
  message,
  id,
}: TSickDetailsCardProps) => {
  return (
    // <div className="text-red-950 flex flex-col p-2 rounded-sm border border-red-500 bg-red-50 w-full">
    //   <div className="flex items-center gap-2">
    //     <LuCalendarX2 />
    //     <strong>{name}</strong>
    //   </div>
    //   {/* <p>{message}</p> */}
    // </div>
    <SickDialog
      name={name}
      message={message}
    />
  );
};

export default SickDetailsCard;
