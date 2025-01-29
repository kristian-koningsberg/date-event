import React, { useEffect, useState, useMemo, Suspense } from "react";
import useFetchAnnouncements from "../hooks/useFetchAnnouncements";

import NoEvents from "./NoEvents";
import AnnouncementDetails from "./AnnouncementDetails";
import AnnouncementsFilterSection from "./AnnouncementsFilterSection";
import useFetchFileDetails from "../hooks/useFetchFileDetails";

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
  definitionId: number | string
): string | undefined => {
  return (
    item.propertyValues?.find(
      (prop) => prop.definitionId === definitionId
    )?.value || undefined
  );
};

/**
 * =======================
 * COMPONENT
 * =======================
 */

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
  const fileUrl = useFetchFileDetails(
    selectedItem,
    imageDefinitionIdProp
  );

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
    <Suspense fallback={<p>Loading...</p>}>
      {fetchError ? (
        <p>Error: {fetchError}</p>
      ) : (
        <div className="flex flex-col md:flex-row gap-2 py-4">
          {/* FILTER UI aka LEFTSIDE OF UI*/}

          <AnnouncementsFilterSection
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            setSelectedItemId={setSelectedItemId}
            filteredItemsByDate={filteredItemsByDate}
            selectedItemId={selectedItemId}
            handlePrevItemClick={handlePrevItemClick}
            handleNextItemClick={handleNextItemClick}
            handleItemClick={handleItemClick}
            getPropertyValue={(item, prop) =>
              item.propertyValues.find((p) => p.definitionId === prop)
                ?.value || ""
            }
            descriptionDefinitionIdProp={descriptionDefinitionIdProp}
          />

          {/* DISPLAY ITEM aka RIGHTSIDE OF UI */}
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
    </Suspense>
  );
};

export default Announcement;
