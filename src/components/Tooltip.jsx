import * as React from "react";

const Tooltip = ({ info }) => {
  const { object, x, y } = info;

  if (info.objects) {
    return (
      <div className="tooltip interactive" style={{ left: x, top: y }}>
        {info.objects.map((obj) => (
          <div key={obj.id}>
            <div>Id: {obj.id}</div>
            <h5>Topic:{obj?.properties?.tag?.topic[0]}</h5>
            ------------------------------------------
          </div>
        ))}
      </div>
    );
  }

  if (!object) {
    return null;
  }

  return object.cluster ? (
    <div className="tooltip" style={{ left: x, top: y }}>
      {object.point_count} records
    </div>
  ) : (
    <div className="tooltip" style={{ left: x, top: y }}>
      {object.properties.tag.topic[0]}
    </div>
  );
};

export default Tooltip;
