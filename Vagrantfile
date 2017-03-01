# -*- mode: ruby -*-
# vi: set ft=ruby :

VMname = File.basename(Dir.getwd)

Vagrant.configure(2) do |config|

    config.vm.box = "gbarbieru/xenial"

    config.vm.network :forwarded_port, guest: 80, host: 8080

    config.vm.synced_folder ".", "/home/vagrant/avanti/",
        owner: "vagrant",
        group: "vagrant",
        mount_options: ["dmode=777,fmode=777"]

    config.vm.provider "virtualbox" do |vb|
        vb.memory = 1024
        vb.cpus   = 2
        vb.name   = "#{VMname}"
    end

    # Set name of VM
    config.vm.define "#{VMname}" do |vb|
    end

    # Setting locale
    ENV["LC_ALL"] = "en_GB.UTF-8"

    config.vm.provision "base", type: "shell", :inline => <<-SCRIPT
        locale-gen en_GB.UTF-8

        curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
        apt-get update && apt-get upgrade

        apt-get -y install \
            apache2 \
            cronolog \
            letsencrypt \
            sqlite3 \
            php \
            php-fpm \
            libapache2-mod-fastcgi \
            build-essential \
            nodejs

        a2enmod rewrite proxy proxy_fcgi

        npm -g install node-pre-gyp gulp

        cd /home/vagrant/avanti && npm install

        # create symlink for avanti executable
        ln -s /home/vagrant/avanti/bin/avanti /usr/local/bin/avanti
    SCRIPT

end
