"# Settlers App" 

This is a simple tool for settlers online game.
For now it only tracks guild members 24h activity.

Install
---
Copy client/settlers_app.js to /tso_portable/userscripts folder.
Check if it appears in client - Tools/Update

Usage
---
First run a small http server:
nodemon -e ./index.js

Run settlers_app script in Client/Tools once a day. It will send to our http server a request from client and server will store member list in a file in users subfolder.

Created a simple UI to show guild members with their daily activity. Open this link in a browser:
http://localhost:3456/
(or other port, it will be shown in server's console on startup)
