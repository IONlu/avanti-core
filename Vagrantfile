# -*- mode: ruby -*-
# vi: set ft=ruby :

VMname = File.basename(Dir.getwd)

Vagrant.configure(2) do |config|

  config.vm.box = "ubuntu/xenial64"

  #config.vm.network :forwarded_port, guest: 80, host: 8080

  config.vm.synced_folder ".", "/opt/avanti/",
        owner: "ubuntu",
        group: "ubuntu",
        mount_options: ["dmode=775,fmode=664"]

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

  config.ssh.insert_key = false
  config.ssh.private_key_path = ['~/.ssh/vagrant', '~/.vagrant.d/insecure_private_key']
  config.ssh.forward_agent = true

  user = ENV['USER']
  home = ENV['HOME']
  public_key = IO.read(home + '/.ssh/vagrant.pub')
  config.vm.provision "base", type: "shell", :inline => <<-SCRIPT
    echo '#{public_key}' > /home/ubuntu/.ssh/authorized_keys
    chmod 600 /home/ubuntu/.ssh/authorized_keys

    apt-get -y autoremove
    apt-get update
    apt-get -y upgrade

    apt-get -y install nodejs npm

    npm install -g pm2

    cd /opt/avanti && npm install

    ln -s /usr/bin/nodejs /usr/local/bin/node

    runuser -l ubuntu -c 'pm2 start /opt/avanti/src/avanti.js --watch'

    locale-gen en_GB.UTF-8
    echo 'Host *\nUser #{user}' >> /home/ubuntu/.ssh/config
  SCRIPT

  config.ssh.forward_agent = true

end
