#! /bin/sh

# 构建新镜像
docker build -t web-free-rider:latest .

# 停止并删除旧容器
docker stop web-free-rider && docker rm web-free-rider 

# 启动新容器
docker run -d -p 1989:1989 --name web-free-rider web-free-rider:latest
