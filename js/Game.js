import Minesweeper from './Minesweeper.js';

const data = {
    target: '#game',
    boardSize: {
        columns: 30,
        rows: 16
    },
    bombsRatio: 0.01
}
const game = new Minesweeper(data);
