#!/bin/sh

chown -R go:go /var/lib/go-server/db

chown -R go:go /var/lib/go-server/artifacts

chown -R go:go /etc/go/cruise-config.xml

/etc/init.d/go-server start

tail -f /dev/null

