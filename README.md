# Avanti
Avanti eases the way of deploying new virual hosts on a (currently we only support Ubuntu 16.04 😋) machine.

The goal is to have an [FastCGI Pool Manager (**FPM**)](https://secure.php.net/manual/en/install.fpm.php) to controll all domains.

Domains get assigned a pool of PHP processes that they can spawn.

## Requirements
**For now** you need to add the _multiverse_ repository because of **libapache2-mod-fastcgi**

#### Update server
``` bash
apt update
apt dist-upgrade
```

#### Install required packages
``` bash
# install apt repositories
curl -sSL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo add-apt-repository -y ppa:ondrej/php
sudo add-apt-repository -y ppa:certbot/certbot
sudo apt-get -y update

# install different php versions
for VERSION in "5.6" "7.0" "7.1"; do
    sudo apt-get -y install \
    php$VERSION php$VERSION-xml php$VERSION-curl \
    php$VERSION-soap php$VERSION-mysql php$VERSION-fpm
done

# install apache
sudo apt-get -y install apache2 libapache2-mod-fastcgi cronolog

# install letsencrypt
sudo apt-get -y install python-certbot-apache

# install nodejs and npm
sudo apt-get -y install build-essential nodejs

# install dev tools
sudo npm install -g gulp knex
sudo apt-get -y install sqlite3

# enable proxy
sudo a2enmod rewrite proxy proxy_fcgi
sudo service apache2 restart

# cleanup apt packages
sudo apt-get -y autoremove
```

## Installation
#### Using npm
``` bash
sudo npm -g install avanti-core avanti-cli
```

## Commands
Avanti needs to be executed as **root** user
#### help
Get an overview of the available commands
``` bash
avanti --help
```
