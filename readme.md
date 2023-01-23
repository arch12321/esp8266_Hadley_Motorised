# Intro

***PLEASE NOTE MAIN VERSIONS OF MODELS AND CODE EXIST ON GITHUB ALONG WITH THE CODE AND WILL DO SO UNTIL PRINTABLES SUPPORTS PULL REQUESTS***

Welcome to my update to the metric hadley to add motorised control.  Please note that as the code (initialy VERY basic) evolves it will live on GitHub where folk who are way smarter and talented than me hopefully will make it better.  Similarly the models will exist on GitHub so that folk can improve and merge change their improvements to a single place so that there is a hopefully single best version (hopefully) and not many forks.

Once build, this will allow you to control your telescope from a webpage.   In due course the intent is to improve the code so that you can select targets and the telescope automatically moves to point at it, and will track it's position over time.  This requires a few more updates, and some coding to make work, but it's very possible.

With this, I recommend replacing the all plastic bearings with ‘proper’ bearings, this gives much smoother movement.  While it will work without this, the movement can be slightly jerky which would be a problem for small/slow movements when tracking objects in the sky.  

Anyway - firstly - the readme on github is the latest doc - pls see that for more details and code etc.


# Parts list

For hardware that needs to be purchased, you will need:

* ESP8266 Microcontroller (I used a D1 mini clone) - something like https://www.amazon.co.uk/dp/B08BTH77F3 (note, in theory you could use an ESP32, the code should be compatible, however I haven't tested it with an ESP32, so it almost certainly won't work without some bug fixing first)
* Lazy Susan Bearing - I used this one (140mm), and all the holes etc. are based this - I have no idea how standard they are - https://www.amazon.co.uk/gp/product/B00TQT9U7U/ 
* A4988 stepper motor drivers (https://www.amazon.co.uk/gp/product/B07MXXL2KW/) note - you can use the standard ULN2003 drivers, you will just need to make a couple of code tweaks and will get less torque.  The changes are commented out in the source code.  NB - I got HR4988 chips, not A4988 - these seem to work fine and I think are just cheap chinese rip offs of the real thing, so I wouldn't expect huge longevity, but so far they seem to work.
* 2 x 28BYJ-48 5V stepper motors ( https://www.amazon.co.uk/dp/B07PPKS7GZ/ ) - I had some lying around I think I got from aliexpress for about $1 each, they seem pretty universal though. Just get the 5V version
* An electrolytic capacitor (at least 100uF and >12V).  I think mine is 1000uF, but that's too big, it's just one I had a drawer full of
* 5V → 12V boost converter (10V would prob be OK too).  I used this https://www.amazon.co.uk/gp/product/B08M42BT3G/ but anything that can 0.4 A at 12V should be plenty (I measure about 95mA per motor, I have no idea how much the stepper controllers use, but they get hot..so some..) so I would estimate a total of 400mA capacity should give plenty of headroom
* 2 x 6700 bearings (2RS, ZZ - doesn't matter)
* Some solder, basic soldering skills
* A computer to flash the ESP8266 (i.e to load the computer program onto the ESP8266 microcontroller)
* USB battery pack and micro-USB wire for power
* 6mm wide closed loop GT2 timing belt - I used a 500mm one, but I think a 400mm would be OK
* 8mm M4 screws x4 (I think)
* 4 x M4 nuts
* 12mm M4 screws x16 (I think - You can get away with 8mm screws for these if needed - 8 of these hold the modified bearings (large semicircular ish things) in place - I ran out and used 8mm screws here - they are OK but 12mm better)
* 8mm M3 screws x6 (to secure the motors and bearings)
* 6mm M3 Heat set inserts x6
* 6mm M4 Heat set inserts x 12 (could use 8 here - 8 of these these connect the metric frame to the rotating base, I used 4 due to me being tighter than 2 layers of paint, there are holes for 8).  The other 4 are for the below screws.
* 16mm M4 x4 (these go through the lazy susan from the bottom into heat set inserts to hold the rotation base (the thing that deliberately looks a bit like a ship's helm) to the bearing)
* 10mm M4 Heat set inserts (could use a different size) x4.  These are to hold the bearing and ring gear to the optional base.
* Countersunk 20mm M4 screws - these connect the lazy susan to the optional base


# Circuit design

This is pretty straight forward, I just used some stripboard (approx 60mm x 60mm in size) and soldered together some breakout boards.  I wanted to have it so I could power the whole thing from a USB power bank as turny things connected to wires leads to tangles, so having an isolated power source I could put inside the turny thing seemed sensible and to provide the 5V input to drive the esp8266 board.  I therefore used a boost converter to get the required 12v ish to drive the motor (more on why I need 12V to drive 5V motors below) all powered from a 5V input.

While I haven't actually drawn the circuit properly - I have put some photos of the way I did it.  Note you probably could power this direct from the ESP8266 micro USB, I just just the separate board to put the power input in a different place.

![photo of circuit1](/docs/images/circuit1.jpg?raw=true)
![photo of circuit2](/docs/images/circuit2.jpg?raw=true)
![photo of backofcircuit](docs/images/backofcircuit.jpg?raw=true)

# Stepper Driver Setup

You can use the ULN2003 driver for the 28BYJ-48 stepper motor with no modifications in unipolar mode, however various folks have noted this gives a torque of around 300-380g.cm of torque - this can be roughly doubled to 800g.cm by moving to bipolar operation (which as you move from energising 1/4 of the coils at one time in unipolar mode to energising 1/2 the coils at one time kinda makes empirical sense to me).  From my experiements, moving the steppers to bipolar operation did indeed improve performance, and while the steppers in unipolar/ULN2003 operation do move the telescope, more torque is more reliable, less likely to miss steps, and as Mr Clarkson might say, more power = better.  Given the simplicity of the modification and low cost of A4988 boards (mine are actually HR4988 boards due to dubious sales tactics calling them A4988 compatible (I missed the compatible bit) but they work fine) I decided to go for bipolar operation in this.  See https://ardufocus.com/howto/28byj-48-bipolar-hw-mod/ for details on how to do this.

From the photos you will see I also removed the red wire and replaced the 5 pin JST connector with a 4 pin and sleeved the cables with white PET sleeving.  This is entirely optional and I did it both to simplify the connections to the stepper driver board, and also to assuage some of my OCD by making it look tidier overall.  The remaining niggle is I only had white sleeving, and everything else is black, which annoys me, but I think I can live with it...I think...In any case, shoudl you decide to replace the JST connector, I recommend cutting the 5 pin plastic JST housing off the pins rather than either trying to remove the pins individually or cutting the wires and crimping on new connectors.  Having tried all 3 approaches, destroying the white plastic JST housing I found far and away the quickest and easiest approach.

The current limit of the 125mV a4988 potentiometer - gives approx 95mA measured at full step.  Equates to current limit of (1/0.7)*95 = 136mA limit as full step current is limited to 70% of max.

Note need at LEAST 47uF (I would use a min of 100uF) electrolytic capacitor to protect a4988 board from LSC voltage spikes. See https://www.pololu.com/docs/0J16/all for more details on this fascinating topic.  TL:DR? Do not use a ceramic capacitor.

# Mechanical Gearing

Note the conversion of degrees to number of steps is done in the JS file.  This is done to decouple essentially config from the ESP8266 firmware.  In due course, the intent is separate the HTML/JS/CSS files from hosting on the ESP8266 to decouple this and accelerate development, though frankly OTA updates are not hard so whether this ever gets done is low priority, especially as it's possible to update the filesystem and code over the air (OTA) over a local network.

## Horizontal
Ring gear = 82 teeth<br>
Drive gear = 10 teeth<br>
Stepper motor =-= 32*63.68395 steps per revolution = 2037.8864<br>

Therefore full revolution = (82/10)*2037.8864 = 16,710.66848 steps per 360 degrees<br>
And 1 degree = 46.41852355555556 steps<br>
Or 1 step = 0.0215431238092517 degrees<br>

https://randomnerdtutorials.com/stepper-motor-esp32-websocket/<br>

## Vertical
Big wheel 150 teeth upped to 230<br>
Drive wheel 20 teeth - (small version 12)<br>

Therefore full revolution = (230/20)*2037.8864 = 16,710.66848 steps per 360 degrees<br>
And 1 degree = 65.0991488888889 steps<br>
Or 1 step = 0.015361183933553 degrees<br>

## Summary

| Item | Turntable | Elevation |
| ---- | ---- | ---- |
| Drive Gear | 10 | 20 |
| Pulley | 82 | 230 |
| Mechanical Advantage | 8.2 | 11.5 |
| Steps per revolution (motor) | 2037.8864 | 2037.8864 |
| Steps per revolution (telescope) | 16710.66848 | 23435.6936 |
| No. of steps to move 1 degree | 46.41852356 | 65.09914889 |
| No of degrees 1 step moves | 0.021543124 | 0.015361184 |

# Flashing ESP8266 (i.e. putting the code onto the ESP8266)

If you are not familiar with flashing microcontroller, I highly recommend the Random Nerds tutorials.  This repo uses VS Code running PlatformIO, and I recommend this is what you use to flash - there is a full guide here: https://randomnerdtutorials.com/vs-code-platformio-ide-esp32-esp8266-arduino/ on how to set everything up - this can be daunting at first, but if you follow the guide, you should be fine.  Once you have VS Code setup and PlatformIO installed in VS Code just follow the steps below:

1. Clone the github repo or download the code and unzip to folder.  You should now have a folder with all the code in multiple folders and few files in the top level directory (e.g. readme.md, platformio.ini and some others)
2. Open VS Code, go to File --> Open Folder and find the folder you unzipped the files into (this folder must contain platformio.ini at the top level within it - not another folder with the platformio.ini in that)
3. Plug your ESP8266 into computer (if using an ESP32, update the platformio.ini file with your board, platform, and remove the filesystem line as you'll use SPIFFS not LITTLEFS)
4. Click the alien head in the left hand menu (platformio icon) and click Platform --> Erase Flash (just to be sure) and wait for a success message in the terminal.  Should take 15-20 seconds ish.
5. In theame menu, click Platform --> Build Filesystem Image and wait for a success message in the terminal. Should take a few seconds.
6. In the same menu, click Platform --> Upload Filesystem Image and wait for a success message in the terminal.  These steps, wipe the flash memory, then uploads the HTML, CSS and JS files in the "data" folder to the microcontroller.  Should take 10-15 seconds.
7. Click the right pointing arrow at the bottom of your screen (or click the alien head in the left hand menu --> General --> upload).  This will compile the code and then upload the binary to your microcontroller, then reset it.  This should take around 40-50 seconds.  If you now click the 2 pronged plug thing at the bottom of your screen you should get the serial messages from the microcontroller.
8. With your phone/laptop/computer/tablet open your wifi settings, and connect to the HadleyTelescope wifi network
9. If not autodirected, go to the sign-in page (192.168.4.1 by default) and click on "Configuration".  In the fist SSID box, put your wifi network name and the password in the Password field. Leave the rest blank or with default values.  Click "SAVE"
10. If you clicked the 2 pronged plug icon thing at the bottom of your screen (serial monitor terminal) you should then see a bunch more info and the local IP of your microcontroller.  If not, you can probably find it with the hostname of [http://hadleyTelescope](http://hadleyTelescope) or in your router's DHCP tables.  If you didn't click the 2 pronged plug - you can do so now, and click the reset button on your microcontroller (or unplug and plug back it back in) and you can get the local IP address.