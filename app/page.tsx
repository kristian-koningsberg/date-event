"use client";

import { useEffect } from "react";
import Announcements from "./shared/components/Announcement";
import SickDetailsCard from "./shared/components/SickDetailsCard";
import { SickDialog } from "./shared/components/SickDialog";

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
        <section className="w-full md:w-1/3">
          <label className="font-bold">Fravær varsel:</label>
          <SickDialog
            name="Børre Fraværson"
            message="Forkjølt. Tilbake imorgen. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
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
