# -*- mode: ruby -*-
# vi: set ft=ruby :

VMname = File.basename(Dir.getwd)

Vagrant.configure(2) do |config|

    config.vm.box = "gbarbieru/xenial"

    config.vm.network :forwarded_port, guest: 80, host: 8080

    config.vm.synced_folder ".", "/home/vagrant/avanti/",
        owner: "vagrant",
        group: "vagrant",
        mount_options: ["dmode=775,fmode=664"]

    config.vm.synced_folder "./bin", "/home/vagrant/avanti/bin",
        owner: "vagrant",
        group: "vagrant",
        mount_options: ["dmode=775,fmode=777"]

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
        apt-get update

        locale-gen en_GB.UTF-8

        apt-get -y install apache2 cronolog letsencrypt sqlite3
        apt-get -y install php php-fpm libapache2-mod-fastcgi
        apt-get -y install build-essential
        a2enmod rewrite proxy proxy_fcgi

        curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
        apt-get -y install nodejs

        npm -g install node-pre-gyp gulp

        cd /home/vagrant/avanti

        # run npm install 2 times and rebuild (hack)
        npm install --no-bin-links
        npm install --no-bin-links
        npm rebuild

        # create symlink for avanti executable
        ln -s /home/vagrant/avanti/bin/avanti /usr/local/bin/avanti
    SCRIPT

end
