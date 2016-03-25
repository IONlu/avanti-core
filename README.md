# vhost-manager

Install packages
----------------
```
apt update
apt install apache2 php7.0 php7.0-fpm libapache2-mod-fastcgi nodejs nodejs-legacy npm
a2enconf php7.0-fpm
a2enmod rewrite proxy proxy_fcgi
```
