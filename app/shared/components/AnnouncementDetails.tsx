import Image from "next/image";

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

interface AnnouncementDetailsProps {
  selectedItem: AnnouncementItem;
  getPropertyValue: (
    item: AnnouncementItem,
    definitionId: number
  ) => string | undefined;
  imageDefinitionId: number;
  dateDefinitionId: number;
  descriptionDefinitionId: number;
  fileUrl: string | null;
}

const AnnouncementDetails: React.FC<AnnouncementDetailsProps> = ({
  selectedItem,
  getPropertyValue,
  dateDefinitionId,
  descriptionDefinitionId,
  fileUrl,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full md:w-2/3">
      {fileUrl ? (
        <Image
          src={fileUrl}
          alt="Selected Item Image"
          width={200}
          height={200}
          priority={true}
          className="w-full h-80 aspect-square object-cover bg-slate-50"
        />
      ) : null}
      <div className="w-full mt-2">
        <div>
          <h2 className="text-2xl font-bold">{selectedItem.name}</h2>
          <p className="text-xs">
            Date:{" "}
            {new Date(
              getPropertyValue(selectedItem, dateDefinitionId) || ""
            ).toLocaleDateString()}
          </p>
          <p className="text-xs">
            Tid:
            {new Date(selectedItem.lastUpdated).toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              }
            )}
          </p>
        </div>
        <div className="md:text-lg mt-4">
          <p className="leading-relaxed">
            {getPropertyValue(selectedItem, descriptionDefinitionId)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetails;
