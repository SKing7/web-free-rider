import { Coord } from "@/type";

export const createMarker = (coord: Coord, markerContent: string) => {
  const AMap = window.AMap;
  const { lat, lng } = coord;

  const position = new AMap.LngLat(Number(lng), Number(lat)); //Marker 经纬度

  const marker = new AMap.Marker({
    position: position,
    content: markerContent, //将 html 传给 content
    offset: new AMap.Pixel(-13, -30), //以 icon 的 [center bottom] 为原点
  });
  return marker;
};


export const setCenter = (map: any, coord: Coord, zoom: number = 11) => {
  map.setZoomAndCenter(zoom, [coord.lng, coord.lat]);
}

export const createCluster = (map: any, points: { lnglat: number[], weight?: number }[]) => {
  const AMap = window.AMap;
  let cluster: { clear: () => void; } | null = null;

  return new Promise((resolve) => {
    map.plugin(["AMap.MarkerCluster"], function () {
      cluster = new AMap.MarkerCluster(map, points, {
        gridSize: 5 // 聚合网格像素大小
      });
      resolve(cluster);
    });
  })
}

