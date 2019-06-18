import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import NormalNode from './NormalNode';
import Flow from './Flow';

class Target extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      selectNode: {},
    };
  }
  dropFlow = (target, source) => {
    this.props.dropFlow(target, source);
  };

  handleSelected = selectNode => {
    this.setState({ selectNode });
  };
  deleteNode(e) {
    console.log(e);
  }
  drawFlow() {
    console.log('drawFlow', arguments);
  }
  render() {
    const { isOver, canDrop, connectDropTarget, droppedItem, positions, flows, data } = this.props;
    const { selectNode } = this.state;
    return connectDropTarget(
      <div className="topology-canvas">
        {data &&
          data.decisionItemBOList.map(item => {
            let id = item.decisionId || item.id;
            let position = positions && positions[id] ? positions[id] : { left: 0, top: 0 };
            return (
              <NormalNode
                key={id}
                id={id}
                data={item}
                position={position}
                type="node"
                isSelected={selectNode.decisionId === id}
                handleSelected={this.handleSelected}
                dropFlow={this.dropFlow}
                deleteNode={this.deleteNode}
                drawFlow={this.drawFlow}
              />
            );
          })}
        <svg className="topology-svg">
          {flows.length &&
            flows.map((item, index) => {
              return <Flow key={index} flow={item} />;
            })}
        </svg>
      </div>
    );
  }
}

const spec = {
  drop(props, monitor, component) {
    if (!component) {
      return;
    }
    const item = monitor.getItem();
    let delta = monitor.getDifferenceFromInitialOffset();

    let left = Math.round(item.left + delta.x);
    let top = Math.round(item.top + delta.y);
    if (item.type === 'btn') {
      if (item.name === '跳转节点') {
        left += 100;
      }
      left += document.querySelector('.topology-wrapper').scrollLeft;
      top += document.querySelector('.topology-wrapper').scrollTop - 23;
    }
    //component.moveBox(item.id, left, top);
    props.onDrop(item.id, left, top, item.type, item.name);
  },
};
function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
  };
}

export default DropTarget(props => props.accept, spec, collect)(Target);
