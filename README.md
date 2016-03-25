# Avanti
Avanti eases the way of deploying new virual hosts on a (currently we only support Ubuntu 16.04 😋) machine.

The goal is to have an [FastCGI Pool Manager (**FPM**)](https://secure.php.net/manual/en/install.fpm.php) to controll all domains.

Controlled by [PosgreSQL](http://www.postgresql.org/) Database [events](http://www.postgresql.org/docs/9.5/static/event-triggers.html), new virtual hosts are created, others are updated or even deleted.

Domains get assigned a pool of PHP processes that they can spawn.

## Requirements
**For now** you need to add the _multiverse_ repository because of **libapache2-mod-fastcgi**

```
apt update
apt install apache2 cronolog
apt install php7.0 php7.0-fpm libapache2-mod-fastcgi
apt install nodejs nodejs-legacy npm
a2enmod rewrite proxy proxy_fcgi
```
