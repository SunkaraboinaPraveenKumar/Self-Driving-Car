import Car from "./car.js";
import { NeuralNetwork } from "./network.js";
import Road from "./road.js";
import { Visualizer } from "./visualizer.js";

const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const N=50;
const cars = generateCars(N);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain")
        )
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.1);
        }
    }
}

const traffic = [
    new Car(road.getLaneCenter(0), -100, 30, 50, "DUMMY", 2.5),
    new Car(road.getLaneCenter(1), -300, 30, 50, "DUMMY", 2.5),
    new Car(road.getLaneCenter(2), -500, 30, 50, "DUMMY", 2.5),
    new Car(road.getLaneCenter(0), -700, 30, 50, "DUMMY", 2.5),
    new Car(road.getLaneCenter(1), -900, 30, 50, "DUMMY", 2.5),
    new Car(road.getLaneCenter(2), -1900, 30, 50, "DUMMY", 2.5),
    new Car(road.getLaneCenter(0), -1500, 30, 50, "DUMMY", 2.5),
    new Car(road.getLaneCenter(1), -2500, 30, 50, "DUMMY", 2.5),
    new Car(road.getLaneCenter(2), -3500, 30, 50, "DUMMY", 2.5),
    new Car(road.getLaneCenter(0), -3700, 30, 50, "DUMMY", 2.5),
    new Car(road.getLaneCenter(1), -3900, 30, 50, "DUMMY", 2.5),
    new Car(road.getLaneCenter(2), -4100, 30, 50, "DUMMY", 2.5),
    new Car(road.getLaneCenter(0), -4300, 30, 50, "DUMMY", 2.5),
    new Car(road.getLaneCenter(1), -4500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -4700, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -4900, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -5100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -5300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -5500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -5700, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -5900, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -6100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -6300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -6500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -6700, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -6900, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -7100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -8700, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -8900, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -9100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -9300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -9500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -9700, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -9900, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -10100, 30, 50, "DUMMY",2)
];



animate();

export function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain)
    );
}
export function discard(){
    localStorage.removeItem("bestBrain");
}
function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"))
    }
    return cars;
}

function animate(time) {
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);   
    }
    bestCar=cars.find(
        c=>c.y==Math.min(...cars.map(c=>c.y))
    )
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;
    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);
    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"red");
    }
    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx,"blue");
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,"blue",true);
    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}

window.save=save;
window.discard=discard;