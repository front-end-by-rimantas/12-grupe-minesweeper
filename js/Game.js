import Minesweeper from './Minesweeper.js';

const data = {
    target: '#game',
    boardSize: {
        columns: 10,
        rows: 10
    },
    bombsRatio: 0.15
}
const game = new Minesweeper(data);
