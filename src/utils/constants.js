import city_list from "./history.city.list.json";

const KEY_FORMAT = "YYYY MM DD";

export const GET_KEY_FORMAT = date => date.format(KEY_FORMAT);

export const SELECT_CITY_LIST = city_list.map(item => ({
  name: item.city.name,
  id: item.city.id.$numberLong,
  country: item.city.country
}));

export const VIEWS = [
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
  { value: "day", label: "Day" }
];
