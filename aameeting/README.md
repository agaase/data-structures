#AA Assignment
This is a web application which shows all the meetings of [alcohol anonymous](http://meetings.nyintergroup.org/) on a user friendly interface. 

The application can be seen [here](http://35.165.216.202:8181/)

### How does it work?
The project basically shows all the meetings for the current day after the current time and till 4am next day. The day can be changed by using the drop-down 

### Project structure
This is a node project with the actual package management being done by npm. As such if you are familiar with any node project structure it should feed similar. 

### Codebase

 - `package.json` - the package file where all node dependencies are list
 - `index.js` - Server code where the api requests are handle. Right now, it just handles a single request is /meetings.
 - `aadata.js` - This is developed as a custom node module which handles are data related operations. It fetches the data from mongodb, customizes and sends it back to whoever calls for it.
 - `public/` - folder where all the static files (html,css, js) reside.
   - `index.html` - the root html for the web application.
   -  `css/` - all stylesheets
      - `main.sccs` - css written usings sass framework
      - `main.css` - sass to css converted file
   - `js` 
      - main.js - main javascript file for front end
   - `images` - images folder
   
 

### API end point
http://35.163.164.222:8181/
