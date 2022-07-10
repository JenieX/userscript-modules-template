# userscript-modules-template

User script template that acts as module and tries to simulate imports.  
I built this to help me developing my user scripts, after learning about [Grunt](https://gruntjs.com/), and I thought I should share.

### It assumes/requires few things

- Nodejs
- Visual Studio Code, and two extensions
  - Prettier
  - ESLint
- Having both `grunt-cli` and `eslint-cli` installed globally
  - `npm install grunt-cli -g`
  - `npm install eslint-cli -g`

```js
// 'package.json' - Relevant keys

{
  "name": "userscript-modules-template",
  "version": "0.0.1",
  "description": "User script template that acts as module and tries to simulate imports",
  "author": {
    "name": "FlowerForWar"
  },
  "devURL": "http://192.168.1.39:3905/user-script-grunt?folder=<%= pkg.name %>&_=.js",
  "license": "MIT",
  "userscript": {
    "namespace": "https://github.com/<%= pkg.author.name %>",
    "other": {
      "match": "*://*/*",
      "grant": [
        "GM.getValue",
        "GM_getValue",
        "GM.setValue",
        "GM_setValue",
        "GM.xmlHttpRequest",
        "GM_xmlhttpRequest",
        "GM.setClipboard",
        "GM_setClipboard"
      ],
      "run-at": "document-start",
      "noframes": "",
      "compatible": [
        "edge Tampermonkey or Violentmonkey",
        "firefox Greasemonkey, Tampermonkey or Violentmonkey",
        "chrome Tampermonkey or Violentmonkey",
        "opera Tampermonkey or Violentmonkey"
      ],
      "supportURL": "https://github.com/<%= pkg.author.name %>/<%= pkg.name %>/issues",
      "homepageURL": "https://github.com/<%= pkg.author.name %>/<%= pkg.name %>",
      "updateURL": "https://github.com/<%= pkg.author.name %>/<%= pkg.name %>/raw/main/dist/<%= pkg.name %>.meta.js",
      "downloadURL": "https://github.com/<%= pkg.author.name %>/<%= pkg.name %>/raw/main/dist/<%= pkg.name %>.user.js",
      "icon": "https://violentmonkey.github.io/icons/icon-48x48.png",
      "license": "<%= pkg.license %>"
    }
  }
}
```

#### Relevant files are inside the [src](https://github.com/FlowerForWar/userscript-modules-template/tree/main/src) folder

- src
  - [index.js](https://github.com/FlowerForWar/userscript-modules-template/blob/main/src/index.js)
  - js
    - [fancyFunction.js](https://github.com/FlowerForWar/userscript-modules-template/blob/main/src/js/fancyFunction.js)
    - [addStyle.js](https://github.com/FlowerForWar/userscript-modules-template/blob/main/src/js/addStyle.js)
    - nested
      - [myArray.js](https://github.com/FlowerForWar/userscript-modules-template/blob/main/src/js/nested/myArray.js)
      - more-nested
        - [myString.js](https://github.com/FlowerForWar/userscript-modules-template/blob/main/src/js/nested/more-nested/myString.js)
  - css
    - [main.scss](https://github.com/FlowerForWar/userscript-modules-template/blob/main/src/css/main.scss)
    - [another.scss](https://github.com/FlowerForWar/userscript-modules-template/blob/main/src/css/another.scss)
  - html
    - [element.html](https://github.com/FlowerForWar/userscript-modules-template/blob/main/src/html/element.html)

```js
// 'src/index.js' - The main js file
// https://github.com/FlowerForWar/userscript-modules-template/blob/main/src/index.js

import fancyFunction from './js/fancyFunction.js';
import addStyle from './js/addStyle.js';

fancyFunction();

addStyle(
  `
include: dist/another.css
`,
  'userscript-modules-template-style-1'
);

addStyle('include: dist/main.min.css', 'userscript-modules-template-style-2');

document.body.insertAdjacentHTML('beforeend', 'include: dist/element.html');

console.log('userscript-modules-template');
```

#### After the first run

```js
// 'dist/userscript-modules-template.user.js' - The output
// https://github.com/FlowerForWar/userscript-modules-template/blob/main/dist/userscript-modules-template.user.js

// ==UserScript==
// @name           userscript-modules-template
// @version        0.0.1
// @namespace      https://github.com/FlowerForWar
// @description    User script template that acts as module and tries to simulate imports
// @author         FlowerForWar
// @match          *://*/*
// @grant          GM.getValue
// @grant          GM_getValue
// @grant          GM.setValue
// @grant          GM_setValue
// @grant          GM.xmlHttpRequest
// @grant          GM_xmlhttpRequest
// @grant          GM.setClipboard
// @grant          GM_setClipboard
// @run-at         document-start
// @noframes
// @compatible     edge Tampermonkey or Violentmonkey
// @compatible     firefox Greasemonkey, Tampermonkey or Violentmonkey
// @compatible     chrome Tampermonkey or Violentmonkey
// @compatible     opera Tampermonkey or Violentmonkey
// @supportURL     https://github.com/FlowerForWar/userscript-modules-template/issues
// @homepageURL    https://github.com/FlowerForWar/userscript-modules-template
// @updateURL      https://github.com/FlowerForWar/userscript-modules-template/raw/main/dist/userscript-modules-template.meta.js
// @downloadURL    https://github.com/FlowerForWar/userscript-modules-template/raw/main/dist/userscript-modules-template.user.js
// @icon           https://violentmonkey.github.io/icons/icon-48x48.png
// @license        MIT
// ==/UserScript==

const myString = 'Hello';

const myArray = [1, 2, myString];

function fancyFunction() {
  console.log(myArray);
}

function addStyle(styleText, id) {
  const head = document.getElementsByTagName('head')[0] || document.documentElement;
  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.textContent = styleText;
  if (id) {
    style.setAttribute('id', id);
  }
  head.appendChild(style);
  return style;
}

fancyFunction();

addStyle(
  `
.info {
  background: DarkGray;
  box-shadow: 0 0 1px rgba(169, 169, 169, 0.25);
  color: #fff; 
}
.alert {
  background: DarkRed;
  box-shadow: 0 0 1px rgba(139, 0, 0, 0.25);
  color: #fff; 
}
.success {
  background: DarkGreen;
  box-shadow: 0 0 1px rgba(0, 100, 0, 0.25);
  color: #fff; 
}
`,
  'userscript-modules-template-style-1'
);

addStyle('body{background-color:#fff}', 'userscript-modules-template-style-2');

document.body.insertAdjacentHTML('beforeend', '<ul id="list"><li>first</li><li>second</li><li>third</li></ul>');

console.log('userscript-modules-template');
```

## How to start

- `npm install`
- `npm start` which will build everything and watch

## Notes

- Style files are `scss`, if you don't know what that is, just treat them like css files
- `html` and `scss` files can be nested inside their parent folders, but their names must be unique
- If you don't want to use any css files or html files, keep their folders empty
- `userscript-modules-template.dev.js` file will be created as well (the main reason for this project), which is basically a request to the `dist/userscript-modules-template.user.js` file that is needed to be served somehow.

## License

[MIT](https://github.com/FlowerForWar/userscript-modules-template/blob/main/LICENSE)
