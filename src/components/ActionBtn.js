import React from 'react'  

import { DragSource } from 'react-dnd'
const style = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move',
  float: 'left',
}
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