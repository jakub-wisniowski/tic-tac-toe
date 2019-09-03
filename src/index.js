import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const BOARD_SIZE = 3;

function Square(props) {
    console.log(props.isWinner);
    const className = props.isWinner ? "square winner" : "square";
    return (
        <button className={className} onClick={props.onClick}>
            {props.isWinner}
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key={i}
                isWinner={this.props.winnerLine ? this.props.winnerLine.includes(i) : false}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderBoard() {
        let board = [];
        for (let i = 0; i < BOARD_SIZE; i++) {
            let children = [];
            for (let j = 0; j < BOARD_SIZE; j++) {
                children.push(this.renderSquare(i * BOARD_SIZE + j));
            }
            board.push(
                <div className="board-row" key={i}>{children}</div>)
        }
        return board;
    }

    render() {
        return (
            <div>
                {this.renderBoard()}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(BOARD_SIZE * BOARD_SIZE).fill(null),
                position: {row: null, column: null}
            }],
            stepNumber: 0,
            xIsNext: true,
            sortHistAsc: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        const col = i % BOARD_SIZE + 1;
        const row = Math.floor(i / BOARD_SIZE) + 1;

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{squares: squares, position: {row: row, column: col}}]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });
    }

    jumpTo(index) {
        this.setState({
            stepNumber: index,
            xIsNext: index % 2 === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winnerLine = calculateWinner(current.squares);

        let status;

        const moves = history.map((step, move) => {
            const desc =
                move ?
                    "Go to move #" + move + " row:" + step.position.row + " column:" + step.position.column
                    :
                    "Go to game start";
            const className = move === this.state.stepNumber ? 'selected' : null;
            return <li key={move}>
                <button onClick={() => this.jumpTo(move)} className={className}>{desc}</button>
            </li>
        });

        winnerLine ?
            status = "Winner: " + current.squares[calculateWinner(current.squares)[0]]
            :
            status = "Next player: " + (this.state.xIsNext ? 'X' : 'O');

        if(moves.length > BOARD_SIZE * BOARD_SIZE) {
            status = "It's a draw!";
        }

        if (!this.state.sortHistAsc) moves.reverse();

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} winnerLine={winnerLine} onClick={(i) => this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                    <button onClick={() => {
                        this.setState({sortHistAsc: !this.state.sortHistAsc})
                    }}>{this.state.sortHistAsc ? "Sort in descending order" : "Sort in ascending order"}</button>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);

function calculateWinner(squares) {
    for (let i = 1; i < BOARD_SIZE - 1; i++) {
        for (let j = 1; j < BOARD_SIZE - 1; j++) {
            const current_index = BOARD_SIZE * i + j;

            if (squares[current_index]) {
                // check horizontal line
                if (squares[current_index] === squares[current_index - 1]
                    &&
                    squares[current_index] === squares[current_index + 1]) {
                    return [current_index - 1, current_index,  current_index + 1]
                }

                //check vertical line
                if (squares[current_index] === squares[current_index - BOARD_SIZE]
                    &&
                    squares[current_index] === squares[current_index + BOARD_SIZE]) {
                    return [current_index - BOARD_SIZE, current_index, current_index + BOARD_SIZE];
                }

                //check left-top to right-bottom line
                if (squares[current_index] === squares[current_index - BOARD_SIZE - 1]
                    &&
                    squares[current_index] === squares[current_index + BOARD_SIZE + 1]) {
                    return [current_index - BOARD_SIZE - 1, current_index, current_index + BOARD_SIZE +1];
                }

                //check right-top to left-bottom line
                if (squares[current_index] === squares[current_index - BOARD_SIZE + 1]
                    &&
                    squares[current_index] === squares[current_index + BOARD_SIZE - 1]) {
                    return [current_index - BOARD_SIZE + 1, current_index, current_index + BOARD_SIZE - 1];
                }
            }
        }
    }
    return null;
}

