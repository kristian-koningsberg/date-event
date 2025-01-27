import React, { useEffect, useState } from "react";
// import Image from "next/image";
import useFetchAnnouncements from "../useFetchAnnouncements";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import NoEvents from "./NoEvents";
import AnnouncementDetails from "./AnnouncementDetails";
import { token, ocpKey } from "../apiRequestVariables";

/**
 * NOTE!!!
 * Husk å referer og se på koden fra Adrian. Han har løsning og det
 * er da mulig å bruke den og tilpasse den til mitt bruk.
 * KodeFraAdrian.jsx
 */

/**
 * =======================
 * TYPES AND INTERFACES
 * =======================
 */
interface PropertyValue {
  id: number;
  value: string;
  definitionId: number;
  files: string[];
}

interface AnnouncementItem {
  id: number;
  name: string;
  propertyValues: PropertyValue[];
  createdBy: string;
  lastUpdated: string;
  projectId: number;
  // itemNotifications: any[];
}

const Announcement = () => {
  const propertyDefinitionId = 15933405;
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [dateText, setDateText] = useState<string>(
    selectedDate + "T00:00:00+0100"
  );

  const { data: announcements, error: fetchError } =
    useFetchAnnouncements(propertyDefinitionId, dateText);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(
    null
  );
  const [parsedImageUrl, setParsedImageUrl] = useState<string | null>(
    null
  );

  useEffect(() => {
    setDateText(selectedDate + "T00:00:00+0100");
  }, [selectedDate]);

  useEffect(() => {
    if (announcements?.length) {
      setSelectedItemId(announcements[0].id);
    }
  }, [announcements]);

  /**
   * =======================
   * EVENT HANDLER FUNCTIONS
   * =======================
   */
  const handleItemClick = (itemId: number) => {
    setSelectedItemId(itemId);
  };

  const handleNextItemClick = () => {
    const currentIndex = filteredItemsByDate.findIndex(
      (item) => item.id === selectedItemId
    );
    if (currentIndex < filteredItemsByDate.length - 1) {
      setSelectedItemId(filteredItemsByDate[currentIndex + 1].id);
    }
  };

  const handlePrevItemClick = () => {
    const currentIndex = filteredItemsByDate.findIndex(
      (item) => item.id === selectedItemId
    );
    if (currentIndex > 0) {
      setSelectedItemId(filteredItemsByDate[currentIndex - 1].id);
    }
  };

  /**
   * =======================
   * FILTERED ITEMS BY DATE
   * =======================
   */
  const filteredItemsByDate = Array.isArray(announcements)
    ? announcements.filter((item: AnnouncementItem) =>
        item.propertyValues?.some(
          ({ definitionId, value }) =>
            definitionId === propertyDefinitionId &&
            value.split("T")[0] === selectedDate
        )
      )
    : [];

  useEffect(() => {
    if (filteredItemsByDate.length > 0) {
      setSelectedItemId(filteredItemsByDate[0].id);
    }
  }, [selectedDate]);

  const selectedItem = filteredItemsByDate.find(
    (item) => item.id === selectedItemId
  );

  // Helper function to get property value by definitionId
  const getPropertyValue = (
    item: AnnouncementItem,
    definitionId: number
  ): string | undefined => {
    return (
      item.propertyValues?.find(
        (prop) => prop.definitionId === definitionId
      )?.value || undefined
    );
  };

  useEffect(() => {
    if (selectedItem?.propertyValues[2]?.value) {
      try {
        const parsedPreValue = JSON.parse(
          selectedItem.propertyValues[2].value
        );
        console.log("Parsed IMAGE TRY", parsedPreValue[1].filePath);
        const parsedValue = parsedPreValue[1].filePath;
        console.log("Parsed IMAGE TRY 2", parsedValue);
        setParsedImageUrl(parsedValue); // Update the state with the parsed value
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
  }, [selectedItem]);

  // NOTE!!
  // SKRIV INN DENNE URL I CHROME FOR Å FINNE ITEM(S) https://hub.konciv.com/items

  if (selectedItem?.propertyValues[2]?.value) {
    try {
      const parsedPreValue = JSON.parse(
        selectedItem.propertyValues[2].value
      );
      const filePathObject = parsedPreValue.find(
        (item: any) => item.filePath
      );
      console.log("filePathObject", filePathObject);
      if (filePathObject) {
        // console.log("Parsed IMAGE TRY", filePathObject.filePath);
        const parsedValue = filePathObject.filePath;
        console.log("parsedValue", parsedValue);
      } else {
        console.error("No filePath found in parsedPreValue");
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }

  const fetchFileDetails = async (filePath) => {
    try {
      const response = await fetch(
        `https://api.konciv.com/api/files/575ffb78-f6eb-474f-b217-68a7ea83e1544874190677983796196`,
        {
          method: "GET",
          headers: {
            Authorization: token,
            "Ocp-Apim-Subscription-Key": ocpKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error fetching file: ${response.statusText}`
        );
      }

      const blob = await response.blob();
      const url = blob ? URL.createObjectURL(blob) : null;
      return url;
    } catch (error) {
      console.error("Error in fetching file details:", error);
      return null;
    }
  };
  console.log("fetchFileDetails", fetchFileDetails(parsedImageUrl));
  let testUrl = fetchFileDetails(parsedImageUrl);

  // Helper function to secure a valid image URL including fallback image illustration.
  const getImageUrl = (
    item: AnnouncementItem,
    definitionId: number
  ): string => {
    const url = getPropertyValue(item, definitionId);
    return url && url.startsWith("http")
      ? url
      : "/assets/freepik-illustration3.svg";
  };

  // console.log(parsedValue);
  return (
    <>
      {fetchError ? (
        <p>Error: {fetchError}</p>
      ) : (
        <div className="flex flex-col md:flex-row gap-2 py-4">
          {/* FILTER UI */}
          <section className="md:h-screen md:overflow-y-auto w-full md:w-1/3">
            <div className=" flex flex-row">
              <div className="flex flex-col">
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
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedItemId(null);
                  }}
                />
              </div>
            </div>
            {filteredItemsByDate.length === 0 ? (
              <></>
            ) : (
              <div className="flex flex-col">
                <div className="flex flex-row w-full justify-between items-center">
                  <label className="font-bold">Hendelser: </label>
                  <div>
                    <button
                      title="Previous Item"
                      className="w-fit px-4 py-4 bg-white hover:bg-green-100 text-gray-800 font-bold disabled:opacity-40"
                      onClick={handlePrevItemClick}
                      disabled={
                        filteredItemsByDate.findIndex(
                          (item) => item.id === selectedItemId
                        ) <= 0
                      }>
                      <FaAngleUp />
                    </button>
                    <button
                      title="Next Item"
                      className="w-fit px-4 py-4 bg-white hover:bg-green-100 text-gray-800 font-bold disabled:opacity-40"
                      onClick={handleNextItemClick}
                      disabled={
                        filteredItemsByDate.findIndex(
                          (item) => item.id === selectedItemId
                        ) >=
                        filteredItemsByDate.length - 1
                      }>
                      <FaAngleDown />
                    </button>
                  </div>
                </div>

                {/* DESKTOP UI */}
                {filteredItemsByDate.map((item) => (
                  <div
                    key={item.id}
                    className={`transition-all duration-300 hidden md:block group p-2 border cursor-pointer hover:border-green-200 ${
                      selectedItemId === item.id
                        ? "bg-green-100 border-green-500 text-green-950"
                        : "bg-white text-gray-700"
                    }`}
                    onClick={() => handleItemClick(item.id)}>
                    <h3 className="text-base font-bold group-hover:underline">
                      {item.name}
                    </h3>
                    <p className="max-w-[50ch] truncate">
                      {getPropertyValue(item, 15933406)}
                    </p>
                  </div>
                ))}
                {/* MOBILE UI */}
                <div className="block md:hidden">
                  <select
                    className="border border-gray-400 p-2 w-full"
                    value={selectedItemId ?? ""}
                    onChange={(e) =>
                      handleItemClick(Number(e.target.value))
                    }>
                    {filteredItemsByDate.map((item) => (
                      <option
                        key={item.id}
                        value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </section>

          {selectedItem ? (
            <AnnouncementDetails
              selectedItem={selectedItem}
              getPropertyValue={getPropertyValue}
              getImageUrl={getImageUrl}
              testUrl={testUrl}
              imageDefinitionId={15933407}
              dateDefinitionId={15933405}
              descriptionDefinitionId={15933406}
            />
          ) : (
            <NoEvents />
          )}

          {/* EVENT UI */}
        </div>
      )}
    </>
  );
};

export default Announcement;
