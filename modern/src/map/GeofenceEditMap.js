import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import theme from "@mapbox/mapbox-gl-draw/src/lib/theme";
import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as turf from "@turf/turf";
import { map } from "./Map";
import { geofenceToFeature, geometryToArea } from "./mapUtil";
import { geofencesActions } from "../store";

const draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    polygon: true,
    trash: true,
  },
  userProperties: true,
  styles: [
    ...theme,
    {
      id: "gl-draw-title",
      type: "symbol",
      filter: ["all"],
      layout: {
        "text-field": "{user_name}",
        "text-font": ["Roboto Regular"],
        "text-size": 12,
      },
      paint: {
        "text-halo-color": "white",
        "text-halo-width": 1,
      },
    },
  ],
});

const GeofenceEditMap = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const geofences = useSelector((state) =>
    Object.values(state.geofences.items)
  );

  const refreshGeofences = async () => {
    const response = await fetch("/api/geofences");
    if (response.ok) {
      dispatch(geofencesActions.refresh(await response.json()));
    }
  };

  useEffect(() => {
    refreshGeofences();

    map.addControl(draw, "top-left");

    map.on("draw.create", async (event) => {
      const feature = event.features[0];

      console.log("feature ", feature);
      let data = draw.getAll();
      console.log("map data ", data);
      let roundedArea1;
      if (data.features.length > 0) {
        // let polygon = turf.polygon([
        //   [
        //     [125, -15],
        //     [113, -22],
        //     [154, -27],
        //     [144, -15],
        //     [125, -15],
        //   ],
        // ]);

        let polygon = turf.polygon(feature.geometry.coordinates);
        let area1 = turf.area(polygon);

        console.log("polygon ", polygon);
        roundedArea1 = Math.round(area1 * 100) / 100;
        console.log("area1", roundedArea1);
      }

      const newItem = {
        name: "",
        area: geometryToArea(feature.geometry),
        attributes: { polygonArea: roundedArea1 + " mt2" },
      };
      draw.delete(feature.id);
      const response = await fetch("/api/geofences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (response.ok) {
        const item = await response.json();
        history.push(`/geofence/${item.id}`);
      }
    });

    map.on("draw.delete", async (event) => {
      const feature = event.features[0];
      const response = await fetch(`/api/geofences/${feature.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        refreshGeofences();
      }
    });

    map.on("draw.update", async (event) => {
      const feature = event.features[0];
      const item = geofences.find((i) => i.id === feature.id);
      if (item) {
        const updatedItem = { ...item, area: geometryToArea(feature.geometry) };
        const response = await fetch(`/api/geofences/${feature.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedItem),
        });
        if (response.ok) {
          refreshGeofences();
        }
      }
    });

    return () => map.removeControl(draw);
  }, []);

  useEffect(() => {
    draw.deleteAll();
    geofences.forEach((geofence) => {
      draw.add(geofenceToFeature(geofence));
    });
  }, [geofences]);

  return null;
};

export default GeofenceEditMap;
