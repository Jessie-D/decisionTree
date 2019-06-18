import React, { useState, useEffect, useCallback } from 'react'
import { DragDropContext, DragDropContextProvider } from 'react-dnd'

import HTML5Backend from 'react-dnd-html5-backend'

import ActionBtn from './components/ActionBtn'
import Target from './components/Target'
import update from 'immutability-helper'

import './global.less'

function gerateTree(list, pNode) {
  list.map(node => {
    node.id = node.decisionId || node.id
    pNode.id = pNode.decisionId || pNode.id
    pNode.childrenList = pNode.childrenList || []
    if (node.parentId === pNode.id) {
      let exists = pNode.childrenList.some(item => {
        item.id = item.decisionId || item.id
        return item.id == node.id
      })
      if (!exists) {
        pNode.childrenList.push(node)
      }
    }
  })

  pNode.childrenList.map(item => {
    gerateTree(list, item)
  })
  return pNode
}

class Container extends React.Component {
  constructor(props) {
    super(...arguments)
    this.state = {
      data: props.decisionTreeData,
      positions: {},
      flows: []
    }
    this.onDrop = this.onDrop.bind(this)
    this.autoLayOut = this.autoLayOut.bind(this)
    this.autoFlow = this.autoFlow.bind(this)
    this.dropFlow = this.dropFlow.bind(this)
  }
  setCenter() {
    document.querySelector('.topology-wrapper').scrollTop =
      5000 -
      document.querySelector('.react-contextmenu-wrapper').offsetHeight / 2
    document.querySelector('.topology-wrapper').scrollLeft =
      5000 -
      document.querySelector('.react-contextmenu-wrapper').offsetWidth / 2
  }

  //自动布局
  autoLayOut(data) {
    console.log(data)
    //检查是否能构建为一棵树，没有孤立节点，
    //---如果有parent为-1 其他子节点的 parentId没有指向该节点 则return 无法自动布局
    //---如果有超过1个顶级节点则提示 并return
    //---构建节点树
    let decisionItemBOList = data.decisionItemBOList
    let decisionNodeBO = data.decisionNodeBO
    let rootNode = {}
    let count = 0
    for (let i = 0; i < decisionItemBOList.length; i++) {
      let pNode = decisionItemBOList[i]
      pNode.id = pNode.decisionId || pNode.id
      let hasChild = false
      if (pNode.parentId === -1) {
        count++
        if (count > 1) {
          console.error('存在多个根节点')
          return
        }
        for (let j = 0; j < decisionItemBOList.length; j++) {
          let childNode = decisionItemBOList[j]
          childNode.id = childNode.decisionId || childNode.id
          if (childNode.id === pNode.id) {
            continue
          }

          if (childNode.parentId === pNode.id) {
            hasChild = true
          }
        }
        if (!hasChild) {
          return
        }
        rootNode = pNode
      }
    }

    decisionNodeBO = gerateTree(decisionItemBOList, rootNode)
    //分层存储节点
    let levelNodes = {}
    let level = 0
    function separateLevel(nodes, index) {
      let arr = levelNodes[index] ? levelNodes[index] : []
      level = index
      nodes.map(node => {
        arr.push(node.decisionId || node.id)
        levelNodes[index] = arr
        if (node.childrenList.length) {
          separateLevel(node.childrenList, index + 1)
        }
      })
    }
    separateLevel([decisionNodeBO], level)
    console.log(levelNodes, level)

    let treeHeight = 0,
      treeWidth = 0,
      maxlevel = 0
    let levelHeight = {}
    let levelWidth = {}

    for (let i = 0; i <= level; i++) {
      levelHeight[i] = Math.max(
        ...levelNodes[i].map(
          item => this.getEle(`topology-node-${item}`).offsetHeight
        )
      )
      treeHeight += levelHeight[i]
      levelWidth[i] = 0
      levelNodes[i].map(item => {
        levelWidth[i] += this.getEle(`topology-node-${item}`).offsetWidth
      })

      //找到最多节点层
      maxlevel =
        Math.max(levelNodes[maxlevel], levelNodes[i].length) === maxlevel
          ? maxlevel
          : i
    }

    treeWidth = levelNodes[maxlevel].map(item => {
      treeWidth += this.getEle(`topology-node-${item}`).offsetWidth
    })
    //加上中间间距
    treeHeight += 50 * level
    treeWidth += 25 * (levelNodes[maxlevel].length - 1)

    let treeTop = 5000 - treeHeight / 2
    let treeLeft = 5000 - treeWidth / 2

    let levalTop = treeTop
    let pos = {}
    for (let i = 0; i <= level; i++) {
      levalTop = i > 0 ? levalTop + levelHeight[i - 1] + 50 : levalTop
      let levelLeft =
        5000 - (levelWidth[i] + 25 * (levelNodes[i].length - 1)) / 2
      for (let j = 0; j < levelNodes[i].length; j++) {
        let eleNode = this.getEle(`topology-node-${levelNodes[i][j]}`)
        levelLeft =
          j == 0
            ? levelLeft
            : levelLeft +
              this.getEle(`topology-node-${levelNodes[i][j - 1]}`).offsetWidth +
              25
        let left = levelLeft
        let top = levalTop

        pos[levelNodes[i][j]] = { left, top, offsetWidth: eleNode.offsetWidth }
      }
    }

    this.autoFlow(data, pos)
  }

