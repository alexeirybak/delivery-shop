import { Map, Placemark } from "@iminside/react-yandex-maps";
import { locations } from "@/data/locations";

interface MapViewProps {
  currentLocation: string;
}

const MapView = ({ currentLocation }: MapViewProps) => {
  const currentLocationData = locations[currentLocation];

  return (
    <Map
      options={{ suppressMapOpenBlock: true }}
      defaultState={{ center: currentLocationData.center, zoom: 12 }}
      state={{ center: currentLocationData.center, zoom: 12 }}
      width="100%"
      height="354px"
    >
      {locations[currentLocation].shops.map((shop) => (
        <Placemark
          key={shop.id}
          geometry={shop.coordinates}
          properties={{
            hintContent: shop.name,
          }}
          options={{
            iconLayout: "default#image",
            iconImageHref: "/icons-map/icon-location.svg",
            iconImageSize: [32, 32],
            iconOffset: [-16, -16],
          }}
        />
      ))}
    </Map>
  );
};

export default MapView;