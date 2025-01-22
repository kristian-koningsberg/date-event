"use client";

import { useEffect } from "react";
import Announcements from "./shared/components/Announcement";
import AnnouncementsBackup from "./shared/components/backup";

export default function Home() {
  console.log("Hello from the home page");

  useEffect(() => {
    console.log("Hello from the useEffect hook");
  }, []);
  return (
    <main className="flex flex-col justify-start">
      <div className="container h-full text-slate-900">
        <header className="text-3xl font-bold">
          <h1>Events Overview</h1>
        </header>
        {/* {FetchItemTypes()} */}
        <Announcements />
        {/* <AnnouncementsBackup /> */}
      </div>
    </main>
  );
}
