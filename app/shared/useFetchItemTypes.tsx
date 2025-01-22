import { useEffect, useState } from "react";
import { TItemType } from "./types";
import { token, ocpKey } from "./apiRequestVariables";

const baseUrl = "https://api.konciv.com/";

const useFetchItemTypes = () => {
  const [itemTypes, setItemTypes] = useState<TItemType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItemTypes = async () => {
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

    fetchItemTypes();
  }, []);

  return { itemTypes, error };
};

export default useFetchItemTypes;
