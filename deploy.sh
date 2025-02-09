#!/bin/bash
#program: this is a auto-deploy app scripts.
#author: Mr.MarkGuan 
#date: 2020-03-05
#version: v0.0.1

# deploy to github
set -e

# 提交代码和注释
git add .
read -p "Please input this version commits: " -t 30 commits
git commit -m "${commits}"

# 更新到远程仓库
git push origin master
git push gitee master

exit 0