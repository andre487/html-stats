# HTML stats counter

Simple utility for collecting HTML files stats

[![Build Status](https://travis-ci.org/andre487/html-stats.svg?branch=master)](https://travis-ci.org/andre487/html-stats)
[![Code Climate](https://codeclimate.com/github/andre487/html-stats/badges/gpa.svg)](https://codeclimate.com/github/andre487/html-stats)
[![bitHound Overall Score](https://www.bithound.io/github/andre487/html-stats/badges/score.svg)](https://www.bithound.io/github/andre487/html-stats)
[![npm version](https://badge.fury.io/js/html-stats.svg)](https://badge.fury.io/js/html-stats)

Installation:
```sh
npm install [-g] html-stats
```

Usage:
```sh
html-stats struct '*/page.html'
```

You can use any globs as file path.

Results are sizes in bytes of different page parts. Results keys:
  * **total** – total size extracted from AST,
  * **rawTotal** – total size counted with the page directly,
  * **directives** – directives (e. g. doctype) sizes,
  * **tags** – size of tags and spaces in tags declaration,
  * **attributes** – attributes sizes,
  * **css** – content of the `<style />` elements,
  * **scripts** – content of the `<script />` elements,
  * **comments** – comments size,
  * **text** – all the page text size,
  * **spaces** – spaces and EOL sizes.

Results presented in percentiles: 25, 50, 75, 95, 98, 100.

Results example:
```json
{
  "total": {
    "25": 270837,
    "50": 309765,
    "75": 352189,
    "95": 466561,
    "98": 543257,
    "100": 775025
  },
  "directives": {
    "25": 15,
    "50": 15,
    "75": 15,
    "95": 15,
    "98": 15,
    "100": 15
  },
  "tags": {
    "25": 6000,
    "50": 7056,
    "75": 8137,
    "95": 10677,
    "98": 18927,
    "100": 31225
  },
  "attributes": {
    "25": 113650,
    "50": 133711,
    "75": 157262,
    "95": 246005,
    "98": 343876,
    "100": 582644
  },
  "css": {
    "25": 118373,
    "50": 127444,
    "75": 135806,
    "95": 152970,
    "98": 160236,
    "100": 220013
  },
  "scripts": {
    "25": 13183,
    "50": 31699,
    "75": 42651,
    "95": 67124,
    "98": 90352,
    "100": 121464
  },
  "comments": {
    "25": 57,
    "50": 57,
    "75": 57,
    "95": 57,
    "98": 57,
    "100": 839
  },
  "text": {
    "25": 6419,
    "50": 7672,
    "75": 8882,
    "95": 11135,
    "98": 27412,
    "100": 36403
  },
  "spaces": {
    "25": 10,
    "50": 31,
    "75": 62,
    "95": 128,
    "98": 179,
    "100": 458
  },
  "rawTotal": {
    "25": 270837,
    "50": 309765,
    "75": 352189,
    "95": 466561,
    "98": 543257,
    "100": 775025
  }
}
```

