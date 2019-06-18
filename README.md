# 决策树绘制

## [demo](https://jessie-d.github.io/decisionTree/)

## Screenshot

![screenshot](/screenshot/screenshot.png)

## 相关依赖

### "react": "^16.3.2"

### react-dnd

### react-dnd-html5-backend

### immutability-helper

## 使用

```bash
$ npm install
$ npm  start
$ open http://localhost:3000/
```

## example

```js
import React from 'react'
import { render } from 'react-dom'
import DecisionTree from 'DecisionTree'
import decisionTreeData from './decisionTreeData' //决策树数据
const App = () => <DecisionTree decisionTreeData={decisionTreeData} />
render(<App />, document.getElementById('root'))
```

## decisionTreeData 字段解析

```js
"decisionItemBO":{...},//构建的决策树
//节点数组
"decisionItemBOList": [
  {
        "decisionId": 7615464,//节点id
        "parentId": 7615842, //父节点id
        "name": "普通话术",//节点title
        "answerIds": [  //连接的父节点按钮
          "默认"
        ],
        "childrenAnswerIds": [ //该节点下的跳转按钮
          "肯定",
          "否定",
          "默认",
          "特殊"
        ],
        "knowledge": "我这边是百应平台，请问您是${客户名称}吗？",//节点内容
        "action": 2,// 根据业务需求加 1: '挂机', 3: '执行下一步'
        "nodeType": 0, //0:普通节点，1:跳转节点
  }
  ....
]
```
