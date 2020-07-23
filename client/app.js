// heroku, change to url connecting to
var socket = require("socket.io-client")("https://footfalldemo2.herokuapp.com");
//local host 
//var socket = require("socket.io-client")("http://localhost:3000"); //change from 3000 if errors in local testing 
const Gpio = require('pigpio').Gpio; //library for US module

var count = 0; //initalise person count at zero

// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
const MICROSECONDS_PER_CM = 1e6/34321;
//set Ultrasonic module vars
const triggerUS1 = new Gpio(23, {mode: Gpio.OUTPUT});
const echoUS1 = new Gpio(24, {mode: Gpio.INPUT, alert: true});
const triggerUS2 = new Gpio(17, {mode: Gpio.OUTPUT});
const echoUS2 = new Gpio(27, {mode: Gpio.INPUT, alert: true});
//set distance across entrance so if person walks past then triggers a count increase message 
const distmin = 12; //slightly less than test obstacle distance for tolerance ( test distance is around 14.9-15.3cm)
triggerUS1.digitalWrite(0); // Make sure trigger is low
triggerUS2.digitalWrite(0); // Make sure trigger is low


//this is used for qol when program ends, turn off US modules
process.on("SIGINT", function(){
  triggerUS1.unexport();//free resources
  echoUS1.unexport();
  triggerUS2.unexport();//free resources
  echoUS2.unexport();
  triggerUS1.digitalWrite(0, function(){
    Gpio.destroy(function(){
      process.exit();
    });
  });
  triggerUS2.digitalWrite(0, function(){
    Gpio.destroy(function(){
      process.exit();
    });
  });
});

const watchUS = () => {
  let startTick;

  echoUS1.on('alert', (level, tick) => {
    
    if (level == 1) {
      startTick = tick;
    } else {
      const endTick = tick;
      const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
      const dist = diff / 2 / MICROSECONDS_PER_CM;
      console.log(dist);
        if(dist <= distmin){
            count++;
            console.log("person entered. Total : ", count);
            socket.emit("counter", count); //pass count to server each time
        } else{
            return;
        }
      
    }
  });

  let startTick2;

  echoUS2.on('alert', (level2, tick2) => {
    
    if (level2 == 1) {
      startTick2 = tick2;
    } else {
      const endTick2 = tick2;
      const diff2 = (endTick2 >> 0) - (startTick2 >> 0); // Unsigned 32 bit arithmetic
      const dist2 = diff2 / 2 / MICROSECONDS_PER_CM;
      console.log(dist2);
        if(dist2 <= distmin){
            count--;
            console.log("person left. Total : ", count);
            socket.emit("counter", count); //pass count to server each time
        } else{
            return;
        }
      
    }
  });
};

//connect to server
socket.on("connect", function () {
  console.log("Connected to server");

  watchUS(); //start function to measure distance of US1

// Trigger a 10ms pulse once per second for each US
setInterval(() => {
  triggerUS1.trigger(10, 1); // Set trigger high for 10 microseconds
  triggerUS2.trigger(10, 1); // Set trigger high for 10 microseconds
}, 1000); // 1 second interval

});

