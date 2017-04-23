import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button className={props.winner ? "square winner" : "square"} onClick={() => props.onClick()}>
        {props.value}
      </button>
    );
}

class Board extends React.Component {
  winnerSquare(i){
    if (this.props.winner) {
      return this.props.winner.includes(i);
    } else {
      return false;
    }
  }

  renderSquare(i) {
    return <Square key={i} winner={this.winnerSquare(i)} value={this.props.squares[i]} onClick={() => this.props.onClick(i)}/>;
  }
  renderRow(indexes, row_index) {
    const row = indexes.map((index) => {
      return this.renderSquare(index)
    });
    return (
      <div key={row_index} className="board-row">
        {row}
      </div>
    )
  }
  render() {
    const indexes = [[0,1,2],[3,4,5],[6,7,8]]
    const rows = indexes.map((indexes, row_index) => {
      return this.renderRow(indexes, row_index)
    });
    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      movesDesc: false
    }
  }
  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if(calculateWinner(squares).symbol || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true
    });
  }

  changeOrderSort() {
    this.setState({
      movesDesc: !this.state.movesDesc
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerSquares = calculateWinner(current.squares).squares;
    const winner = calculateWinner(current.squares).symbol;

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    let moves = history.map((step, move) => {
      const desc = move ? 'Move #' + move : 'Game start';
      return (
        <li key={move} className={step === current ? 'selected' : ''}>
          <a href='#' onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });

    if(this.state.movesDesc){
      moves = moves.reverse();
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winner={winnerSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <br></br>
        <a href='#' onClick={() => this.changeOrderSort()}>Sort moves</a>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {squares: lines[i], symbol: squares[a]};
    }
  }
  return {squares: null, symbol: null};
}
