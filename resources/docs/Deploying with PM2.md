# Deploying with PM2
## Installation
The installation of PM2 is very simple when done through NPM. Ensure that all commands are run as root using either the `sudo` command or by logging in to root with `sudo su -`.
```
npm install -g pm2
```
## Startup
PM2 will automatically restart a script if it crashes. To start the project, ensure that you are located in the `/backend` directory of this project. If not, `cd backend`. Next up, ensure you have the `ecosystem.config.js` file in your working directory. If not, be sure to `git pull` the latest version of this repository. Finally, run the `pm2` command:
```
pm2 start ecosystem.config.js
```
## Monitoring
PM2 makes monitoring the server easy with the following command:
```
pm2 monit
```
You should see on the left-hand side a list of server processes which are currently running. As we are only using pm2 for one project, there will only be one option. To exit the monitor view, press `Ctrl+C`. Note that this will **NOT** stop the server.

Additionally the servers which are currently running can be listed with the following command:
```
pm2 list
```
## Shutdown
To shutdown the server, use the following command:
```
pm2 stop ecosystem.config.js
```
