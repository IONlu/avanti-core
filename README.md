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

```
apt update
apt install apache2 cronolog letsencrypt
apt install php7.0 php7.0-fpm libapache2-mod-fastcgi
apt install nodejs nodejs-legacy npm
a2enmod rewrite proxy proxy_fcgi
```
