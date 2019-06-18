import React from 'react';
import { DragLayer } from 'react-dnd';
const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
};
function getItemStyles(props) {
  const { initialOffset, currentOffset } = props;
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    };
  }
  let { x, y } = currentOffset;

  let width = Math.abs(x - initialOffset.x);
  let height = Math.abs(y - initialOffset.y);

  const transform = `translate(${initialOffset.x}px, ${initialOffset.y}px)`;
  return {
    transform,
    WebkitTransform: transform,
    width,
    height,
    zIndex: 2,
    background: '#fff',
  };
}
const CustomDragLayer = props => {
  const { item, itemType, isDragging } = props;
  console.log(itemType);
  function renderItem() {
    switch (itemType) {
      case 'flow': {
        return <div>flow3</div>;
      }
      default:
        return null;
    }
  }
  if (!isDragging) {
    return null;
  }
  return (
    <div style={layerStyles}>
      <div style={getItemStyles(props)}>{renderItem()}</div>
    </div>
  );
};
export default DragLayer(monitor => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  initialOffset: monitor.getInitialSourceClientOffset(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging(),
}))(CustomDragLayer);
