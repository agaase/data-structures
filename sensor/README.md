#Arduino Sensor Assignment

## How do I use my Computer?

With this web application I try to analyse how I use computer is used physically by collecting data using an [Adafruit Ultimate GPS Logger Shield](https://www.adafruit.com/product/1272). The front end of the application shows change of different parameters like altitude, latitude, longitude and angle for different types of sessions when Iam using my computer.

The application can be seen [here](http://35.165.216.202:8383/)

### How does it work?
The application shows the timeline of a session for all the parameters. The data is recorded using the Arduino GPS sensor which I taped up to my laptop lid while Iam using it. ![PREVIEW](https://agaase.github.io/data-structures/sensor/arduino.jpg)


For example, If I studied for 30 minutes the graph will show the change in activity of altitude, lat, long and angle. Similarly there are many other sessions like this that are shown. Each session has a name which is basically a coded name with different parts. For e.g a session with name `12_18_2016_2234_at_home_watching_bed` means - 
 1. `12_18_2016_2234` - The start time of the session. 10:34pm, 12 Dec, 2016
 2. `at_home` - Location of activity
 3. `watching` - activity type
 4. `bed` - the exact place where laptop is placed
 
 There is also a session called `correction` which is basically recorded with my computer in an idle position with no disturbances. This is to check for any kind of invalid data produced which I can account for.

### Project structure
This is a node project with the actual package management being done by npm. As such if you are familiar with any node project structure it should feel similar. 

### Codebase

 - `package.json` - the package file where all node dependencies are list
 - `index.js` - Server code where the api requests are handle. Right now, it has two `GET` requests to handle
   - `/sessions` - list of all unique sessions
   - `/session/<sessionname>` - individual session data
 - `dbop.js` - This is developed as a custom node module which handles are data related operations. It fetches the data from postgres, customizes and sends it back to whoever calls for it.
 - `public/` - folder where all the static files (html,css, js) reside.
   - `index.html` - the root html for the web application.
   -  `css/` - all stylesheets
      - `main.sccs` - css written usings sass framework
      - `main.css` - sass to css converted file
   - `js` 
      - main.js - main javascript file for front end
   - `images` - images folder
