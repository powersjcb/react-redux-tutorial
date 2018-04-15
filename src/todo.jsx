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

const OptionalLink = ({active, filter, onClick, children}) => {
  if (active) {
    return (
      <span>{children}</span>
    )
  }
  return (
    <a href={'#'}
       onClick={e => {
         e.preventDefault()
         onClick()
       }}>
      {children}
    </a>
  )
}

// container component, not a part of the presentation layer
class FilterLink extends React.Component {
  componentDidMount() {
    // executed once
    this.unsubscribe = store.subscribe(() => this.forceUpdate())
  }
  componentWillUnmount() {
    this.unsubscribe()
  }


  render() {
    return (
      <OptionalLink
        children={this.props.children}
        filter={this.props.filter}
        active={
          store.getState().visibilityFilter ===
          this.props.filter
        }
        onClick={() => {
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter: this.props.filter
          })
        }}
      />
    )
  }
}

const displayFilter = (todos, filter) => {
  return todos.filter(todo => {
    switch (filter) {
      case 'SHOW_ALL':
        return true
      case 'SHOW_COMPLETED':
        return todo.completed
      case 'SHOW_ACTIVE':
        return !todo.completed
      default:
        return true
    }
  })
}

const Todo = ({text, completed, onClick}) => (
    <li
        style={{
          textDecoration: completed ? 'line-through' : 'none'
        }}
        onClick={onClick}>
      {text}
    </li>
)

const TodoList = ({todos, onTodoClick}) => (
  <ul>
    {todos.map(t => (
      <Todo key={t.id}
            {...t}  // adds props from stored objec to the react component: Object.assign(new Todo(), t, {onClick: () => {}})
            onClick={() => onTodoClick(t.id)}
      />
    ))}
  </ul>
)

const AddTodo = ({onAddClick}) => {
  let input
  return (
    <div>
      <input ref={node => {input = node}} type="text" />
      <button onClick={() => {
        onAddClick(input.value)
        input.value = ''  // set to empty string after clicking the button
      }}>
        Add todo
      </button>
    </div>
  )
}

const Footer = () => (
  <p>
    <FilterLink filter='SHOW_ALL'>
      All
    </FilterLink>
    <br/>
    <FilterLink filter='SHOW_COMPLETED'>
      Completed
    </FilterLink>
    <br/>
    <FilterLink filter='SHOW_ACTIVE'>
      Active
    </FilterLink>
  </p>
)

let nextTodoId = 0
const TodoApp = ({todos, visibilityFilter}) => {
  return (
    <div>
      <h1>Todo app</h1>
      <AddTodo
        onAddClick={(text) => {
          store.dispatch({
            type: 'ADD_TODO',
            id: nextTodoId++,
            text
          })
        }}/>
      <TodoList
        todos={displayFilter(
          todos,
          visibilityFilter
        )}
        onTodoClick={(id) => {
          store.dispatch({
            type: 'TOGGLE_TODO',
            id
          })
        }}/>
      <Footer/>
    </div>
  )
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