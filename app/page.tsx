"use client";

import { useEffect, useState } from "react";
import Announcements from "./shared/components/Announcement";
import { SickDialog } from "./shared/components/SickDialog";
import useFetchFileDetails from "./shared/hooks/useFetchFileDetails";
import { Button } from "@/components/ui/button";

export default function Home() {
  const propertyDefinitionId = 15933405;
  const imageDefinitionId = 15933407;
  const dateDefinitionId = 15933405;
  const descriptionDefinitionId = 15933406;
  const [showDialogList, setShowDialogList] =
    useState<boolean>(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const fileUrl = useFetchFileDetails(
    selectedItem,
    imageDefinitionId
  );

  const handleDialogList = () => {
    setShowDialogList(!showDialogList);
    setButtonClicked(true);
  };

  // FAKE DATA FOR TESTING PURPOSES WITH "Fravær"
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
        {/*
          ========= TODO ================= 
          sickDataArray is fake data. It should be fetched from an API.
          ========= TODO =================
        */}
        <section className="w-full md:w-1/3 border-b pb-4">
          <label className="font-bold">Fravær varsel idag: </label>
          {sickDataArray ? (
            <Button
              onClick={handleDialogList}
              variant="link"
              size="sm"
              title="Vis eller skjul fravær"
              className={`underline hover:bg-orange-50 ${
                !buttonClicked ? "animate-pulse" : ""
              }`}>
              {showDialogList ? "Skjul" : "Vis"} fravær (
              {sickDataArray.length})
            </Button>
          ) : (
            <p>Alle er på plass idag :)</p>
          )}

          <div className={showDialogList ? "block" : "hidden"}>
            <div className="flex flex-col gap-2">
              {sickDataArray.map((sickData) => (
                <SickDialog
                  key={sickData.name}
                  name={sickData.name}
                  message={sickData.message}
                />
              ))}
            </div>
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
