class Minesweeper {
    constructor( data ) {
        this.target = data.target;
        this.DOM = null;
        this.DOMcounter = null;
        this.DOMclock = null;
        this.DOMgameStatus = null;
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
        this.openedCellsList = [];
        this.canIplay = true;
        this.clock = null;
        this.clockTime = 0;

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
            <div class="header">
                <div id="bombs" class="counter"></div>
                <div class="btn">:)</div>
                <div id="clock" class="counter">000</div>
            </div>
            <div class="board">BOARD</div>`;

        const DOMstyle = getComputedStyle(this.DOM);
        this.DOMsize = {
            width: parseInt(DOMstyle.width),
            height: parseInt(DOMstyle.height)
        }
        
        this.DOMcounter = this.DOM.querySelector('#bombs');
        this.DOMclock = this.DOM.querySelector('#clock');
        this.DOMgameStatus = this.DOM.querySelector('.btn');
        
        this.validateBoardSize();
        this.updateBombCount();
        this.updateGameSize();
        this.renderCells();

        this.DOMcounter.textContent = this.bombCount;

        this.DOMgameStatus.addEventListener('click', () => this.resetGame());
    }

    resetGame() {
        this.DOM = null;
        this.DOMcounter = null;
        this.DOMclock = null;
        this.DOMgameStatus = null;
        this.bombList = [];
        this.openedCellsList = [];
        this.canIplay = true;

        this.clickCounter = 0;

        this.init();
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
            cell.addEventListener('click', () => this.openCell(i));
            cell.addEventListener('contextmenu', (ev) => this.toggleFlag(ev, i));
        }
    }

    toggleFlag( ev, index ) {
        ev.preventDefault();
        this.DOMcells[index].classList.toggle('flag');
    }

    openCell( index ) {
        if ( !this.canIplay ||
             this.DOMcells[index].classList.contains('flag') ) {
            return;
        }

        this.clickCounter++;
        let coord = {
            x: index % this.boardSize.columns,
            y: Math.floor(index / this.boardSize.columns)
        }

        if ( this.clickCounter === 1 ) {
            this.generateBombs( coord );

            this.clock = setInterval(() => {
                this.clockTime++;
                this.DOMclock.textContent = this.clockTime;
            }, 1000);
        }

        this.DOMcells[index].classList.add('open');
        this.openedCellsList.push(index);

        // patikriname ar laimejome
        if ( this.openedCellsList.length + this.bombCount === this.boardSize.columns * this.boardSize.rows ) {
            this.DOMgameStatus.textContent = 'B)';
            clearInterval(this.clock);
        }

        if ( this.bombList.indexOf(index) >= 0 ) {
            this.canIplay = false;
            this.DOMcells[index].classList.add('failure');
            this.DOMgameStatus.textContent = ':(';
            clearInterval(this.clock);
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
            this.DOMcells[index].textContent = count > 0 ? count : '';
            
            // atidarau ir aplinkines celles, kol galiu
            if ( count === 0 ) {
                for ( let x=-1; x<=1; x++ ) {
                    for ( let y=-1; y<=1; y++ ) {
                        searchIndex = coord.x+x + (coord.y+y) * this.boardSize.columns;
                        if ( coord.x+x < 0 ||
                             coord.x+x >= this.boardSize.columns ||
                             coord.y+y < 0 ||
                             coord.y+y >= this.boardSize.rows ||
                             this.openedCellsList.indexOf(searchIndex) >= 0 ) {
                            continue;
                        }
                        this.openCell( searchIndex );
                    }
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