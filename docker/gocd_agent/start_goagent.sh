#!/bin/sh

#chown -R go:go /var/lib/go-agent/pipelines/

/etc/init.d/go-agent start
sudo /etc/init.d/filebeat start

sudo /opt/montar_known_hosts.sh

sudo cp /home/root/.ssh/known_hosts /home/tfsservice/.ssh/

sudo chown go.go /home/tfsservice/.ssh/known_hosts

sudo chmod 644 /home/tfsservice/.ssh/known_hosts

sudo cp /home/root/.ssh/known_hosts /home/go/.ssh/

sudo chown go.go /home/go/.ssh/known_hosts

sudo chmod 644 /home/go/.ssh/known_hosts

#cp /home/go/.ssh/known_hosts /home/tfsservice/.ssh/

tail -f /dev/null