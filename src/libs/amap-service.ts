import axios from "axios";
import { WEB_API_KEY } from "./amap-config";
import { Coord } from "@/type";

export const getAmapCoordinate = async (): Promise<Coord> => {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((res) => {
      const { latitude, longitude } = res.coords;

      console.log("[rider]Locate Success", latitude, longitude);
      axios.get(`https://restapi.amap.com/v3/assistant/coordinate/convert?parameters`, {
        params: {
          locations: `${longitude},${latitude}`,
          key: WEB_API_KEY
        }
      }).then((res) => {
        console.log("[rider]Locate Convert Success");
        const locations = res.data.locations;
        const [longitude, latitude] = locations.split(",");
        resolve({ lng: longitude, lat: latitude });
      });
    });
  });
};