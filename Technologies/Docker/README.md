---
description: Reference of most used docker commands and concepts
---

# Docker

## Installation

Install Docker

## Main Concepts

## Docker Images

## Docker Containers

## Docker Compose

## Docker Hub

## Docker Commands

| Command                                                                                                           | Description           |
| ----------------------------------------------------------------------------------------------------------------- | --------------------- |
| docker rm $(docker ps -a -q)                                                                                      | Delete all containers |
| docker rmi $(docker images -q)                                                                                    | Delete all images     |
| docker                                                                                                            |                       |
| docker container --help                                                                                           |                       |
| docker container create --help                                                                                    |                       |
| docker container disconnect TAB COMPLETION                                                                        |                       |
| docker container exec --help                                                                                      |                       |
| docker container exec -it my\_nginx ping new\_nginx                                                               |                       |
| docker container exec -it mysql bash                                                                              |                       |
| docker container exec -it new\_nginx ping my\_nginx                                                               |                       |
| docker container inspect                                                                                          |                       |
| docker container inspect --format '\{{ .NetworkSettings.IPAddress \}}' webhost                                    |                       |
| docker container inspect mysql                                                                                    |                       |
| docker container inspect TAB COMPLETION                                                                           |                       |
| docker container logs db                                                                                          |                       |
| docker container logs webhost                                                                                     |                       |
| docker container ls                                                                                               |                       |
| docker container ls -a                                                                                            |                       |
| docker container port webhost                                                                                     |                       |
| docker container rm                                                                                               |                       |
| docker container rm -f 63f                                                                                        |                       |
| docker container rm -f TAB COMPLETION                                                                             |                       |
| docker container rm 63f 690 ode                                                                                   |                       |
| docker container run                                                                                              |                       |
| docker container run --publish 80:80 --detach --name webhost nginx                                                |                       |
| docker container run --publish 80:80 --detach nginx                                                               |                       |
| docker container run --publish 80:80 nginx                                                                        |                       |
| docker container run --rm -- net dude alpine nslookup search                                                      |                       |
| docker container run --rm --net dude centos curl -s search:9200                                                   |                       |
| docker container run --rm -it centos:7 bash                                                                       |                       |
| docker container run --rm -it ubuntu:14.04 bash                                                                   |                       |
| docker container run -d --name my\_nginx --network my\_app\_net nginx                                             |                       |
| docker container run -d --name mysql -e MYSQL\_RANDOM\_ROOT\_PASSWORD=true mysql                                  |                       |
| docker container run -d --name new\_nginx --network my\_app\_net nginx                                            |                       |
| docker container run -d --name nginx nginx                                                                        |                       |
| docker container run -d --name proxy -p 80:80 nginx                                                               |                       |
| docker container run -d --name webserver -p 8080:80 httpd                                                         |                       |
| docker container run -d --net dude --net-alias search elasticsearch:2                                             |                       |
| docker container run -d -p 3306:3306 --name db -e MYSQL\_RANDOM\_ROOT\_PASSWORD=yes MYSQL\_RANDOM\_ROOT\_PASSWORD |                       |
| docker container run -help                                                                                        |                       |
| docker container run -it --name proxy nginx bash                                                                  |                       |
| docker container run -it --name ubuntu ubuntu                                                                     |                       |
| docker container run -it alpine bash                                                                              |                       |
| docker container run -it alpine sh                                                                                |                       |
| docker container run -p 80:80 --name webhost -d nginx                                                             |                       |
| docker container start --help                                                                                     |                       |
| docker container start -ai ubuntu                                                                                 |                       |
| docker container stats                                                                                            |                       |
| docker container stats --help                                                                                     |                       |
| docker container stop 690                                                                                         |                       |
| docker container stop TAB COMPLETION                                                                              |                       |
| docker container top                                                                                              |                       |
| docker container top mysql                                                                                        |                       |
| docker container top nginx                                                                                        |                       |
| docker container top webhost                                                                                      |                       |
| docker image ls                                                                                                   |                       |
| docker info                                                                                                       |                       |
| docker network --help                                                                                             |                       |
| docker network connect                                                                                            |                       |
| docker network create --help                                                                                      |                       |
| docker network create dude                                                                                        |                       |
| docker network create my\_app\_net                                                                                |                       |
| docker network inspect bridge                                                                                     |                       |
| docker network inspect my\_app\_net                                                                               |                       |
| docker network inspect TAB COMPLETION                                                                             |                       |
| docker network ls                                                                                                 |                       |
| docker ps                                                                                                         |                       |
| docker ps -a                                                                                                      |                       |
| docker pull alpine                                                                                                |                       |
| docker run                                                                                                        |                       |
| docker run --name mongo -d mongo                                                                                  |                       |
| docker start mongo                                                                                                |                       |
| docker stop mongo                                                                                                 |                       |
| docker top mongo                                                                                                  |                       |
| docker version                                                                                                    |                       |
