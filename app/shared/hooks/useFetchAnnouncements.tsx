import { useEffect, useState } from "react";
// import { TItemType } from "./types";
import { token, ocpKey } from "../apiRequestVariables";

const baseUrl = "https://api.konciv.com/";

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

const useFetchAnnouncements = (
  propertyDefinitionIdValue: number,
  dateText: string
) => {
  const [data, setData] = useState<AnnouncementItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const url = `${baseUrl}api/items/v2/search?notificationRequired=false&size=1000&page=0`;
        console.log("Fetching data from URL:", url);
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `${token}`,
            "Ocp-Apim-Subscription-Key": ocpKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filter: {
              _type: "operation",
              dataType: "FILTER",
              operand1: {
                _type: "operation",
                dataType: "FILTER",
                operand1: {
                  _type: "operation",
                  dataType: "NUMERIC",
                  operand1: {
                    _type: "field",
                    field: "ITEM_TYPE_ID",
                  },
                  operand2: {
                    _type: "value",
                    dataType: "NUMERIC",
                    text: "15934350",
                  },
                  operator: "EQ",
                },
                operand2: {
                  _type: "operation",
                  dataType: "BOOLEAN",
                  operand1: {
                    _type: "field",
                    field: "DELETED",
                  },
                  operand2: {
                    _type: "value",
                    dataType: "BOOLEAN",
                    text: "false",
                  },
                  operator: "EQ",
                },
                operator: "AND",
              },
              operand2: {
                _type: "operation",
                dataType: "DATE",
                operand1: {
                  _type: "itemProperty",
                  // propertyDefinitionId: 15933405,
                  propertyDefinitionId: propertyDefinitionIdValue,
                },
                operand2: {
                  _type: "value",
                  dataType: "STRING",
                  // text: "2025-01-22T10:19:00+0100",
                  text: dateText,
                  array: false,
                },
                operator: "EQ_DATE_ONLY",
              },
              operator: "AND",
            },
            ordering: [
              {
                _type: "field",
                orderDirection: "DESC",
                orderPosition: 1,
                field: "ITEM_ID",
              },
            ],
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
        console.error("Error fetching item types:", error);
      }
    };

    fetchAnnouncements();
  }, [propertyDefinitionIdValue, dateText]);

  return { data, error };
};

export default useFetchAnnouncements;
