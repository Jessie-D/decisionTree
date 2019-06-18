/*** examples/src/index.js ***/
import React from 'react'
import { render } from 'react-dom'
import DecisionTree from '../../src'
import decisionTreeData from './decisionTreeData'
const App = () => <DecisionTree decisionTreeData={decisionTreeData.data} />
render(<App />, document.getElementById('root'))
