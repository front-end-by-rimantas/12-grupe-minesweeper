import LightCar from './LightCar.js';
import Truck from './Truck.js';

const zilParams = {
    name: 'Zil',
    weight: 3500
}
const zil = new Truck(zilParams);
console.log( zil );
console.log( zil.turnOn() );
console.log( zil.turnOn() );
console.log( zil.setColor('blue') );

const opelParams = {
    name: 'Opel',
    doors: 4
}
const opel = new LightCar(opelParams);
console.log( opel );
console.log( opel.turnOn() );
console.log( opel.turnOn() );
console.log( opel.turnOn() );
