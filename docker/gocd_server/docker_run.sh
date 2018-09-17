#!/bin/bash

#chown -R go.go /var/lib/go-server/db

#chown -R go.go /var/lib/go-server/artifacts
docker run --rm -t -d -p 8089:8153 renatoadsumus/gocd:latest
