"use client";

import React, { useState, useEffect } from "react";
import { token, ocpKeyExport } from "../apiRequestVariables";

export default function Page() {
  const [queryParams, setQueryParams] = useState({
    token: null,
    itemId: null,
    propertyName: null,
    itemType: null,
  });
  const [itemTypes, setItemTypes] = useState({});
  const ocpKey = ocpKeyExport;

  const [itemData, setItemData] = useState();
  const [filePaths, setFilePaths] = useState([]);
  const [newFilePaths, setNewFilePaths] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle URL query parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const itemId = urlParams.get("itemId");
    const propertyName = urlParams.get("propertyName");
    const itemType = urlParams.get("itemType");

    if (token && itemId && propertyName) {
      setQueryParams((prevParams) => ({
        ...prevParams,
        token,
        itemId,
        propertyName,
        itemType,
      }));
    } else {
      console.log("No token found");
    }
  }, []);

  // Fetch item types and data
  useEffect(() => {
    if (queryParams.token && queryParams.itemId) {
      const fetchItemTypes = async () => {
        try {
          const response = await fetch(
            "https://e2e-tm-prod-services.nsg-e2e.com/api/item-types?sort=order,name&size=1000",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: queryParams.token,
                "Ocp-Apim-Subscription-Key": ocpKey,
              },
            }
          );
          const data = await response.json();
          if (data) {
            const itemTypesId = data.reduce(
              (accumulator, currentItemType) => {
                accumulator[
                  currentItemType.name
                    .toLowerCase()
                    .replace(/\s+/g, "")
                ] = currentItemType;
                return accumulator;
              },
              {}
            );
            setItemTypes(itemTypesId);
          }
        } catch (error) {
          console.error("Error in fetching itemTypes:", error);
        }
      };

      const fetchItems = async () => {
        try {
          const response = await fetch(
            `https://e2e-tm-prod-services.nsg-e2e.com/api/items/${queryParams.itemId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: queryParams.token,
                "Ocp-Apim-Subscription-Key": ocpKey,
              },
            }
          );
          const data = await response.json();
          setItemData(data);
        } catch (error) {
          console.error("Error in fetching equipment:", error);
        }
      };

      if (Object.keys(itemTypes).length === 0) {
        fetchItemTypes();
      } else {
        fetchItems();
      }
    }
  }, [queryParams.token, itemTypes]);

  // Process file paths
  useEffect(() => {
    if (itemData && itemTypes) {
      const imagePropertyId = itemTypes?.[
        queryParams.itemType
      ]?.propertyDefinitions?.find(
        (def) => def.name === queryParams.propertyName
      )?.id;
      const files =
        itemData?.propertyValues?.find(
          (prop) => prop.definition.id === imagePropertyId
        )?.files || [];

      const filterThumbnailsAndFiles = (files) => {
        const validExtensions = [
          ".png",
          ".jpg",
          ".jpeg",
          ".img",
          ".pdf",
        ];
        return files.filter(
          (file) =>
            !file.fileName.includes("thumbnail") &&
            validExtensions.some((ext) =>
              file.fileName.toLowerCase().endsWith(ext)
            )
        );
      };

      const filteredFiles = filterThumbnailsAndFiles(files);

      const extractFileInfo = (files) => {
        return files.map((file) => {
          const newFilePath = file.filePath.split("/api/files/")[1];
          return {
            fileName: file.fileName,
            filePath: newFilePath,
            blob: null,
          };
        });
      };

      setFilePaths(extractFileInfo(filteredFiles));
    }
  }, [itemTypes, itemData]);

  const fetchFileDetails = async (filePath) => {
    try {
      const response = await fetch(
        `https://api.konciv.com/api/files/v2/${filePath}`,
        {
          method: "GET",
          headers: {
            Authorization: queryParams.token,
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
      return blob;
    } catch (error) {
      console.error("Error in fetching file details:", error);
      return null;
    }
  };

  useEffect(() => {
    if (queryParams.token && filePaths.length > 0) {
      const fetchAndSetFileDetails = async () => {
        const updatedFilePaths = await Promise.all(
          filePaths.map(async (file) => {
            let blob = await fetchFileDetails(file.filePath);

            // Force blob type to application/pdf if file is a PDF
            const isPDF = /\.pdf$/i.test(file.fileName);
            if (isPDF && blob) {
              blob = new Blob([blob], { type: "application/pdf" });
            }

            const url = blob ? URL.createObjectURL(blob) : null;

            return { ...file, blob, url };
          })
        );
        setNewFilePaths(updatedFilePaths);
      };
      fetchAndSetFileDetails();
    }
  }, [filePaths]);

  // Cleanup for generated object URLs
  useEffect(() => {
    return () => {
      newFilePaths.forEach((file) => {
        if (file.url) URL.revokeObjectURL(file.url);
      });
    };
  }, [newFilePaths]);

  const goToNext = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + 1) % newFilePaths.length
    );
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + newFilePaths.length) % newFilePaths.length
    );
  };

  const goToIndex = (index) => {
    setCurrentIndex(index);
  };
  console.log(newFilePaths);
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {newFilePaths.length > 0 ? (
        <div className="w-full max-w-5xl h-full flex flex-col items-center">
          <div className="relative w-full h-[90vh] flex items-center justify-center">
            <button
              onClick={goToPrevious}
              className="absolute left-2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 focus:outline-none z-10">
              &lt;
            </button>
            <div className="w-full h-full flex items-center justify-center">
              {(() => {
                const currentFile = newFilePaths[currentIndex];
                const isImage = /\.(png|jpg|jpeg|img)$/i.test(
                  currentFile.fileName
                );
                const isPDF = /\.pdf$/i.test(currentFile.fileName);

                if (isImage) {
                  return (
                    <img
                      src={currentFile.url}
                      alt={currentFile.fileName}
                      className="w-full h-auto max-h-full object-contain"
                    />
                  );
                } else if (isPDF) {
                  return (
                    <embed
                      src={currentFile.url}
                      type="application/pdf"
                      className="w-full h-full"
                      title={`Embedded PDF Viewer: ${currentFile.fileName}`}
                    />
                  );
                } else {
                  return <p>Unsupported file type.</p>;
                }
              })()}
            </div>
            <button
              onClick={goToNext}
              className="absolute right-2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 focus:outline-none z-10">
              &gt;
            </button>
          </div>
          <p className="bg-black bg-opacity-50 text-white text-lg p-2 text-center rounded-b-lg">
            {newFilePaths[currentIndex].fileName}
          </p>
          <div className="flex justify-center mt-4 overflow-x-auto">
            {newFilePaths.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`w-4 h-4 mx-1 rounded-full ${
                  index === currentIndex
                    ? "bg-gray-800"
                    : "bg-gray-400"
                } focus:outline-none`}></button>
            ))}
          </div>
        </div>
      ) : (
        <p>No files available.</p>
      )}
    </div>
  );
}
