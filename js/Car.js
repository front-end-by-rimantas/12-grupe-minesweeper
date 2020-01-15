class Car {
    constructor( marke, doors, color ) {
        this.marke = marke;
        this.doorsCount = doors || 2;
        this.engineOn = false;
        this.color = color || 'grey';
    }

    turnOn() {
        if ( this.engineOn ) {
            console.log(`Masina ${this.marke} jau ijungta!`);
        } else {
            this.engineOn = true;
        }
    }

    setColor( newColor ) {
        return this.color = newColor;
    }
}

export default Car;