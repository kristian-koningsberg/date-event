import React, { useEffect, useState } from "react";
import Image from "next/image";
import useFetchAnnouncements from "../useFetchAnnouncements";
import useFetchItemTypes from "../useFetchItemTypes";

const Announcement = () => {
  const { itemTypes: announcements, error: fetchError } =
    useFetchAnnouncements();
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedItemId, setSelectedItemId] = useState<number | null>(
    null
  );

  // Debugging logs
  console.log("Fetched announcements:", announcements);
  console.log("Fetch error:", fetchError);

  // Handle item click
  const handleItemClick = (itemId: number) => {
    setSelectedItemId(itemId);
  };

  console.log("SelectedDate: ", selectedDate);

  // Filter items by selected date
  const filteredItemsByDate = Array.isArray(announcements)
    ? announcements.filter((itemType) =>
        itemType.propertyValues?.some(
          (property) =>
            property.definitionId === 15933405 &&
            property.value.split("T")[0] === selectedDate
        )
      )
    : [];
  console.log("Filtered items by date:", filteredItemsByDate);

  useEffect(() => {
    if (filteredItemsByDate.length > 0) {
      setSelectedItemId(filteredItemsByDate[0].id);
    }
  }, [selectedDate]);

  const selectedItem = filteredItemsByDate.find(
    (item) => item.id === selectedItemId
  );
  // console.log("filteredItemsByDate", filteredItemsByDate);

  return (
    <>
      {fetchError ? (
        <p>Error: {fetchError}</p>
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
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedItemId(null); // Reset selected item when date changes
                }}
              />
            </div>
          </section>

          <div className="flex flex-wrap gap-4">
            {filteredItemsByDate.map((itemType) => (
              <div
                key={itemType.id}
                className={`px-4 py-2 border cursor-pointer ${
                  selectedItemId === itemType.id
                    ? "bg-green-100 border-green-500 text-green-950"
                    : "bg-white text-gray-700"
                }`}
                onClick={() => handleItemClick(itemType.id)}>
                <h3 className="text-base font-bold">
                  {itemType.customItemName}
                </h3>
                <p className="max-w-[20ch] truncate">
                  {
                    itemType.propertyDefinitions.find(
                      (property) => property.name === "Beskrivelse"
                    )?.value
                  }
                </p>
              </div>
            ))}
          </div>

          {selectedItem ? (
            <div className="p-4 flex flex-col md:flex-row gap-4 mt-4">
              <div className="w-1/2">
                <h2 className="text-2xl font-bold">
                  {selectedItem.customItemName}
                </h2>
                <ul>
                  {selectedItem.propertyDefinitions
                    .filter((property) => property.name !== "Bilde")
                    .map((property) => (
                      <li key={property.id}>
                        <strong>{property.name}:</strong>{" "}
                        {property.value}
                      </li>
                    ))}
                </ul>
              </div>
              {selectedItem.propertyDefinitions.find(
                (property) => property.name === "Bilde"
              ) && (
                <Image
                  src={
                    selectedItem.propertyDefinitions.find(
                      (property) => property.name === "Bilde"
                    )?.value || "/assets/freepik-illustration3.svg"
                  }
                  alt="Selected Item Image"
                  width={200}
                  height={200}
                  className="w-full md:w-1/2 h-full object-cover bg-slate-50"
                />
              )}
            </div>
          ) : (
            <p>No items found for the selected date.</p>
          )}
        </>
      )}
    </>
  );
};

export default Announcement;
