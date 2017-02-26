# -*- mode: ruby -*-
# vi: set ft=ruby :

VMname = File.basename(Dir.getwd)

Vagrant.configure(2) do |config|

    config.vm.box = "ubuntu/xenial64"

    config.vm.network :forwarded_port, guest: 80, host: 8080

    config.vm.synced_folder ".", "/home/ubuntu/avanti/",
        owner: "ubuntu",
        group: "ubuntu",
        mount_options: ["dmode=775,fmode=664"]

    config.vm.synced_folder "./bin", "/home/ubuntu/avanti/bin",
        owner: "ubuntu",
        group: "ubuntu",
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
        apt-get -y autoremove
        apt-get update
        apt-get -y upgrade

        locale-gen en_GB.UTF-8

        apt-get -y install apache2 cronolog letsencrypt sqlite3
        apt-get -y install php php-fpm libapache2-mod-fastcgi
        a2enmod rewrite proxy proxy_fcgi

        curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
        apt-get -y install nodejs

        ln -s /home/ubuntu/avanti/bin/avanti /usr/local/bin/avanti
    SCRIPT

    config.ssh.insert_key = true
    config.ssh.forward_agent = true

end
