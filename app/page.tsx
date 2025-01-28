"use client";

import { useEffect } from "react";
import Announcements from "./shared/components/Announcement";
import SickDetailsCard from "./shared/components/SickDetailsCard";
// import { LuCalendarX2 } from "react-icons/lu";

// import AnnouncementsBackup from "./shared/components/backup";

export default function Home() {
  // NOTE!!
  // SKRIV INN DENNE URL I CHROME FOR Å FINNE ITEM(S) https://hub.konciv.com/items
  // Replace the hardcoded numbers with the actual definition IDs from your environment
  const propertyDefinitionId = 15933405;
  const imageDefinitionId = 15933407;
  const dateDefinitionId = 15933405;
  const descriptionDefinitionId = 15933406;

  useEffect(() => {
    console.log("Hello from the useEffect hook");
  }, []);
  return (
    <main className="flex flex-col justify-start">
      <div className="container h-full text-slate-800">
        <header className="text-3xl font-bold">
          <h1>Oversikt Hendelser</h1>
        </header>
        <section className="w-1/3">
          <label className="font-bold">Fravær:</label>
          <SickDetailsCard
            name="Børre Fraværson"
            message="Forkjølt. Tilbake imorgen."
          />
        </section>
        {/* {FetchItemTypes()} */}
        <Announcements
          propertyDefinitionIdProp={propertyDefinitionId}
          imageDefinitionIdProp={imageDefinitionId}
          dateDefinitionIdProp={dateDefinitionId}
          descriptionDefinitionIdProp={descriptionDefinitionId}
        />

        {/* <AnnouncementsBackup /> */}
      </div>
    </main>
  );
}
