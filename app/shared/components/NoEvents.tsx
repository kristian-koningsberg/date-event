import React from "react";
import Image from "next/image";

const NoEvents = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-start p-4">
      <h3 className="text-2xl">No items found for today.</h3>

      <Image
        src="/assets/freepik-no-events.svg"
        alt="No items found illustration"
        width={200}
        height={200}
        className="w-80 h-80 object-cover bg-slate-50"
      />
    </div>
  );
};

export default NoEvents;
