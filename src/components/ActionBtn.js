import React from 'react'  

import { DragSource } from 'react-dnd'
 
export const ActionBtn = ({ name, isDropped, isDragging, connectDragSource }) => {

  return connectDragSource(
                <div className="topology-template-wrapper" >
                  <div className="flow-tools-templates-item">{name}</div>
                  <div className="topology-template-preview" />
                </div>  
          )
}
export default DragSource(
  "btn",
  {
    beginDrag(props) {  
      return {left: 0, top: 0, name: props.name,type:'btn' ,id:new Date().getTime()};
    },  
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(), 
  }),
)(ActionBtn)