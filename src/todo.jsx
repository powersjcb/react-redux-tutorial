import * as Redux from 'redux'
import PropTypes from 'prop-types'
import React from "react"
import { connect } from 'react-redux'

// action creators:
// - go separate from components/reducers
// - document actions of the application
const addTodo = (text) => {
  return {
      type: 'ADD_TODO',
      id: nextTodoId++,
      text
  }
}

const setVisibilityFilter = (filter) => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter
  }
}

const toggleTodo = (id) => {
  return {
    type: 'TOGGLE_TODO',
    id
  }
}

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

// Now generated by ReactRedux#connect function
//
// container component, not a part of the presentation layer
// class FilterLink extends React.Component {
//   componentDidMount() {
//     // executed once
//     const { store } = this.context
//     this.unsubscribe = store.subscribe(() => this.forceUpdate())
//   }
//   componentWillUnmount() {
//     this.unsubscribe()
//   }
//
//   render() {
//     const { store } = this.context
//     return (
//       <OptionalLink
//         children={this.props.children}
//         filter={this.props.filter}
//         onClick={() => {
//
//         }}
//       />
//     )
//   }
// }

const mapStateToLinkProps = (state, ownProps) => {
    return {
      filter: state.visibilityFilter,
      active: state.visibilityFilter === ownProps.filter
    }
}
const mapDispatchToLinkProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter))
    }
  }
}
const FilterLink = connect(
  mapStateToLinkProps,
  mapDispatchToLinkProps
)(OptionalLink)

const filterTodos = (todos, filter) => {
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
      // adds props from stored objec to the react component:
      // Object.assign(new Todo(), t, {onClick: () => {}})
      <Todo key={t.id}
            {...t}
            onClick={() => onTodoClick(t.id)}
      />
    ))}
  </ul>
)
const mapStateToTodoListProps = (state) => {
  return {
    todos: filterTodos(
      state.todos,
      state.visibilityFilter
    ),
    visibilityFilter: state.visibilityFilter
  }
}
const mapDispatchToTodoListProps = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id))
    },

  }
}
const VisibleTodoList = connect(
  mapStateToTodoListProps,
  mapDispatchToTodoListProps
)(TodoList)

// Now generated by ReactRedux#connect function
//
// class VisibleTodoList extends React.Component {
//   componentDidMount() {
//     const { store } = this.context
//     this.unsubscribe = store.subscribe(() => {
//       this.forceUpdate()
//     })
//   }
//   componentWillUnmount() {
//     this.unsubscribe()
//   }
//   render() {
//     const { store } = this.context
//     const state = store.getState()
//     return (
//       <TodoList
//         todos={filterTodos(
//           state.todos,
//           state.visibilityFilter
//         )}
//       />
//     )
//   }
// }
//
// VisibleTodoList.contextTypes = {
//   store: PropTypes.object
// }

// (props, context): context = {store: ... }
let AddTodo = ({ dispatch }) => {
  let input
  return (
    <div>
      <input ref={node => {input = node}} type="text" />
      <button onClick={() => {
        dispatch(addTodo(input.value))
        input.value = ''  // set to empty string after clicking the button
      }}>
        Add todo
      </button>
    </div>
  )
}
AddTodo = connect()(AddTodo) // injects dispatch by default when both values are null

AddTodo.contextTypes = {
  store: PropTypes.object
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
const TodoApp = () => (
  <div>
    <h1>Todo app</h1>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
)

// class Provider extends React.Component {
//   getChildContext() {
//     return {
//       store: this.props.store
//     }
//   }
//   render() {
//     return this.props.children
//   }
// }
//
// Provider.childContextTypes = {
//   store: PropTypes.object
// }


const todoStore = createStore(todoApp)
todoStore.subscribe(() => {console.log(todoStore.getState())})

export {
  TodoApp,
  todos,
  todoStore,
}