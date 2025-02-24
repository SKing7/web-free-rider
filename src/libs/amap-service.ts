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
          coordsys: 'gps',
          locations: `${longitude},${latitude}`,
          key: WEB_API_KEY
        }
      }).then((res) => {
        console.log("[rider]Locate Convert Success");
        const locations: string = res.data.locations;
        const [longitude, latitude] = locations.split(",");
        resolve({ lng: Number(longitude), lat: Number(latitude) });
      });
    },
      (error) => {
        console.error("错误代码:", error.code, "错误信息:", error.message);
      },
      {

        enableHighAccuracy: true, // 高精度模式
        timeout: 10000,          // 10 秒超时
        maximumAge: 0            // 不使用缓存位置
      }
    );
  });
};