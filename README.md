# INSTALL TO RASPBERRY PI ZERO 2W (Debian 11)
> Tested on Debian 11
  > - OS: Raspbian GNU/Linux 11 (bullseye) armv7l 
  > - Host: Raspberry Pi Zero 2 W Rev 1.0 
  > - Kernel: 5.15.32-v7+ 
  > - CPU: BCM2835 (4) @ 1.000GHz 

## Requirements

- [NVM](#nvm-install)
- NODE.JS >= 16.17.1

## Install and build project

### Install dependencies

```sh
yarn install --no-lockfile
```

### CRONTAB

Find out the location of the binaries
```sh
which node && which sqlite3
```
```sh
crontab -e
```
Add the following lines to the end:

```text
@reboot sleep 30 && /home/<$USER>/.nvm/versions/node/v16.17.1/bin/node /home/<$USER>/Documents/www/weather-express-arduino/app.js &
0 */6 * * * /usr/bin/sqlite3 /home/<$USER>/<DB_NAME>.sqlite3 .dump > /home/<$USER>/<DB_NAME>_dump.sql
```

- "@reboot sleep 30" // 30 seconds after the system starts, run the project
- "0 */6 * * *" - // Create a database backup every 6 hours

### Systemd service

```
[Unit]
Description=Weather Application Service
After=network.target

[Service]
WorkingDirectory=/home/<$USER>/www/weather-express-arduino
ExecStart=/home/<$USER>/.nvm/versions/node/v16.17.1/bin/node app.js
Restart=on-failure
User=<$USER>
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

## NVM install

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
nvm install 16
nvm alias default 16
node --version
npm i -g yarn sequelize-cli
```

## Additional dependencies

To perform database backups
```sh
sudo apt install make cmake gcc sqlite3
```

## NGINX configuration

If you plan to run other node.js applications using NGINX. Then for such applications, there will be approximately the following configuration:

```text
server {
  listen 80;
  listen [::]:80;
  server_name example.com www.example.com;
  root /var/www/your_project;
  gzip on;

  location / {
    try_files $uri @express;
  }

  location @express {
    proxy_pass http://localhost:3000;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
```

---

> **P.S.:** When run via "crontab", the database is created in the user's home folder
