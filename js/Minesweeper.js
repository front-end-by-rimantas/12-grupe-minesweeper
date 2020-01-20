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
        this.bombList = [];
        this.canIplay = true;

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
        const boardSize = this.boardSize.columns * this.boardSize.rows;
        this.bombCount = Math.round(this.bombRatio * boardSize);
        // turi buti ne maziau 1
        if ( this.bombCount < 1 ) {
            this.bombCount = 1;
        }
        
        // turi buti ne daugiau (lentosDydis - 1)
        if ( this.bombCount >= boardSize ) {
            this.bombCount = boardSize - 1;
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
            cell.addEventListener('click', (event) => this.openCell(event, i));
        }
    }

    openCell( event, index ) {
        if ( !this.canIplay ) {
            return;
        }

        this.clickCounter++;
        let coord = {
            x: index % this.boardSize.columns,
            y: Math.floor(index / this.boardSize.columns)
        }

        if ( this.clickCounter === 1 ) {
            this.generateBombs( coord );
        }

        this.DOMcells[index].classList.add('open');

        if ( this.bombList.indexOf(index) >= 0 ) {
            this.canIplay = false;
            this.DOMcells[index].classList.add('failure');
        } else {
            let count = 0;
            let searchIndex = 0;
            for ( let x=-1; x<=1; x++ ) {
                for ( let y=-1; y<=1; y++ ) {
                    if ( coord.x+x < 0 ||
                         coord.x+x >= this.boardSize.columns ||
                         coord.y+y < 0 ||
                         coord.y+y >= this.boardSize.rows ) {
                        continue;
                    }
                    searchIndex = coord.x+x + (coord.y+y) * this.boardSize.columns;
                    if ( this.bombList.indexOf(searchIndex) >= 0 ) {
                        count++;
                    }
                }
            }
            // jei aplinkui yra bombu, tai i ta cele irasyti ju kieki
            this.DOMcells[index].textContent = count;
            
            // console.log('- atidarau ir aplinkines celles, kol galiu');

            for ( let x=-1; x<=1; x++ ) {
                for ( let y=-1; y<=1; y++ ) {
                    if ( coord.x+x < 0 ||
                         coord.x+x >= this.boardSize.columns ||
                         coord.y+y < 0 ||
                         coord.y+y >= this.boardSize.rows ) {
                        continue;
                    }
                    searchIndex = coord.x+x + (coord.y+y) * this.boardSize.columns;
                    // ????
                }
            }
        }
    }

    generateBombs( coord ) {
        console.log('- sugeneruoju bombas', coord, this.bombCount);
        const boardSize = this.boardSize.columns * this.boardSize.rows;
        const myCellIndex = coord.x + coord.y * this.boardSize.columns;
        let bombCellIndex = 0;

        for ( let i=0; i<this.bombCount; i++ ) {
            bombCellIndex = Math.floor( Math.random() * boardSize );
            if ( bombCellIndex !== myCellIndex &&
                 this.bombList.indexOf(bombCellIndex) === -1 ) {
                // this.DOMcells[bombCellIndex].textContent = 'B';
                this.DOMcells[bombCellIndex].textContent = '';
                this.bombList.push(bombCellIndex);
            } else {
                i--;
            }
        }

        console.log(this.bombList);
        
    }
}

export default Minesweeper;