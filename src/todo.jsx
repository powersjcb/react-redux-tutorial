import React from "react"
import * as Redux from 'redux'

import deepFreeze from 'deep-freeze'
import expect from 'expect'


const todo = (state, action) =>{
  switch(action.type) {
    case 'ADD_TODO':
      return {
          id: action.id,
          text: action.text,
          completed: false
        }
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state
      }
      return Object.assign({}, state, {
        completed: !state.completed
      })
    default:
      return state
  }
}

const todos = (state=[], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return state.slice().concat(
        todo(undefined, action)
      )
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action))
    default:
      return state
  }
}

const visibilityFilter = (
  state='SHOW_ALL',
  action
) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}

// const todoApp = (state = {}, action) => {
//   return {
//     todos: todos(state.todos, action),
//     visibilityFilter: visibilityFilter(
//       state.visibilityFilter,
//       action
//     )
//   }
// }

// const { combineReducers } = Redux

const combineReducers = (reducers) => {
  return (state = {}, action) => {
    return Object.keys(reducers).reduce((nextState, key) => {
      nextState[key] = reducers[key](state[key], action)
      return nextState
    }, {})
  }
}

const { createStore } = Redux

const todoApp = combineReducers({
  todos,
  visibilityFilter
})


const store = createStore(todoApp)
store.subscribe(() => {console.log(store.getState())})

let nextTodoId = 0
class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  handleAddTodo() {
    store.dispatch({
      type: 'ADD_TODO',
      text: this.textInput.current.value,
      id: nextTodoId
    })
    nextTodoId = nextTodoId + 1
  }



  render() {
    const displayFilter = (todo) => {
      const filter_state = store.getState().visibilityFilter
      switch (filter_state) {
        case 'SHOW_ALL':
          return true
        case 'HIDE_COMPLETED':
          return !todo.completed
        default:
          return true
      }
    }
    const toggleTodo = (id) => {
      store.dispatch({
        type: 'TOGGLE_TODO',
        id: id
      })
    }

    return (
      <div>
        <h1>Todo app</h1>
        <button onClick={ () => {store.dispatch({'type': 'SET_VISIBILITY_FILTER', 'filter': 'SHOW_ALL'})} }>Show all</button>
        <button onClick={ () => {store.dispatch({'type': 'SET_VISIBILITY_FILTER', 'filter': 'HIDE_COMPLETED'})} }>Hide completed</button>
        <input ref={this.textInput} type="text"/>
        <button onClick={this.handleAddTodo.bind(this)} >Add todo</button>
        <ul>
          {store.getState().todos.filter(displayFilter).map(todo => {
            return (
              <li key={todo.id}>{todo.text}
                <button onClick={() => {toggleTodo(todo.id)}}>Finish task</button>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}


const testAddTodo = () => {
  const stateBefore = []
  const action = {
    type: 'ADD_TODO',
    id: 0,
    text: 'Learn Redux'
  }
  const stateAfter = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false
    }
  ]

  deepFreeze(stateBefore)
  deepFreeze(action)

  expect(
    todos(stateBefore, action)
  ).toEqual(stateAfter)
}

const testToggleTodo = () => {
  const stateBefore = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false
    },
    {
      id: 1,
      text: 'Go shopping',
      completed: false
    }
  ]
  const action = {
    type: 'TOGGLE_TODO',
    id: 1
  }
  const stateAfter = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false
    },
    {
      id: 1,
      text: 'Go shopping',
      completed: true
    },
  ]

  deepFreeze(stateBefore)
  deepFreeze(action)

  expect(
    todos(stateBefore, action)
  ).toEqual(stateAfter)
}

testAddTodo()
testToggleTodo()

export {
  TodoApp,
  store as todoStore,
}