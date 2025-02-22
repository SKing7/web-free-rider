"use client";
import { initAMapSecurityConfig, WEB_SDK_KEY } from "@/libs/amap-config";
import { getAmapCoordinate } from "@/libs/amap-service";
import { createCluster, createMarker, setCenter } from "@/libs/amap-util";
import { Coord } from "@/type";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchCameraCoordinateData, requestWakeLock } from "@/libs/utils";
import SelectZoom from "./SelectZoom";


export default function Amap() {
  const myLocationMarkerRef = useRef(null);
  const [zoom, setZoom] = useState(14);
  const mapNodeRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const locateTimer = useRef<any>(null);
  const [isLocating, setLocating] = useState(false);

  const handleMapLoaded = () => {
    console.log("[rider]Map Loaded");
    const map = new window.AMap.Map(mapNodeRef.current, {
      viewMode: "2D", //默认使用 2D 模式
      zoom, //地图级别
      center: [116.397428, 39.90923], //地图中心点
    });
    mapRef.current = map;

    console.log("[rider]Map Start Locate");
    internalLocate();
    initCamera();
  };

  useEffect(() => {
    requestWakeLock();
  }, []);

  const internalLocate = useCallback(() => {
    setLocating(true);
    locate().then((coord) => {
      setCenter(mapRef.current, coord, zoom);
    });

    locateTimer.current = setTimeout(() => {
      internalLocate();
    }, 30000);
  }, [zoom]);

  const handleClickLocate = () => {
    if (locateTimer.current) {
      clearTimeout(locateTimer.current);
      locateTimer.current = null;
    }
    internalLocate();
  };

  const locate = (): Promise<Coord> => {
    const map = mapRef.current;

    console.log("[rider]Request Locate");
    return getAmapCoordinate().then((res: Coord) => {
      console.log("[rider]Locate Success Add Marker");
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

  const onChangeZoom = (v: number) => {
    setZoom(v)
    // setCenter(mapRef.current, coord, v);
  };

  const initCamera = () => {
    const map = mapRef.current;
    fetchCameraCoordinateData().then((res) => {
      const data = res.data as Coord[];
      const markers = data.map((item: Coord) => {
        return { lnglat: [Number(item.lng), Number(item.lat)] };
      });
      createCluster(map, markers);
    });
  };

  return (
    <div className="w-full h-full">
      <Script
        strategy="lazyOnload"
        src={`https://webapi.amap.com/maps?v=2.0&plugin=AMap.MarkerClusterer&key=${WEB_SDK_KEY}`}
        onReady={handleMapLoaded}
      />
      <div ref={mapNodeRef} className="w-full h-full rounded-lg" />
      <div className="absolute bottom-4 right-4">
        <div>
          <SelectZoom zoom={zoom} onChangeZoom={onChangeZoom}/>
        </div>
        <div className="mt-[10px]">
          <Button
            onClick={handleClickLocate}
            className="bg-[hsl(349.7,89.2%,60.2%)] text-white hover:bg-[hsl(349.7,89.2%,50%)]"
          >
            {isLocating ? <Loader2 className="animate-spin" /> : <LocateFixed />}
            Locate
          </Button>
        </div>
      </div>
    </div>
  );
}
