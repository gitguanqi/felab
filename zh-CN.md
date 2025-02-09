# 前端实验室

> 这是本项目的说明文档，关于前端案例的一些页面展示！

[英文文档](./README.md)

## 目录

+ 安全
+ 背景
+ 安装
+ 用法
+ API
+ 贡献
+ 协议

## 安全

本项目采用[W3C](https://w3.org)WEB标准原生语言搭建而成，主题采用自主设计。

目前暂未发现程序安全问题，如有问题，请提[建议](https://github.com/gitguanqi/felab/issues/new)。

## 背景

这个仓库记录我这两年来所写和练习的前端知识案例的汇总，包括大的项目和精简案例。

## 安装

```sh
git clone https://github.com/gitguanqi/felab.git felab
cd felab
npm i live-server -g
live-server --port=4001 --host=localhost
```

打开`http://localhost:4001`便可查看。

## 用法

在`assets/mock/list.json`增添项目记录即可。

大的项目可以添加在`projects`文件夹，小案例在`cases`文件夹中。

`json`格式为

```json
{
  "id": 1,
  "cid": 1001,
  "name": "XXX",
  "description": "XXX",
  "href": "projects/XXX/",
  "picUrl": "./assets/images/cover/XXX.jpg",
  "type": "project",
  "tags": "XXX,XXX",
  "create_time": "2020-03-04",
  "update_time": "2020-03-04"
}
```

## API

本仓库采用axios库来请求mock数据，进行页面渲染。

## 贡献

[@gitguanqi](https://github.com/gitguanqi)

## 协议

本项目遵循[GPL3.0](https://www.gnu.org/licenses/gpl-3.0.html)协议,Copyright By gitguanqi
