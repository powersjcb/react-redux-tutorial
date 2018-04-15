import PropTypes from 'prop-types'
import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Link, Route } from 'react-router-dom'
import './immutability.jsx'
import { TodoApp, todoStore } from './todo.jsx'

import "./index.css"

import { Game } from './ttt.jsx'

class DetailedList extends React.Component {
  static defaultProps = {
    api_url: "https://randomuser.me/api/?results=10"
  }

  constructor(props) {
    super(props)
    this.state = {
      items: []
    }
  }


  componentDidMount() {
    fetch(this.props.api_url)
      .then(results => {
        return results.json();
      }).then(data => {
        this.setState({
          items: data.results.map(user => {
            return user.name.first + ' ' + user.name.last
          })
        })
    })
  }

  render() {
    return (
      <ul>
        {this.state.items.map((item, key) => {
          return (
            <li key={key}>{item}</li>
          );
        })}
      </ul>
    );
  }
}

DetailedList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.instanceOf(React.isValidElement))
}

class App extends React.Component {
  render() {
    return (
      <div>
        <nav>
          <Link to='/ttt'>Tic Tac Toe</Link>
          <Link to='/names'>High Scores</Link>
          <Link to='/counter'>Counter</Link>
          <Link to='/todo'>TodoApp</Link>
        </nav>
        <Route component={DetailedList} path='/names'/>
        <Route component={Game} path='/ttt'/>
        <Route component={() => { return <Counter store={this.props.store} onIncrement={this.props.onIncrement} onDecrement={this.props.onDecrement} />}} path='/counter' />
        <Route component={TodoApp} path={'/todo'} />
      </div>
    );
  }
}

// redux adventures

// reducer function for counter
const counter = (state = 0, action) => {
  if (action.type === undefined) {
    return state
  }
  if (action.type === 'INCREMENT') {
    return state + 1
  }
  if (action.type === 'DECREMENT') {
    return state - 1
  }
  return state
}

const incrementAction = {type: 'INCREMENT'}
const decrementAction = {type: 'DECREMENT'}


const myCreateStore = (reducer) => {
  let state
  let listeners = []

  const getState = () => state

  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach(listener => listener())
  }

  const subscribe = (listener) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter(l => l !== listener)
    } // remove listener function
  }

  dispatch({}) // dummy actiont to get the reducer to return initial value
  return {getState, subscribe, dispatch}
}

class Counter extends React.Component {
  render() {
    return (
      <div>
        <h1>Count: {this.props.store.getState()}</h1>
        <button onClick={this.props.onIncrement}>Increment count</button>
        <button onClick={this.props.onDecrement}>Decrement count</button>
      </div>
    );
  }
}

const store = myCreateStore(counter)

const redraw = () => { ReactDOM.render((
  <BrowserRouter>
    <App store={store}
         onIncrement={() => store.dispatch(incrementAction)}
         onDecrement={() => store.dispatch(decrementAction)}
    />
  </BrowserRouter>
  ),
  document.getElementById('root')
)};

store.subscribe(redraw)
todoStore.subscribe(redraw)
store.dispatch({})

