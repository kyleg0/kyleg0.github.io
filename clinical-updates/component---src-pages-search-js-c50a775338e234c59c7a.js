webpackJsonp([0x81e20e680ce7],{216:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}t.__esModule=!0;var u=n(2),l=r(u),c=n(9),i=r(c),f=function(e){function t(){var n,r,s;o(this,t);for(var u=arguments.length,l=Array(u),c=0;c<u;c++)l[c]=arguments[c];return n=r=a(this,e.call.apply(e,[this].concat(l))),r.state={query:"",results:[]},r.getSearchResults=function(e){fetch("https://curhestage.wpengine.com/wp-json/wp/v2/pages?search="+e).then(function(e){return e.json()}).then(function(t){r.setState({query:e,results:t})})},r.stripBaseUrl=function(e){var t="https://curhestage.wpengine.com/clinical-updates/";return e.replace(t,"")},s=n,a(r,s)}return s(t,e),t.prototype.componentDidMount=function(){var e=new URLSearchParams(document.location.search.substring(1)),t=e.get("q");this.getSearchResults(t)},t.prototype.render=function(){var e=this;return l.default.createElement("div",{style:{padding:"0.5rem",maxWidth:"960px",margin:"auto"}},l.default.createElement("h1",null,"Results for ",this.state.query),this.state.results.length&&this.state.results.map(function(t){return l.default.createElement("div",{key:t.id,style:{marginBottom:"1rem"}},l.default.createElement("span",{style:{color:"gray"}},e.stripBaseUrl(""+t.link)),l.default.createElement("br",null),l.default.createElement(i.default,{to:e.stripBaseUrl(""+t.link)},t.title.rendered))}))},t}(u.Component);t.default=f,e.exports=t.default}});
//# sourceMappingURL=component---src-pages-search-js-c50a775338e234c59c7a.js.map