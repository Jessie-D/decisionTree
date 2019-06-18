import React from 'react';
import { DragSource } from 'react-dnd';

const JumpBtn = ({ item, id, connectDragSource }) => {
  return connectDragSource(
    <div id={`${id}-${item}`} key={item} className="topology-anchor-wrapper" draggable="true">
      <div className="flow-node-branch">{item}</div>
      <div className="topology-anchor-wrapper-preview" />
    </div>
  );
};
export default DragSource(
  'flow',
  {
    beginDrag(props, monitor) {
      const { id, item } = props;
      return { id, left: 0, top: 0, type: 'flow', btnName: item };
    },
    isDragging(props, monitor) {
      const item = monitor.getItem();
      console.log(monitor.getSourceClientOffset());
      props.drawFlow(item);
    },
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  })
)(JumpBtn);
