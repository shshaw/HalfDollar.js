/*! HalfDollar.js, https://github.com/shshaw/HalfDollar.js | @license */
/*
                                            H
                                         .x+H:..
      oH         !$F   .--~*tHu.       u$~  H  'b.
    .@$$         $$'  dF     $$$Nx    t$H   H d$$$>
==*$$$$$        :$$  d$$$b   '$$$$>   $$N.  H'$$$$~
   $$$$$       .$$F  ?$$$$>  $$$$$F   $$$$$bH.'""'
   $$$$$       :$$'   "**"  x$$$$$~   '$$$$$$$H.
   $$$$$       $$F         d$$$$*'     "*$$$$$$$N
   $$$$$      .$$'       z$**"'   :    uu. ^$*$$$$H
   $$$$$      d$F      :?.....  ..F   @$$$L H '"$$H
   $$$$$     .$$      <""$$$$$$$$$~  '$$$$~ H   $$~
   $$$$$     d$F      $:' "$$$$$$*    '*.   H  .*"
'**%%%%%%** :$$       ""    "**"'       '~==H=~'
                                            H

 A micro replacement for jQuery, using modern browser methods.
*/

;(function(window,document,undefined){
  'use strict';

  function extend(target) {
    target = target || {};

    var length = arguments.length,
        i = 1;

    if ( arguments.length === 1) {
      target = this;
      i = 0;
    }

    for (; i < length; i++) {
      if (!arguments[i]) { continue; }
      for (var key in arguments[i]) {
        if ( arguments[i].hasOwnProperty(key) ) { target[key] = arguments[i][key]; }
      }
    }

    return target;
  }

  var isFunction = (function(type){
      return function(item) { return typeof item === type; };
    }(typeof function(){}));

  // If the browser doesn't have the necessary methods, allow for a fallback to jQuery.
  if ( !('querySelectorAll' in document) && !('addEventListener' in window) ) {
    var queue = [],
        checkjQuery = function() {
          if (  document.readyState !== 'loading' ) {
            document.onreadystatechange = function(){};
            if ( window.jQuery ) {
              jQuery.fn.extend(temp.fn);
              delete temp.fn;
              jQuery.extend(temp);
              jQuery.each(queue,function(i,v){ v(); });
            }
            else { setTimeout(checkjQuery,200); }
          }
        },
        temp = function(callback) {
          if ( isFunction(callback) ) { queue.push(callback); }
          return window.$;
        };

    temp.extend = extend;
    temp.fn = { extend: extend };

    window.$ = temp;
    document.onreadystatechange = checkjQuery;
    return false;
  }


////////////////////////////////////////
// Utils

  var arr = [],
      slice = arr.slice,
      idOrHTML = /^\s*?(#([-\w]*)|<[\w\W]*>)\s*?$/;

  function find(selector,context) {
    context = context || document;
    var elems = context.querySelectorAll(selector);
    return slice.call(elems);
  }

  function parseHTML(str) {
    var tmp = document.implementation.createHTMLDocument();
    tmp.body.innerHTML = str;
    return slice.call(tmp.body.children);
  }

  function onReady(fn) {
    if ( document.readyState !== 'loading' ) { fn(); }
    else { document.addEventListener('DOMContentLoaded', fn); }
  }


////////////////////////////////////////
// Core

  var Init = function(selector,context){

      var match = idOrHTML.exec(selector),
          i = 0,
          elems,
          length;

      // If function, use as shortcut for DOM ready
      if ( half$.isFunction(selector) ) { onReady(selector); return this; }
      else if ( half$.isString(selector) ) {
        // If an ID use the faster getElementById check
        if ( match && match[2]  ) { selector = document.getElementById(match[2]); }
        // If HTML, parse it into real elements, else use querySelectorAll
        else { elems = ( match ? parseHTML(selector) : find(selector,context) ); }
      }

      if ( !selector ) { return this; }

      // If a DOM element is passed in or received via ID return the single element
      if ( selector.nodeType ) {
        this[0] = selector;
        this.length = 1;
        return this;
      }

      length = this.length = elems.length;
      for( ; i < length; i++ ) { this[i] = elems[i]; }

      return this;
    },

    half$ = function(selector,context) {
      return new Init(selector,context);
    };

  half$.extend = extend;


////////////////////////////////////////
// Type checks

  half$.extend({

    each: function(obj,callback){
      if ( arguments.length === 1) {
        callback = arguments[0];
        obj = this;
      }

      var length = obj.length,
          likeArray = ( length === 0 || ( length > 0 && (length - 1) in obj ) ),
          i = 0;

      if ( likeArray ) {
        for ( ; i < length; i++ ) {
          if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) { break; }
        }
      } else {
        for (i in obj) {
          if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) { break; }
        }
      }

      return obj;
    },

    noop: function(){},
    now: Date.now,

    type: function(obj) { return typeof obj; },
    is$: function(obj){ return obj instanceof half$; },
    isNumeric: function(n) { return !isNaN(parseFloat(n)) && isFinite(n); },
    isArray: Array.isArray,
    isFunction: isFunction,
    isString: (function(type){
      return function(item) { return typeof item === type; };
    }(typeof ""))

  });


////////////////////////////////////////
// Functions to pass to each instance

  half$.fn = Init.prototype = half$.prototype = {

    version: 0.1,
    constructor: half$,

    // Array-like necessities
    length: 0,
  	splice: arr.splice,
    push: arr.push,
    indexOf: arr.indexOf,
    map: function(callback){ return arr.map.call(this,callback,this); },

    concat: function(){
      var obj = this;
      half$.each(arguments,function(){
        if ( half$.isArray(this) ) {
          half$.each(this,function(){ obj.push(this); });
        } else {
          obj.push(this);
        }
      });
      return this;
    },

    each: half$.each,
    extend: half$.extend,

    get: function(index) {
      if ( index === undefined ) { return slice.call(this); }
      return ( index < 0 ? this[index + this.length] : this[index] );
    },
    eq: function(index) { return half$(this.get(index)); },
    first: function(){ return this.eq(0); },
    last: function(){ return this.eq(-1); }

  };



////////////////////////////////////////
// Classes

  half$.fn.extend({

    addClass: function(c){
      var classes = c.split(' '),
          obj = this;

      half$.fn.each(classes,function(i,c){
        obj.each(function(){
          if (this.classList) { this.classList.add(c); }
          else { this.className += ' ' + c; }
        });
      });

      return this;
    },

    removeClass: function(c){
      var classes = c.split(' '),
          obj = this;

      half$.fn.each(classes,function(i,c){
        obj.each(function(){
          if (this.classList) { this.classList.remove(c); }
          else { this.className = this.className.replace(c,''); }
        });
      });

      return this;
    },

    toggleClass: function(c, state){
      if ( state !== undefined ) {
        return this[state ? 'addClass' : 'removeClass' ](c);
      }

      return this.each(function(){
        if (this.classList) { this.classList.toggle(c); }
        else {
          if ( this.className.indexOf(c) >= 0 ) { this.className.replace(c,''); }
          else { this.className += ' ' + c; }
        }
      });
    },

    hasClass: function(c){
      var check = false;
      this.each(function(){
        check = (this.classList ? this.classList.contains(c) : new RegExp('(^| )' + c + '( |$)', 'gi').test(this.className) );
        return !check;
      });
      return check;
    }

  });


////////////////////////////////////////
// Attributes

  half$.fn.extend({

    attr: function(attrName, value){
      if ( arguments.length === 1 ) { return this[0].getAttribute(attrName); }
      else if ( value === undefined ) { return this; }
      return this.each(function(){ this.setAttribute(attrName,value); });
    },

    removeAttr: function(attrName){
      return this.each(function(){ this.removeAttribute(attrName); });
    },

    data: function(){
      arguments[0] = 'data-' + arguments[0];
      return this.attr.apply(this,arguments); //this.attr('data-'+key,value);
    },

    removeData: function(){
      arguments[0] = 'data-' + arguments[0];
      return this.removeAttr.apply(this,arguments); //this.attr('data-'+key,value);
    },

    prop: function(propName, value){
      if ( arguments.length === 1 ) { return this[0][propName]; }
      return this.each(function(){ this[propName] = value; });
    },

    removeProp: function(propName) {
      return this.each(function(){ delete this[propName]; });
    },

    val: function(value){
      var ar = slice.call(arguments);
      ar.unshift('value');
      return this.prop.apply(this,ar);
    }

  });


////////////////////////////////////////
// Content / DOM manipulation

  half$.fn.extend({

    html: function(content){
      if ( arguments.length === 0 ) { return this[0].innerHTML; }
      return this.each(function(){ this.innerHTML = content; });
    },

    text: function(content){
      if ( arguments.length === 0 ) { return this[0].textContent; }
      return this.each(function(){ this.textContent = content; });
    },

    empty: function(){ return this.html(''); },
    remove: function(){ return this.each(function(){ this.remove(); }); }

  });


////////////////////////////////////////
// Append / Prepend

  var methods = {
      'prepend': {
        insert: 'afterbegin',
        dom: function(el,child){
          var first = el.childNodes[0];
          el.insertBefore(child,first);
        }
      },
      'append': {
        insert: 'beforeend',
        dom: function(el,child){ el.appendChild(child); }
      }
    };

    function insertContent(method,el,child){
      if ( half$.isString(child) ) {
        half$.each(el,function(){
          this.insertAdjacentHTML(methods[method].insert,child);
        });
      } else if ( child.length ) {
        half$.each(child,function(){ insertContent(method,el,this); });
      } else if ( child.nodeType ) {
        half$.each(el,function(i){
          methods[method].dom(this,( i === 0 ? child : child.cloneNode(true) ));
        });
      }
      return el;
    }

  half$.fn.extend({

    append: function(){ return insertContent('append',this,arguments); },
    prepend: function(){ return insertContent('prepend',this,arguments); },

    appendTo: function(el){ insertContent('append',el,this); return this; },
    prependTo: function(el){ insertContent('prepend',el,this); return this; }

  });


////////////////////////////////////////
// Filtering & Traversal

  function matches(el, selector) {
    return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
  }

  half$.fn.extend({

    is: function(selector){
      var match;
      if ( half$.isString(selector) ) {
        this.each(function(){
          match = matches(this,selector);
          return !match;
        });
      } else if ( selector.nodeType ) {
        this.each(function(){
          match = ( this === selector );
          return !match;
        });
      }
      return match;
    },

    // Find decendents by selector
    find: function(selector){
      var $elems = half$();
      if ( !selector ) { return $elems; }

      this.each(function(){
        $elems = $elems.concat(find(selector,this));
      });

      return $elems;
    },

    // Filter only elements that match selector
    filter: function(selector){
      var $elems = half$();
      if ( !selector ) { return $elems; }

      this.each(function(){
        if ( selector && !matches(this,selector) ) { return true; }
        $elems.push(this);
      });

      return $elems;
    },

    // Get children, optionally filtered by selector
    children: function(selector){
      var $elems = half$();

      this.each(function(){
        half$.each(this.children,function(){
          if ( selector && !matches(this,selector) ) { return true; }
          $elems.push(this);
        });
      });

      return $elems;
    },

    // Get parent, optionally filtered by selector
    parent: function(selector){
      var $elems = half$();

      this.each(function(){
        var parent = this.parentNode;
        if ( selector && !matches(parent,selector) ) { return true; }
        $elems.push(parent);
      });

      return $elems;
    }

  });


////////////////////////////////////////
// Show/Hide, non-animated

  half$.fn.extend({

    hide: function(){
      return this.each(function(){ this.style.display = 'none'; });
    },

    show: function(){
      return this.each(function(){ this.style.display = ''; });
    }

  });

////////////////////////////////////////
// CSS



  var getPrefixedProp = (function() {
    var cache = {},
        div = document.createElement('div'),
        style = div.style;

    var camelRegex = /(?:^\w|[A-Z]|\b\w|\s+)/g,
        nonAlpha = /[^a-z\ ]/ig;

    function camelCase(str) {
      return str.replace(nonAlpha,' ').replace(camelRegex, function(match, index) {
        if ( +match === 0 ) { return ''; } // or if (/\s+/.test(match)) for white spaces
        return ( index === 0 ? match.toLowerCase() : match.toUpperCase() );
      });
    }

    return function(prop) {
      prop = camelCase(prop);
      if ( cache[prop] !== undefined ) { return cache[prop]; }

      var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
          prefixes = ["webkit", "moz", "ms"],
          props = (prop + ' ' + (prefixes).join(ucProp + ' ') + ucProp).split(' '),
          i = props.length;

      while (i--) {
        if ( props[i] in style ) {
          cache[prop] = props[i];
          return props[i];
        }
      }

      return prop;
    };
  }());

  console.info(getPrefixedProp('column-gap'));

  half$.fn.extend({

    css: function(ruleName,value){

      var isString = half$.isString(ruleName);
      if ( isString ) { ruleName = getPrefixedProp(ruleName); }

      if ( arguments.length === 1 ) {
        if ( isString ) {
          return getComputedStyle(this[0])[ruleName];
        } else {
          var obj = this;
          half$.each(ruleName,function(key){ obj.css(key,this); });
          return obj;
        }
      }

      return this.each(function(){ this.style[ruleName] = value; });
    }

  });


////////////////////////////////////////
// Events

  half$.fn.extend({

    on: function(event,callback){
      return this.each(function(){
        this.addEventListener(event,callback);
      });
    },

    off: function(event,callback){
      return this.each(function(){
        this.removeEventListener(event,callback);
      });
    },

    one: function(event,callback){
      return this.each(function(){
        var fn = function(){
              callback.apply(this, arguments);
              this.removeEventListener(event,fn);
            };
        this.addEventListener(event,fn);
      });
    }

  });


////////////////////////////////////////
// Clone

  half$.fn.extend({
    clone: function(){
      var $elems = half$();
      this.each(function(){
        $elems.push(this.cloneNode(true));
      });
      return $elems;
    }
  });


////////////////////////////////////////
// Get Width / Height


  half$.fn.extend({

    height: function(){ return this[0].clientHeight; },
    outerHeight: function(){ return this[0].offsetHeight; },

    width: function(){ return this[0].clientWidth; },
    outerWidth: function(){ return this[0].offsetWidth; }

  });

////////////////////////////////////////
// Offset & Position

  half$.fn.extend({

    position: function(){
      var el = this[0];
      return {
        left: el.offsetLeft,
        top: el.offsetTop
      };
    },

    offset: function(){
      var rect = this[0].getBoundingClientRect(),
          b = document.body;
      return {
        top: rect.top + b.scrollTop,
        left: rect.left + b.scrollLeft
      };
    },

    offsetParent: function(){ return half$(this[0].offsetParent); }

  });



////////////////////////////////////////
// AJAX

  function ajaxRequest(opts){

    if ( !opts ) { return false; }

    if ( !opts.url ) {
      if ( opts.error ) { opts.error.call(false, 'no url'); }
      return false;
    }

    opts.method = opts.method || 'GET';

    var request = new XMLHttpRequest();
    request.open(opts.method, opts.url, true);

    if ( opts.method === 'POST' ) {
      request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    }

    request.onload = function() {
      var resp = request.responseText,
          status = request.status;

      if ( status >= 200 && status < 400) {
        // Success!
        if ( opts.success ) { opts.success.call(request, resp, status, request ); }
      } else {
        // We reached our target server, but it returned an error
        if ( opts.error ) { opts.error.call(request, request, status, resp ); }
      }
      if ( opts.complete ) { opts.complete.call(request, request, status); }
    };

    request.onerror = function() {
      // There was a connection error of some sort
      if ( opts.error ) { opts.error.call(request, request, status, request.responseText ); }
    };

    if ( opts.dataType ) { request.overrideMimeType(opts.dataType); }

    request.send(opts.data);
    return request;
  }

  half$.extend({

    ajax: function(url,opts){
      if ( arguments.length === 1 ) { opts = arguments[0]; }
      else { opts.url = url || opts.url; }
      return ajaxRequest(opts);
    },

    get: half$.ajax,

    post: function(url,data,success,dataType){
      var opts = {};
      if ( arguments.length === 1 ) { opts = arguments[0]; }
      else {
        opts = {
          url: url,
          data: data,
          success: success,
          dataType: dataType
        };
      }
      opts.method = 'POST';
      return ajaxRequest(opts);
    }

  });

////////////////////////////////////////
// noConflict to remove half$ if the original $ is needed;
  var _$ = window.$;

  half$.noConflict = function(){
    if ( window.$ === half$ ) { window.$ = _$; }
    return half$;
  };

  // Set half$ up in the global space to be used by other scripts
  window.$ = window.half$ = half$;

}(window,document));