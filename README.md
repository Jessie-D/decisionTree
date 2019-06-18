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

## Usage

```js
import React from 'react'
import { render } from 'react-dom'
import DecisionTree from 'DecisionTree'
import decisionTreeData from './decisionTreeData' //决策树数据
const App = () => <DecisionTree decisionTreeData={decisionTreeData} />
render(<App />, document.getElementById('root'))
```
