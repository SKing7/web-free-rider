"use client";
import { initAMapSecurityConfig } from "@/libs/amap-config";
import { getAmapCoordinate } from "@/libs/amap-service";
import { createMarker, setCenter } from "@/libs/amap-util";
import { Coord } from "@/type";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { Loader2, LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Amap() {
  const myLocationMarkerRef = useRef(null);
  const mapNodeRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const locateTimer = useRef<any>(null);
  const [isLocating, setLocating] = useState(false);

  const handleMapLoaded = () => {
    const map = new window.AMap.Map(mapNodeRef.current, {
      viewMode: "2D", //默认使用 2D 模式
      zoom: 14, //地图级别
      center: [116.397428, 39.90923], //地图中心点
    });
    mapRef.current = map;

    internalLocate();
  };

  const internalLocate = () => {
    setLocating(true);
    locate().then((coord) => {
      setCenter(mapRef.current, coord, 15);
    });

    locateTimer.current = setTimeout(() => {
      locateTimer.current = null;
      internalLocate();
    }, 10000);
  };

  const handleClickLocate = () => {
    if (locateTimer.current) {
      clearTimeout(locateTimer.current);
      locateTimer.current = null;
    }
    internalLocate();
  };

  const locate = (): Promise<Coord> => {
    const map = mapRef.current;

    console.log("Request Location");
    return getAmapCoordinate().then((res: Coord) => {
      const marker = createMarker(
        res,
        `<span><img width="40" height="65" src="/assets/mylocation.png" alt="my location" /></span>`
      );
      if (myLocationMarkerRef.current) {
        map.remove(myLocationMarkerRef.current);
      }
      myLocationMarkerRef.current = marker;
      map.add(marker);
      setLocating(false);
      return res;
    });
  };

  // 初始化安全配置
  useEffect(() => {
    initAMapSecurityConfig();
  }, []);

  return (
    <div className="w-full h-full">
      <Script
        strategy="lazyOnload"
        src={`https://webapi.amap.com/maps?v=2.0&key=264273b8dbce35866e45d9fb138e93d2`}
        onReady={handleMapLoaded}
      />
      <div ref={mapNodeRef} className="w-full h-full rounded-lg" />
      <div className="absolute bottom-4 right-4">
        <Button onClick={handleClickLocate}>
          {isLocating ? <Loader2 className="animate-spin" /> : <LocateFixed />}
          Locate
        </Button>
      </div>
    </div>
  );
}