  autoFlow(data, pos) {
    //确定路径
    let path = ''
    let arr = []
    for (let item of data.decisionItemBOList) {
      if (item.parentId && item.parentId != -1) {
        for (let aName of item.answerIds) {
          let node = pos[item.decisionId || item.id]
          let pNode = pos[item.parentId]

          let btn = this.getEle(`${item.parentId}-${aName}`)
          let x0 = pNode.left + btn.offsetLeft + btn.offsetWidth / 2
          let y0 = pNode.top + btn.offsetTop + 23
          let x1 = node.left + node.offsetWidth / 2
          let y1 = node.top - 8
          let f = -35
          arr.push({ x0, y0, x1, y1, f })
        }
      }
    }

    this.setState({
      positions: pos,
      flows: arr
    })
  }
  getEle(id) {
    return document.getElementById(id)
  }
  onDrop(id, left, top, type, name) {
    if (type === 'btn') {
      let newNode = {
        id,
        name,
        knowledge: '',
        action: {},
        actionParam: {},
        parentId: -1
      }
      newNode.answerIds = []
      if (name === '普通节点') {
        newNode.childrenAnswerIds = ['肯定', '否定', '默认']
        newNode.nodeType = 0
      } else {
        newNode.childrenAnswerIds = []
        newNode.nodeType = 1
      }
      // console.log(positions,data)
      this.setState(
        update(this.state, {
          positions: {
            $merge: {
              [id]: { left, top, offsetWidth: 202 }
            }
          },
          data: {
            decisionItemBOList: {
              $push: [newNode]
            }
          }
        })
      )
    }
    if (type === 'node') {
      this.setState(
        update(this.state, {
          positions: {
            [id]: {
              $merge: { left, top }
            }
          }
        }),
        () => {
          const { positions, data } = this.state
          this.autoFlow(data, positions)
        }
      )
    }
  }
  dropFlow(target, source) {
    let decisionItemBOList = this.state.data.decisionItemBOList
    target.id = target.decisionId || target.id
    source.id = source.decisionId || source.id

    for (let item of decisionItemBOList) {
      item.id = item.decisionId || item.id
      if (item.parentId === source.id && item.id !== target.id) {
        //原来指向taget删掉该source.answerIds
        item.answerIds = item.answerIds.filter(item => item !== source.btnName)
        item.parentId = item.answerIds.length === 0 ? -1 : item.parentId
        continue
      }

      if (item.id === target.id) {
        if (item.parentId === source.id) {
          item.answerIds.push(source.btnName)
        } else item.answerIds = [source.btnName]

        item.parentId = source.id
      }
    }
    this.setState(
      update(this.state, {
        data: {
          decisionItemBOList: {
            $set: decisionItemBOList
          }
        }
      }),
      () => {
        const { positions, data } = this.state
        this.autoFlow(data, positions)
      }
    )
  }
  componentDidMount() {
    this.setCenter()
    this.autoLayOut(this.props.decisionTreeData)
  }

  render() {
    const { positions, flows, data } = this.state
    return (
      <div className="robot-talk-flow">
        <div className="refactor-flow">
          <div className="flow-tools">
            <div className="flow-tools-templates" style={{ width: '180px' }}>
              <ActionBtn id="0" name="普通节点" type="btn" />
              <ActionBtn id="1" name="跳转节点" type="btn" />
            </div>
          </div>
          <div className="react-contextmenu-wrapper">
            <div className="topology-container">
              <div className="topology-wrapper">
                <Target
                  positions={positions}
                  flows={flows}
                  data={data}
                  onDrop={this.onDrop}
                  dropFlow={this.dropFlow}
                  deleteNode={this.deleteNode}
                  accept={['btn', 'node']}
                />
              </div>
              <div className="topology-tools">
                <div className="topology-tools-btn" onClick={this.setCenter}>
                  <img
                    src="https://cdn.byai.com/static/topology/center.svg"
                    alt=""
                  />
                  <div className="tooltip">定位中心</div>
                </div>
                <div
                  className="topology-tools-btn"
                  onClick={this.autoLayOut.bind(this, data)}
                >
                  <img
                    src="https://cdn.byai.com/static/topology/layout.svg"
                    alt=""
                  />
                  <div className="tooltip">自动布局</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(Container)
