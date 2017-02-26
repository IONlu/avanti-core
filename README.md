# Avanti
Avanti eases the way of deploying new virual hosts on a (currently we only support Ubuntu 16.04 😋) machine.

The goal is to have an [FastCGI Pool Manager (**FPM**)](https://secure.php.net/manual/en/install.fpm.php) to controll all domains.

Domains get assigned a pool of PHP processes that they can spawn.

## development

### Vagrant box

```
cd /path/to/avanti/repo
vagrant up
vagrant ssh
```

## Requirements
**For now** you need to add the _multiverse_ repository because of **libapache2-mod-fastcgi**

#### Update server
```
apt update
apt dist-upgrade
```

#### Install required packages
```
apt install apache2 cronolog letsencrypt sqlite3
apt install php php-fpm libapache2-mod-fastcgi
apt install nodejs nodejs-legacy npm
npm install -g node-gyp
a2enmod rewrite proxy proxy_fcgi
```

## Installation
#### Using npm
```
sudo npm -g install avanti-core
```

## Commands
Avanti needs to be executed as **root** user
#### help
Get an overview of the available commands
```
avanti --help
```
