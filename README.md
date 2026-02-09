# Settlers App

This is a simple tool for settlers online game.
For now it only tracks guild members 24h activity.

Install
---
Copy client/settlers_app.js to /tso_portable/userscripts folder.  
Check if it appears in client - Tools/Update  

Install node.js  
Install dependencies:  
- npm install nodemon  
- npm install express  
- npm install cors  

Usage
---
First run a small http server:  
nodemon -e ./index.js  

It should display:  
Settlers app started at port: 3456  

Run settlers_app script in Client/Tools once a day.  
It will send a request from client to our http server and server will store member list in a file in users subfolder.  

In Client a window with text "Saving guild member list" should appear.  
In server's console the following message should appear, just with different timestamp:  
Start writing: users-2026-02-08_211016.json  
File written successfully  

Created a simple UI to show guild members with their daily activity. Open this link in a browser:  
http://localhost:3456/  
(or other port, it will be shown in server's console on startup)  
