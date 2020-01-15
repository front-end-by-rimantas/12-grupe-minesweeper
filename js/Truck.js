import Car from './Car.js';

class Truck extends Car {
    constructor( data ) {
        super( data.name, data.doors );
        this.trailer = data.weight;
    }
}

export default Truck;