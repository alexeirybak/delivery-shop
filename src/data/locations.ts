import { Locations } from "@/types/shops";

export const locations: Locations = {
  archangelsk: {
    name: "Архангельск",
    center: [64.54, 40.55],
    shops: [
      { id: 1, coordinates: [64.54, 40.55], name: "Магазин на Ломоносова" },
      { id: 2, coordinates: [64.53, 40.56], name: "Магазин на Тимме" },
      { id: 3, coordinates: [64.55, 40.54], name: "Магазин на Ленина" },
    ],
  },
  severodvinsk: {
    name: "Северодвинск",
    center: [64.56, 39.83],
    shops: [
      { id: 4, coordinates: [64.56, 39.83], name: "Магазин на Ленина" },
      { id: 5, coordinates: [64.57, 39.82], name: "Магазин на Индустриальной" },
    ],
  },
  novodvinsk: {
    name: "Новодвинск",
    center: [64.42, 40.81],
    shops: [{ id: 6, coordinates: [64.42, 40.81], name: "Магазин на Мира" }],
  },
  kotlas: {
    name: "Котлас",
    center: [61.25, 46.65],
    shops: [
      { id: 7, coordinates: [61.25, 46.65], name: "Магазин на Советской" },
    ],
  },
  koryazhma: {
    name: "Коряжма",
    center: [61.31, 47.16],
    shops: [
      { id: 8, coordinates: [61.31, 47.16], name: "Магазин на Гагарина" },
    ],
  },
};
