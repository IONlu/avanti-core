# Avanti
Avanti eases the way of deploying new virual hosts on a (currently we only support Ubuntu 16.04 😋) machine.

The goal is to have an [FastCGI Pool Manager (**FPM**)](https://secure.php.net/manual/en/install.fpm.php) to controll all domains.

Domains get assigned a pool of PHP processes that they can spawn.

## Requirements
**For now** you need to add the _multiverse_ repository because of **libapache2-mod-fastcgi**

#### Update server
```
apt update
apt dist-upgrade
```

#### Install required packages
```
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo add-apt-repository -y ppa:ondrej/php
sudo add-apt-repository -y ppa:certbot/certbot
sudo apt-get -y update

# install different php versions
sudo apt-get -y install php5.6 php5.6-xml php5.6-curl php5.6-soap php5.6-mysql php5.6-fpm
sudo apt-get -y install php7.0 php7.0-xml php7.0-curl php7.0-soap php7.0-mysql php7.0-fpm
sudo apt-get -y install php7.1 php7.1-xml php7.1-curl php7.1-soap php7.1-mysql php7.1-fpm

# install apache
sudo apt-get -y install apache2 libapache2-mod-fastcgi cronolog

# install letsencrypt
sudo apt-get -y install python-certbot-apache

# install nodejs and npm
sudo apt-get -y install build-essential nodejs
sudo npm -g install npm@4

# enable proxy
sudo a2enmod rewrite proxy proxy_fcgi
sudo service apache2 restart
```

## Installation
#### Using npm
```
sudo npm -g install avanti-core avanti-cli
```

## Commands
Avanti needs to be executed as **root** user
#### help
Get an overview of the available commands
```
avanti --help
```
