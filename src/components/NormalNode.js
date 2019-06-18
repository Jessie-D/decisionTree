import React from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import JumpBtn from './JumpBtn'
import flow from 'lodash/flow'
const NormalNode = ({
  data: { name, knowledge, childrenAnswerIds, nodeType, action, actionParam },
  position: { left, top },
  handleSelected,
  isSelected,
  id,
  connectDragSource,
  connectDropTarget,
  drawFlow
}) => {
  let actinonTypes = {
    1: '挂机',
    3: '执行下一步'
  }

  return connectDragSource(
    connectDropTarget(
      <div
        id={`topology-node-${id}`}
        className="topology-node-wrapper"
        style={{ position: 'absolute', left: left, top: top }}
        onMouseDown={handleSelected.bind(this, {
          decisionId: id,
          name,
          knowledge,
          childrenAnswerIds
        })}
      >
        <div
          className={`topology-node-content ${
            isSelected ? 'topology-node-selected' : null
          }`}
        >
          <div className="react-contextmenu-wrapper">
            <div className="flow-node" style={{ width: 200 }}>
              <div className="flow-node-header">
                <p className="flow-node-header-title">{name}</p>
              </div>
              <p className="node-content">{knowledge}</p>
              {nodeType == 1 ? (
                <p className="node-content">
                  下一步：
                  {actionParam && actionParam.sceneNodeName
                    ? actionParam.sceneNodeName
                    : actinonTypes[action]}
                </p>
              ) : (
                <div className="flow-node-branches-wrapper">
                  {childrenAnswerIds.map(item => (
                    <JumpBtn
                      item={item}
                      id={id}
                      key={item}
                      drawFlow={drawFlow}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  )
}

const draggableSource = {
  beginDrag(props, monitor) {
    const { id, position } = props
    return {
      id,
      left: position.left,
      top: position.top,
      type: 'node',
      parentId: -1
    }
  }
}

const targetSource = {
  drop(props, monitor, component) {
    if (!component) {
      return
    }
    const item = monitor.getItem()
    console.log(props, item)
    if (item.id === props.data.id) {
      return
    }
    props.dropFlow(props.data, item)
  }
}

/**
 * Specifies the props to inject into your component.
 */
function sourceCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

function targetCollect(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connect.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver()
  }
}

// Export the wrapped component:
export default flow(
  DragSource('node', draggableSource, sourceCollect),
  DropTarget('flow', targetSource, targetCollect)
)(NormalNode)
