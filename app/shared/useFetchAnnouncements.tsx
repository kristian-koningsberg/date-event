import { useEffect, useState } from "react";
import { TItemType } from "./types";
import { token, ocpKey } from "./apiRequestVariables";

const baseUrl = "https://api.konciv.com/";

const useFetchAnnouncements = () => {
  const [itemTypes, setItemTypes] = useState<TItemType[]>([]);
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
                  propertyDefinitionId: 15933405,
                },
                operand2: {
                  _type: "value",
                  dataType: "STRING",
                  text: "2025-01-22T10:19:00+0100",
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
        const arr = [];
        const data = await response.json();
        console.log("Data fetched:", data);
        console.log("Data structure:", JSON.stringify(data, null, 2));
        if (data.items) {
          setItemTypes(data.items); // Assuming the fetched data has an 'items' property
        } else {
          console.error("Data structure is not as expected:", data);
          setError("Unexpected data structure");
        }
      } catch (error) {
        setError(error.message);
        console.error("Error fetching item types:", error);
      }
    };

    fetchAnnouncements();
  }, []);

  return { itemTypes, error };
};

export default useFetchAnnouncements;
