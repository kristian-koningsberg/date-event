import { useState, useEffect } from "react";
import { token, ocpKey } from "../apiRequestVariables";

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

const useFetchFileDetails = (
  selectedItem: any,
  imageDefinitionIdProp: number
) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchFile = async () => {
      setFileUrl(null);

      if (!selectedItem) return;

      const propertyValue = selectedItem.propertyValues.find(
        (prop: any) => prop.definitionId === imageDefinitionIdProp
      );

      if (propertyValue) {
        try {
          const parsedPreValue = JSON.parse(propertyValue.value);
          console.log("Parsed preValue:", parsedPreValue);
          if (
            !parsedPreValue ||
            parsedPreValue.length === 0 ||
            parsedPreValue === null
          ) {
            console.warn("Parsed preValue is empty, ignoring...");
            return;
          }
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

  return fileUrl;
};

export default useFetchFileDetails;
