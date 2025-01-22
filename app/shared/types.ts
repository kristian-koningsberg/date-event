// TypeScript type definitions
export type PropertyDefinition = {
  id: number;
  name: string;
  value: string;
};

export type TPropertyValue = {
  id: number;
  definitionId: number;
  value: string;
};

export type TItemType = {
  id: number;
  customItemName: string;
  propertyValues: TPropertyValue[];
  propertyDefinitions: {
    id: number;
    name: string;
    value: string;
  }[];
};

// export type TItemType = {
//   id: number;
//   name: string;
//   customItemName: string;
//   fetchTimestamp?: string;
//   propertyDefinitions: PropertyDefinition[];
// };
