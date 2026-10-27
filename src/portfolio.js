function scrollUp() {

}
function scrollDown() {

}

function left() {

}
function right() {

}

const PINBALL_PROJECT = (
    "Embedded Systems Pinball Project",
    "Proposal\n" +
    "A complex pinball machine utilizing almost every skill I have learned through-out my course work.\n"+
    "The final pinball machine will utilize a STM32 board and have the following play features:\n"+
    "Solenoid Devices\n" +
    "- A Single Flipper\n" + 
    "- A Single Catapult\n" + 
    "- A Single Popbumper\n"+
    "\n"+
    "Servo Devices\n"+
    "A Single Dropdown Target (2 servos)\n" + 
    "A Ball Loader Mech\n" +
    "\n"+
    "Lights and Effects" + 
    "WS2811 LED Array for Playfield Lights" + 
    "Serial chain of Dot Matrix Displays" + 
    "External Audio chips + Speakers (Placeholders)" +
    "Additional LEDs (Flashers/ Status Bar) driven by circuit level logic" + 
    "\n"+
    "Sensors and User Interface"+
    "Magnetic Biased Hall Effect Sensors"+
    "Contact Targets"+
    "Tilt Bob"+
    "Buttons"+
    "Coin Slot Mechanism\n"+
    "\n"+
    "Progress"+
    "Arduino Prototype Proof Of Concept Complete\n" +
    "Completed implimentation of hall effect sensors utilizing comparators, a priority encoder, and Logical Circuitry to drive local effect LEDs\n"+
    "Completed API for calling Audio/LED effects from ESP32 controller from main board\n"+
    "Completed State Machine logic for segmenting and controlling LED array\n"+
    "Completed Base game logic, Launch Ball, Ball Drained, Multiball, Full base game cycle\n"+
    "\n"+
    "TODO\n"+
    "Redesign Audio Mixing for simultaneous Sound Effects and Background Music\n"+
    "Redesign a nicer Web UI for configuration and debugging/Log access\n"+
    "Design implimentation of PopBumper"
    

);