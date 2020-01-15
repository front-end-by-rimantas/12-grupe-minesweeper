import Car from './Car.js';

function suma(a) {return a+5}

class LightCar extends Car {
    constructor( data ) {
        super( data.name, suma(data.doors) );
    }
}

export default LightCar;