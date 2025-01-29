import React from "react";
import {
  FaThumbsUp,
  FaAngleUp,
  FaAngleDown,
  FaAngleRight,
} from "react-icons/fa";

interface AnnouncementItem {
  id: number;
  name: string;
}

interface AnnouncementsFilterSectionProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  setSelectedItemId: (id: number | null) => void;
  filteredItemsByDate: AnnouncementItem[];
  selectedItemId: number | null;
  handlePrevItemClick: () => void;
  handleNextItemClick: () => void;
  handleItemClick: (id: number) => void;
  getPropertyValue: (item: any, prop: string) => string;
  descriptionDefinitionIdProp: number | string;
}

const AnnouncementsFilterSection: React.FC<
  AnnouncementsFilterSectionProps
> = ({
  selectedDate,
  setSelectedDate,
  setSelectedItemId,
  filteredItemsByDate,
  selectedItemId,
  handlePrevItemClick,
  handleNextItemClick,
  handleItemClick,
  getPropertyValue,
  descriptionDefinitionIdProp,
}) => {
  return (
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
        <div className="rounded-sm border border-green-500 bg-green-50 p-2 mt-4 w-full flex items-center gap-2 text-green-900">
          <i>Wooho! Ingen hendelser idag.</i>
          <FaThumbsUp className="w-6 h-6" />
        </div>
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
                      : "rotate-90 opacity-30"
                  }`}
                />
              </div>
              <p className="max-w-[50ch] truncate">
                {getPropertyValue(item, descriptionDefinitionIdProp)}
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
  );
};

export default AnnouncementsFilterSection;
