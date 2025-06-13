interface Shop {
  id: number;
  coordinates: [number, number];
  name: string;
}

interface Location {
  name: string;
  center: [number, number];
  shops: Shop[];
}

interface Locations {
  [key: string]: Location;
}

export type { Shop, Location, Locations };
