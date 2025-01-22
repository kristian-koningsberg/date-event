/**
 * =============================================
 * This file contains the API request functions.
 * =============================================
 */

import { token, ocpKey } from "./apiRequestVariables";
import { TItemType } from "./types";

const baseUrl = "https://api.konciv.com/";

export const fetchData = async (): Promise<TItemType[]> => {
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
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching item types:", error.message);
      throw error; // Re-throw the error to be handled by the calling code
    } else {
      console.error("An unknown error occurred", error);
      throw new Error("An unknown error occurred");
    }
  }
};
