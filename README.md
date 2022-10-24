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

---

> **P.S.:** When run via "crontab", the database is created in the user's home folder
