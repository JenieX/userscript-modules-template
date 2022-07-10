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
