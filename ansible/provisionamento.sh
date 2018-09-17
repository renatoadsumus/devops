#!/bin/bash
if [ "${USER}" != "root" ]; then
    echo " deve ser root"
    exit 4
fi

export https_proxy=http://infoprx3.ogmaster.local:8080
export http_proxy=http://infoprx3.ogmaster.local:8080

#rpm -Uvh https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
yum install -y ansible

curl --insecure --silent 'https://infomon.ogmaster.local/post/rh7/post.sh' | bash -s

echo  [server] >> /etc/ansible/hosts
echo 172.28.128.3 >> /etc/ansible/hosts
echo  [agent] >> /etc/ansible/hosts
#echo 172.17.37.108 >> /etc/ansible/hosts - INFODEVOPS2
echo 172.28.128.4 >> /etc/ansible/hosts


### BAIXANDO PLAYBOOK

curl -u renato.fonseca:P@ssword http://infosvn.ogmaster.local/svn/EquipeQA/devops/ansible/svn_install.yml -o /etc/ansible/roles/svn_install.yml

curl -u renato.fonseca:P@ssword http://infosvn.ogmaster.local/svn/EquipeQA/devops/ansible/puppet_install.yml -o /etc/ansible/roles/puppet_install.yml

curl -u renato.fonseca:P@ssword http://infosvn.ogmaster.local/svn/EquipeQA/devops/ansible/puppet_accept.yml -o /etc/ansible/roles/puppet_accept.yml

### EXECUTANDO PLAYBOOK

#ansible-playbook /etc/ansible/roles/svn_install.yml

