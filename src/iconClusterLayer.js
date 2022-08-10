import { CompositeLayer } from "@deck.gl/core";
import Supercluster from "supercluster";
import { IconLayer } from "@deck.gl/layers";

/*
https://github.com/visgl/deck.gl/blob/8.8-release/examples/website/icon/icon-cluster-layer.js
 */

function getIconName(size) {
  if (size === 0) {
    return "";
  }
  if (size < 10) {
    return `marker-${size}`;
  }
  if (size < 100) {
    return `marker-${Math.floor(size / 10)}0`;
  }
  return "marker-100";
}

function getIconSize(size) {
  return Math.min(100, size) / 100 + 1;
}

export default class IconClusterLayer extends CompositeLayer {
  // eslint-disable-next-line class-methods-use-this
  shouldUpdateState({ changeFlags }) {
    return changeFlags.somethingChanged;
  }

  updateState({ props, oldProps, changeFlags }) {
    const rebuildIndex =
      changeFlags.dataChanged || props.sizeScale !== oldProps.sizeScale;

    if (rebuildIndex) {
      const index = new Supercluster({
        maxZoom: 16,
        radius: props.sizeScale * Math.sqrt(2),
      });
      index.load(
        props.data.map((d) => ({
          geometry: { coordinates: props.getPosition(d) },
          properties: d,
        }))
      );
      this.setState({ index });
    }

    const z = Math.floor(this.context.viewport.zoom);
    if (rebuildIndex || z !== this.state.z) {
      this.setState({
        data: this.state.index.getClusters([-180, -85, 180, 85], z),
        z,
      });
    }
  }

  getPickingInfo({ info, mode }) {
    const pickedObject = info.object && info.object.properties;
    if (pickedObject) {
      if (pickedObject.cluster && mode !== "hover") {
        // eslint-disable-next-line no-param-reassign
        info.objects = this.state.index
          .getLeaves(pickedObject.cluster_id, 25)
          .map((f) => f.properties);
      }
      // eslint-disable-next-line no-param-reassign
      info.object = pickedObject;
    }
    return info;
  }

  renderLayers() {
    const { data } = this.state;
    const { iconAtlas, iconMapping, sizeScale } = this.props;

    return new IconLayer(
      this.getSubLayerProps({
        id: "icon",
        data,
        iconAtlas,
        iconMapping,
        sizeScale,
        getPosition: (d) => d.geometry.coordinates,
        getIcon: (d) =>
          getIconName(d.properties.cluster ? d.properties.point_count : 1),
        getSize: (d) =>
          getIconSize(d.properties.cluster ? d.properties.point_count : 1),
      })
    );
  }
}
