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
  const [myCoord, setMyCoord] = useState<number[]>([116.397428, 39.90923]);
  const mapNodeRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const mapClusterRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const zoomRef = useRef<number>(16);
  const locateTimer = useRef<any>(null);
  const [isLocating, setLocating] = useState(false);

  const handleMapLoaded = () => {
    console.log("[rider]Map Loaded");
    const map = new window.AMap.Map(mapNodeRef.current, {
      viewMode: "2D", //默认使用 2D 模式
      zoom, //地图级别
      center: myCoord, //地图中心点
    });
    mapRef.current = map;

    console.log("[rider]Map Start Locate");
    internalLocate();
    initCamera();
  };

  useEffect(() => {
    requestWakeLock();
  }, []);

  useEffect(() => {
    debugger;
    zoomRef.current = zoom;
  }, [zoom]);

  const internalLocate = () => {
    const zoom = zoomRef.current;
    debugger;
    setLocating(true);
    locate().then((coord) => {
      setLocating(false);
      setCenter(mapRef.current, coord, zoom);
    });

    locateTimer.current = setTimeout(() => {
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

      setMyCoord([Number(res.lng), Number(res.lat)]);
      myLocationMarkerRef.current = marker;
      map.add(marker);
      return res;
    });
  };

  // 初始化安全配置
  useEffect(() => {
    initAMapSecurityConfig();
  }, []);

  const updateMarkerOrCluster = useCallback((zoom: number) => {
    const markers = markersRef.current;
    const map = mapRef.current;
    if (zoom > 0) {
      if (mapClusterRef.current) {
        return;
      }
      createCluster(map, markers).then((cluster) => {
        mapClusterRef.current = cluster;
      });
      markersRef.current.forEach((marker) => {
        mapRef.current.remove(marker);
      });
    } else {
      if (mapClusterRef.current) {
        mapClusterRef.current.clear();
        mapClusterRef.current = null;
      }
      markersRef.current.forEach((marker) => {
        mapRef.current.add(marker);
      });
    }
  }, []);

  const onChangeZoom = useCallback(
    (v: number) => {
      setZoom(v);
      setCenter(
        mapRef.current,
        {
          lng: myCoord[0],
          lat: myCoord[1],
        },
        v
      );
      updateMarkerOrCluster(v);
    },
    [myCoord]
  );

  const initCamera = useCallback(() => {
    fetchCameraCoordinateData().then((res) => {
      const data = res.data as Coord[];
      const markers = data.map((item: Coord) => {
        return { lnglat: [Number(item.lng), Number(item.lat)] };
      });
      markersRef.current = markers;
      updateMarkerOrCluster(zoom);
    });
  }, [updateMarkerOrCluster, zoom]);

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
          <SelectZoom zoom={zoom} onChangeZoom={onChangeZoom} />
        </div>
        <div className="mt-[10px]">
          <Button
            onClick={handleClickLocate}
            className="bg-[hsl(349.7,89.2%,60.2%)] text-white hover:bg-[hsl(349.7,89.2%,50%)]"
          >
            {isLocating ? (
              <Loader2 className="animate-spin" />
            ) : (
              <LocateFixed />
            )}
            Locate
          </Button>
        </div>
      </div>
    </div>
  );
}
