# FE laboratory

> This is the documentation for this project. Some pages about front-end cases are displayed!

[Chinese document](./zh-CN.md)

## table of Contents

+ Security
+ Background
+ Installation
+ Usage
+ API
+ Contribution
+ Agreement

## Safety

This project is built using [W3C](https://w3.org) WEB standard native language, and the theme is designed independently.

No program security issues have been found at this time. If you have any questions, please mention [Suggestions](https://github.com/gitguanqi/felab/issues/new).

## Background

This warehouse records a summary of front-end knowledge cases that I have written and practiced in the past two years, including large projects and streamlined cases.

## Installation

```sh
git clone https://github.com/gitguanqi/felab.git felab
cd felab
npm i live-server -g
live-server --port=4001 --host=localhost
```

Open `http://localhost:4001` to see it.

## Usage

Add project records in `assets/mock/list.json`.

Large projects can be added in the `projects` folder and small cases in the `cases` folder.

`json` format is

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

This warehouse uses the axios library to request mock data for page rendering.

## Contribution

[@gitguanqi](https://github.com/gitguanqi)

## Agreement

This project follows the [GPL3.0](https://www.gnu.org/licenses/gpl-3.0.html) agreement, Copyright By gitguanqi
