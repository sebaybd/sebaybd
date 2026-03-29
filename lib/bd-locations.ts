export interface BdArea {
  name: string;
}

export interface BdDistrict {
  name: string;
  areas: BdArea[];
}

export interface BdDivision {
  name: string;
  districts: BdDistrict[];
}

export const bdLocationTree: BdDivision[] = [
  {
    name: "Dhaka",
    districts: [
      { name: "Dhaka", areas: [{ name: "Mirpur" }, { name: "Uttara" }, { name: "Dhanmondi" }] },
      { name: "Gazipur", areas: [{ name: "Tongi" }, { name: "Sreepur" }] },
    ],
  },
  {
    name: "Chattogram",
    districts: [
      { name: "Chattogram", areas: [{ name: "Panchlaish" }, { name: "Agrabad" }] },
      { name: "Cox's Bazar", areas: [{ name: "Sadar" }, { name: "Teknaf" }] },
    ],
  },
  {
    name: "Khulna",
    districts: [{ name: "Khulna", areas: [{ name: "Sonadanga" }, { name: "Khalishpur" }] }],
  },
];

export function flattenLocations() {
  return bdLocationTree.flatMap((division) =>
    division.districts.flatMap((district) =>
      district.areas.map((area) => ({
        division: division.name,
        district: district.name,
        area: area.name,
      }))
    )
  );
}
