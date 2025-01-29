"use client";

import { useEffect, useState } from "react";
import Announcements from "./shared/components/Announcement";
import { SickDialog } from "./shared/components/SickDialog";
import useFetchFileDetails from "./shared/hooks/useFetchFileDetails";

export default function Home() {
  const propertyDefinitionId = 15933405;
  const imageDefinitionId = 15933407;
  const dateDefinitionId = 15933405;
  const descriptionDefinitionId = 15933406;

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const fileUrl = useFetchFileDetails(
    selectedItem,
    imageDefinitionId
  );

  const sickDataArray = [
    {
      name: "Børre Fraværson",
      message:
        "Forkjølt. Tilbake imorgen. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      name: "Kari Fraværdatter",
      message:
        "Forkjølt. Tilbake imorgen. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      name: "Ola Fraværson",
      message:
        "Forkjølt. Tilbake imorgen. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
  ];

  return (
    <main className="flex flex-col justify-start">
      <div className="container h-full text-slate-800">
        <header className="text-3xl font-bold">
          <h1>Oversikt Hendelser</h1>
        </header>
        <section className="w-full md:w-1/3">
          <label className="font-bold">Fravær varsel:</label>
          <div className="flex flex-col gap-2">
            {sickDataArray.map((sickData) => (
              <SickDialog
                key={sickData.name}
                name={sickData.name}
                message={sickData.message}
              />
            ))}
          </div>
        </section>
        <Announcements
          propertyDefinitionIdProp={propertyDefinitionId}
          imageDefinitionIdProp={imageDefinitionId}
          dateDefinitionIdProp={dateDefinitionId}
          descriptionDefinitionIdProp={descriptionDefinitionId}
        />
      </div>
    </main>
  );
}
