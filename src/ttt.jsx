import React from "react"

class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={this.props.onClick}>
        {this.props.value}
      </button>
    );
  }
}

const isValidMove = (squares, move) => {
  // squares is Array(9), move is integer
  return !squares[move] && move < squares.length
}

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i=0; i < lines.length; i++) {  // for each possible winning state
    let winner = squares[lines[i][0]];

    if (winner && lines[i].every((idx) => {return squares[idx] === winner;})) { // ensure all items in that row match
      return winner;
    }
  }
  return '';
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square value={this.props.squares[i]}
              onClick={() => {this.props.handleSquareClick(i)}}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

export class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hist: [
        {
          squares: Array(9).fill(''),
          isNext: 'O',
          isWinner: ''
        }
      ],
      currentStep: 0
    }
  }

  currentState() {
    return this.state.hist[this.state.currentStep]
  }

  handleSquareClick (i) {
    let isNext = ''
    if (this.state.hist.length - 1 !== this.state.currentStep) {
      return
    }
    const hist = this.state.hist.slice()
    const squares = this.currentState().squares.slice()
    if ( isValidMove(squares, i)) {
      if (this.currentState().isNext === 'O') {
        isNext = 'X'
      } else {
        isNext = 'O'
      }
      squares[i] = this.currentState().isNext

      hist.push({
        squares: squares,
        isNext: isNext,
        isWinner: calculateWinner(squares)
      })
      this.setState({hist: hist, currentStep: hist.length - 1})
    }
  }

  jumpTo(move) {
    this.setState({currentStep: move})
  }

  render() {
    const moves = this.state.hist.map((step, move) => {
      const description =  move ? 'Go to move #' + move : 'Go to game start'
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{description}</button>
        </li>
      )
    })
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={this.currentState().squares}
                 handleSquareClick={(i) => {this.handleSquareClick(i)}}
          />
        </div>
        <div className="game-info">
          <ul>
            { this.currentState().isWinner &&
              <li>
                Winner: {this.currentState().isWinner}
              </li>
            }
            { !this.currentState().isWinner &&
              <li>
                Next move: {this.currentState().isNext}
              </li>
            }
          </ul>
          <h4>Games state:</h4>
          <ol>
            {moves}
          </ol>
        </div>
      </div>
    );
  }
}

