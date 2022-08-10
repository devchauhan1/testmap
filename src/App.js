import React, { useState } from "react";
import DeckGL from "@deck.gl/react";
import {
  StaticMap,
  MapContext,
  NavigationControl,
  GeolocateControl,
} from "react-map-gl";
import { MapView } from "@deck.gl/core";
import { IconLayer } from "@deck.gl/layers";
import IconClusterLayer from "./iconClusterLayer";
import iconMapping from "./data/location-icon-mapping.json";
import eventData from "./data/events.json";
import Tooltip from "./components/Tooltip";

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";

const MAP_VIEW = new MapView({ repeat: true });
const INITIAL_VIEW_STATE = {
  latitude: 51.47,
  longitude: 0.45,
  zoom: 4,
  bearing: 0,
  pitch: 30,
};

const NAV_CONTROL_STYLE = {
  position: "absolute",
  top: 10,
  left: 10,
};

const GEOLOCATE_CONTROL_STYLE = {
  position: "absolute",
  top: 100,
  left: 10,
};

const ICON_MAPPING = {
  marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
};

const stringHash = require("string-hash");

function App() {
  const [hoverInfo, setHoverInfo] = useState({});
  const [showEvents, setShowEvents] = useState(true);

  const layerProps = {
    data: eventData.items,
    pickable: true,
    getPosition: (d) => d.geometry.coordinates,
    iconAtlas: "./location-icon-atlas.png",
    iconMapping,
    onHover: !hoverInfo.objects && setHoverInfo,
  };

  const layer = !showEvents
    ? new IconClusterLayer({ ...layerProps, id: "icon-cluster", sizeScale: 40 })
    : new IconLayer({
        ...layerProps,
        id: "icon",
        // eslint-disable-next-line no-unused-vars
        getIcon: (d) => "marker",
        iconMapping: ICON_MAPPING,
        sizeScale: 4,
        getSize: 4,
        sizeMinPixels: 6,
        iconAtlas: "./icon-atlas.png",
        getColor: (d) => {
          /* generate random color from topic's string hash 
             another mechanism is to use map to map to specific color
             */
          const computation = stringHash(d?.properties?.tag?.topic[0]);
          return [computation % 240, computation % 140, 0];
        },
      });

  const expandTooltip = (info) => {
    if (info.picked) {
      setHoverInfo(info);
    } else {
      setHoverInfo({});
    }
  };

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={{ dragRotate: false }}
      layers={[layer]}
      ContextProvider={MapContext.Provider}
      views={MAP_VIEW}
      onClick={expandTooltip}
    >
      <StaticMap mapStyle={MAP_STYLE} />
      <NavigationControl style={NAV_CONTROL_STYLE} showCompass={true} />
      <GeolocateControl style={GEOLOCATE_CONTROL_STYLE} />
      <Tooltip info={hoverInfo} />
      <div className="checktopic">
        <label>
          <input
            type={"checkbox"}
            checked={showEvents}
            onChange={(e) => setShowEvents(e.target.checked)}
          />
          Show events by topic
        </label>
      </div>
    </DeckGL>
  );
}

export default App;
