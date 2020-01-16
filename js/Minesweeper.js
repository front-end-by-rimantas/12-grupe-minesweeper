class Minesweeper {
    constructor( data ) {
        this.target = data.target;
        this.DOM = null;
        this.DOMsize = {
            width: 0,
            height: 0
        }
        this.DOMboardSize = {
            width: 0,
            height: 0
        }
        this.cellSize = {
            width: 20,
            height: 20
        }
        this.boardSize = {
            columns: data.boardSize && data.boardSize.columns || 10,
            rows: data.boardSize && data.boardSize.rows || 10
        }
        this.bombRatio = data.bombsRatio || 0.1;
        this.bombCount = 1;

        this.clickCounter = 0;

        this.init();
    }

    init() {
        const DOM = document.querySelector(this.target);
        if ( !DOM ) {
            throw 'Norint sugeneruoti zaidima, reikia nurodyti selectoriu, kuris rastu realiai egzistuojanti elementa.';
        }
        this.DOM = DOM;
        this.DOM.classList.add('minesweeper');

        this.DOM.innerHTML = `
            <div class="header">HEADER</div>
            <div class="board">BOARD</div>`;

        const DOMstyle = getComputedStyle(this.DOM);
        this.DOMsize = {
            width: parseInt(DOMstyle.width),
            height: parseInt(DOMstyle.height)
        }
        
        this.validateBoardSize();
        this.updateBombCount();
        this.updateGameSize();
        this.renderCells();

        console.log(this);
    }

    validateBoardSize() {
        this.DOMboard = this.DOM.querySelector('.board');
        const DOMboardStyle = getComputedStyle(this.DOMboard);
        this.DOMboardSize = {
            width: parseInt(DOMboardStyle.width),
            height: parseInt(DOMboardStyle.height)
        }

        // patikriname ar tilps norimas kiekis celiu, jei ne - perrasome i max kieki
        const maxCellPerRow = Math.floor(this.DOMboardSize.width / this.cellSize.width);
        const maxCellPerColumn = Math.floor(this.DOMboardSize.height / this.cellSize.height);
        
        if ( maxCellPerRow < this.boardSize.columns ) {
            this.boardSize.columns = maxCellPerRow;
        }
        if ( maxCellPerColumn < this.boardSize.rows ) {
            this.boardSize.rows = maxCellPerColumn;
        }
    }

    updateBombCount() {
        this.bombCount = Math.round(this.bombRatio * this.boardSize.columns * this.boardSize.rows);
        // turi buti ne maziau 1
        if ( this.bombCount < 1 ) {
            this.bombCount = 1;
        }
        
        // turi buti ne daugiau (lentosDydis - 1)
        if ( this.bombCount >= this.boardSize.columns * this.boardSize.rows ) {
            this.bombCount = this.boardSize.columns * this.boardSize.rows - 1;
        }

    }

    updateGameSize() {
        const boardDifHeight = this.DOMboardSize.height - this.cellSize.height * this.boardSize.rows;
        const boardDifWidth = this.DOMboardSize.width - this.cellSize.width * this.boardSize.columns;
        
        // susitvarkome su auksciais
        this.DOMboard.style.height = this.DOMboardSize.height - boardDifHeight + 'px';
        this.DOM.style.height = this.DOMsize.height - boardDifHeight + 'px';

        // susitvarkome su plociais
        this.DOMboard.style.width = this.DOMboardSize.width - boardDifWidth + 'px';
        this.DOM.style.width = this.DOMsize.width - boardDifWidth + 'px';
    }

    renderCells() {
        let HTML = '';
        const size = this.boardSize.columns * this.boardSize.rows;

        for ( let i=0; i<size; i++ ) {
            HTML += `<div class="cell"></div>`;
        }
        this.DOMboard.innerHTML = HTML;

        this.DOMcells = this.DOMboard.querySelectorAll('.cell');
        for ( let i=0; i<size; i++ ) {
            const cell = this.DOMcells[i];
            cell.addEventListener('click', (event) => {
                return this.openCell(event);
            });
        }
    }

    openCell( event ) {
        this.clickCounter++;

        console.log('- issiaiskinu paspaustos celles koordinates');

        // console.log('cell click...');
        if ( this.clickCounter === 1 ) {
            console.log('- sugeneruoju bombas');
        }

        console.log('- atidarau paspausta celle');
        console.log('tikrinu:');
            console.log('- jei uzsiroviau ant bombos - FINNITO');
            console.log('- atidarau ir aplinkines celles, kol galiu');
    }
}

export default Minesweeper;