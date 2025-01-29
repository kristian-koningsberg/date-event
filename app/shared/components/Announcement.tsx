import React, { useEffect, useState, useMemo } from "react";
import useFetchAnnouncements from "../useFetchAnnouncements";
import { FaAngleDown, FaAngleUp, FaAngleRight } from "react-icons/fa";
import { FaThumbsUp } from "react-icons/fa6";

import NoEvents from "./NoEvents";
import AnnouncementDetails from "./AnnouncementDetails";
import { token, ocpKey } from "../apiRequestVariables";

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
}

interface AnnouncementProps {
  propertyDefinitionIdProp: number;
  imageDefinitionIdProp: number;
  dateDefinitionIdProp: number;
  descriptionDefinitionIdProp: number;
}

/**
 * =======================
 * UTILITY FUNCTIONS
 * =======================
 */
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

const fetchFileDetails = async (
  filePath: string | null
): Promise<string | null> => {
  if (!filePath) {
    console.error("Invalid filePath:", filePath);
    return null;
  }

  try {
    const response = await fetch(
      `https://api.konciv.com/api/files/v2/${
        filePath.split("/api/files/")[1]
      }`,
      {
        method: "GET",
        headers: {
          Authorization: token,
          "Ocp-Apim-Subscription-Key": ocpKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching file: ${response.statusText}`);
    }

    const blob = await response.blob();
    return blob ? URL.createObjectURL(blob) : null;
  } catch (error) {
    console.error("Error in fetching file details:", error);
    return null;
  }
};

const Announcement = ({
  propertyDefinitionIdProp,
  imageDefinitionIdProp,
  dateDefinitionIdProp,
  descriptionDefinitionIdProp,
}: AnnouncementProps) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [dateText, setDateText] = useState<string>(
    selectedDate + "T00:00:00+0100"
  );
  const { data: announcements, error: fetchError } =
    useFetchAnnouncements(propertyDefinitionIdProp, dateText);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(
    null
  );
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    setDateText(selectedDate + "T00:00:00+0100");
  }, [selectedDate]);

  useEffect(() => {
    if (announcements?.length) {
      const sortedAnnouncements = [...announcements].sort(
        (a, b) =>
          new Date(b.lastUpdated).getTime() -
          new Date(a.lastUpdated).getTime()
      );
      setSelectedItemId(sortedAnnouncements[0].id);
    }
  }, [announcements]);

  const filteredItemsByDate = useMemo(() => {
    return Array.isArray(announcements)
      ? announcements
          .filter((item: AnnouncementItem) =>
            item.propertyValues?.some(
              ({ definitionId, value }) =>
                definitionId === propertyDefinitionIdProp &&
                value.split("T")[0] === selectedDate
            )
          )
          .sort(
            (a, b) =>
              new Date(b.lastUpdated).getTime() -
              new Date(a.lastUpdated).getTime()
          )
      : [];
  }, [announcements, propertyDefinitionIdProp, selectedDate]);

  useEffect(() => {
    if (filteredItemsByDate.length > 0 || null) {
      setSelectedItemId(filteredItemsByDate[0].id);
    }
  }, [filteredItemsByDate]);

  const selectedItem = useMemo(() => {
    return filteredItemsByDate.find(
      (item) => item.id === selectedItemId
    );
  }, [filteredItemsByDate, selectedItemId]);

  useEffect(() => {
    const fetchFile = async () => {
      setFileUrl(null);

      if (!selectedItem) return;

      const propertyValue = selectedItem.propertyValues.find(
        (prop) => prop.definitionId === imageDefinitionIdProp
      );

      if (propertyValue) {
        try {
          const parsedPreValue = JSON.parse(propertyValue.value);
          const filePathObject = parsedPreValue.find(
            (item: any) => item.filePath
          );

          if (filePathObject) {
            const fileUrl = await fetchFileDetails(
              filePathObject.filePath
            );
            setFileUrl(fileUrl);
          } else {
            console.error(
              "No valid filePath found in parsedPreValue"
            );
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      } else {
        console.error(
          `No property value found with definitionId ${imageDefinitionIdProp}`
        );
      }
    };

    fetchFile();
  }, [selectedItem, imageDefinitionIdProp]);

  /**
   * =======================
   * HANDLERS
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

  return (
    <>
      {fetchError ? (
        <p>Error: {fetchError}</p>
      ) : (
        <div className="flex flex-col md:flex-row gap-2 py-4">
          {/* FILTER UI */}
          <section className="md:h-screen md:overflow-y-auto w-full md:w-1/3">
            <div className="flex flex-row">
              <div className="flex flex-col">
                <label
                  htmlFor="date"
                  className="font-bold">
                  Velg dato:{" "}
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
            {filteredItemsByDate.length === 0 || null ? (
              <>
                <div className="rounded-sm border border-green-500 bg-green-50 p-2 mt-4 w-full flex items-center gap-2 text-green-900">
                  <i>Wooho! Ingen hendelser idag.</i>
                  <FaThumbsUp className="w-6 h-6" />
                </div>
              </>
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
                    className={`transition-all duration-300 hidden md:block group p-2 border-b-2 cursor-pointer hover:border-green-200 ${
                      selectedItemId === item.id
                        ? "bg-green-100 border-green-500 text-green-950"
                        : "bg-white text-gray-700"
                    }`}
                    onClick={() => handleItemClick(item.id)}>
                    <div className="flex flex-row justify-between items-center">
                      <h3 className="text-base font-bold group-hover:underline">
                        {item.name}
                      </h3>
                      <FaAngleRight
                        className={`w-4 h-4 transition-all duration-300 transform ${
                          selectedItemId === item.id
                            ? "rotate-0"
                            : "rotate-90 opacity-40"
                        }`}
                      />
                    </div>
                    <p className="max-w-[50ch] truncate">
                      {getPropertyValue(
                        item,
                        descriptionDefinitionIdProp
                      )}
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
              fileUrl={fileUrl}
              imageDefinitionId={imageDefinitionIdProp}
              dateDefinitionId={dateDefinitionIdProp}
              descriptionDefinitionId={descriptionDefinitionIdProp}
            />
          ) : (
            <NoEvents />
          )}
        </div>
      )}
    </>
  );
};

export default Announcement;
