/**
 * ================================================
 * Fetch item types from the API and display them
 * ================================================
 */

"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

// import { fetchData } from "../api";
import { token, ocpKey } from "../apiRequestVariables";
import { TItemType } from "../types";

const baseUrl = "https://api.konciv.com/";

const someFakeDataArray: TItemType[] = [
  {
    id: 1,
    name: "FAKE - Felles Beskjeder",
    customItemName: "Felles Beskjeder",
    propertyDefinitions: [
      {
        id: 1,
        name: "Dato",
        value: "2021-11-30",
      },
      {
        id: 2,
        name: "Beskrivelse",
        value: "Dette er en felles beskjed",
      },
      {
        id: 3,
        name: "Bilde",
        value: "/assets/freepik-illustration3.svg",
      },
    ],
  },
  {
    id: 2,
    name: "FAKE - Felles Beskjeder",
    customItemName: "Felles Beskjeder 2",
    propertyDefinitions: [
      {
        id: 1,
        name: "Dato",
        value: "2021-12-01",
      },
      {
        id: 2,
        name: "Beskrivelse",
        value: "Dette er en annen felles beskjed",
      },
      {
        id: 3,
        name: "Bilde",
        value: "/assets/freepik-illustration4.svg",
      },
    ],
  },
];

const AnnouncementBackup = () => {
  const [itemTypes, setItemTypes] = useState<TItemType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");

  /**
   * Fetch item types from the API
   * No external file used
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${baseUrl}api/item-types`;
        console.log("Fetching data from URL:", url);
        const response = await fetch(url, {
          headers: {
            Authorization: `${token}`,
            "Ocp-Apim-Subscription-Key": ocpKey,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Data fetched:", data);
        setItemTypes(data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching item types:", error);
      }
    };

    fetchData();
  }, []);

  /**
   * *******************************************************
   * Fetch item types from the API using a separate function
   * api.ts file
   * *******************************************************
   */
  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       const data = await fetchData();
  //       setItemTypes(data);
  //     } catch (error) {
  //       if (error instanceof Error) {
  //         setError(error.message);
  //         console.error("Error fetching item types:", error);
  //       } else {
  //         setError("An unknown error occurred");
  //         console.error("An unknown error occurred", error);
  //       }
  //     }
  //   };

  //   getData();
  // }, []);

  // GET CURRENT DATE AND TIME
  const currentDateAndTime = new Date();
  console.log("Current Date and Time:", currentDateAndTime);

  const currentDate = new Date().toISOString().split("T")[0];
  console.log("Current Date:", currentDate);

  const currentTime = new Date()
    .toISOString()
    .split("T")[1]
    .split(".")[0];
  console.log("Current Time:", currentTime);

  // FILTER ITEMS BY SPECIFIC DATE
  const filterItemsByDate = (date: string) => {
    return itemTypes.filter((itemType) =>
      itemType.propertyDefinitions?.some(
        (property) =>
          property.name === "Dato" && property.value === date
      )
    );
  };

  // FILTER ITEMS BY CURRENT DATE OR SELECTED DATE
  const filteredItemsByDate = filterItemsByDate(
    selectedDate || currentDate
  );

  // FIND ITEMTYPE WITH NAME: "Felles Beskjeder"
  const findItemType = itemTypes.find(
    (itemType) => itemType.name === "Felles Beskjeder"
  );

  return (
    <>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <section className="py-4 flex flex-col md:flex-row gap-4">
            <div className="flex flex-col ">
              <label
                htmlFor="date"
                className="font-bold">
                Select Date:{" "}
              </label>
              <input
                className="border border-gray-400 p-2"
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            {/* <p>Selected Date: {selectedDate}</p> */}
            <div className="flex flex-col w-full md:max-w-sm">
              <label
                htmlFor="eventselector"
                className="font-bold">
                Select event:{" "}
              </label>
              <select
                className="border border-gray-400 p-3 "
                name="eventselector"
                id="eventselector">
                {someFakeDataArray.map((itemType) => (
                  <option
                    key={itemType.id}
                    value={itemType.id}>
                    {itemType.customItemName}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className="">
            {findItemType ? (
              <div>
                <ul className=" bg-amber-200">
                  <li key={findItemType.id}>
                    {findItemType.propertyDefinitions && (
                      <ul className="flex flex-col md:flex-row ">
                        <div className="w-1/2 bg-green-200">
                          <h2 className="text-2xl font-bold">
                            {findItemType.customItemName}
                          </h2>

                          <li>
                            {
                              findItemType.propertyDefinitions.find(
                                (property) => property.name === "Dato"
                              )?.name
                            }
                          </li>
                          <p className="text-lg">
                            {
                              findItemType.propertyDefinitions.find(
                                (property) =>
                                  property.name === "Beskrivelse"
                              )?.name
                            }
                          </p>
                        </div>
                        <div className="w-full md:w-1/2">
                          <Image
                            src={
                              findItemType.propertyDefinitions.find(
                                (property) =>
                                  property.name === "Bilde"
                              )?.value ||
                              "/assets/freepik-illustration3.svg" // fallback visuals
                            }
                            alt="Felles Beskjeder Bildetekst"
                            width={200}
                            height={200}
                            className="w-full h-full object-cover bg-slate-100"
                          />
                        </div>
                      </ul>
                    )}
                  </li>
                </ul>
              </div>
            ) : (
              <p>Loading Felles Beskjeder...</p>
            )}
          </section>

          <section className="bg-green-200 p-4 my-4">
            {filteredItemsByDate.length > 0 ? (
              <div>
                <h2>Items with Dato equal to selected date</h2>
                <ul>
                  {filteredItemsByDate.map((itemType) => (
                    <li key={itemType.id}>
                      {itemType.name} {itemType.id}
                      {itemType.propertyDefinitions && (
                        <ul>
                          <li>
                            {
                              itemType.propertyDefinitions.find(
                                (property) => property.name === "Dato"
                              )?.id
                            }
                          </li>
                          <li>
                            {
                              itemType.propertyDefinitions.find(
                                (property) => property.name === "Dato"
                              )?.name
                            }
                          </li>
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No items found for the selected date.</p>
            )}
          </section>
        </>
      )}
    </>
  );
};

export default AnnouncementBackup;
