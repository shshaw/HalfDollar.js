/*! HalfDollar.js, https://github.com/shshaw/HalfDollar.js */
/*
                                             E
                                          .x+E:..
      oe         !$F   .--~*teu.        u$~  E  'b.
    .@$$         $$'  dF     $$$Nx     t$E   E d$$$>
==*$$$$$        :$$  d$$$b   '$$$$>    $$N.  E'$$$$~
   $$$$$       .$$F  ?$$$$>  $$$$$F    $$$$$b&.'""'
   $$$$$       :$$'   "**"  x$$$$$~    '$$$$$$$$e.
   $$$$$       $$F         d$$$$*'      "*$$$$$$$N
   $$$$$      .$$'       z$**"'   :     uu. ^$*$$$$E
   $$$$$      d$F      :?.....  ..F    @$$$L E '"$$E
   $$$$$     .$$      <""$$$$$$$$$~   '$$$$~ E   $$~
   $$$$$     d$F      $:  "$$$$$$*     '*.   E  .*"
'**%%%%%%** :$$       ""    "**"'        '~==R=~'
                                             E

 A micro replacement for jQuery, using modern browser methods.
*/

;(function(window,document,undefined){
  'use strict';

  function onReady(fn) {
    if ( document.readyState !== 'loading' ) { fn(); }
    else { document.addEventListener('DOMContentLoaded', fn); }
  }

  var isFunction = (function(type){
      return function(item) { return typeof item === type; };
    }(typeof function(){}));

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

  // If the browser doesn't have the necessary methods, allow for a fallback to jQuery.
  if ( !('querySelectorAll' in document) && !('addEventListener' in window) ) {
    var queue = [],
        checkjQuery = function() {
          if ( window.jQuery ) {
            jQuery.fn.extend(temp.fn);
            delete temp.fn;
            jQuery.extend(temp);
            jQuery.each(queue,function(i,v){ v(); });
          }
          else { setTimeout(checkjQuery,200); }
        },
        temp = function(callback) {
          if ( isFunction(callback) ) { queue.push(callback); }
          return window.$;
        };

    temp.extend = extend;
    temp.fn = { extend: extend };

    window.$ = temp;
    onReady(checkjQuery);
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

  function matches(el, selector) {
    return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
  }

  function parseHTML(str) {
    var tmp = document.implementation.createHTMLDocument();
    tmp.body.innerHTML = str;
    return slice.call(tmp.body.children);
  }


////////////////////////////////////////
// Core

  function Init(selector,context){

    var match = idOrHTML.exec(selector),
        i = 0,
        elems,
        length;

    // If function, use as shortcut for DOM ready
    if ( Half$.isFunction(selector) ) { onReady(selector); return this; }
    else if ( Half$.isString(selector) ) {
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
  }

  function Half$(selector,context) {
    return new Init(selector,context);
  }

////////////////////////////////////////
// Util functions


/*
  Half$.extend = function(first, second){
    var target = first || {};
    if ( !second ) {
      target = this;
      second = first;
    }
    for (var prop in second) {
      if ( second[prop] !== undefined ) { target[prop] = second[prop]; }
    }
    return target;
  };
*/

  Half$.extend = extend;


////////////////////////////////////////
// Type checks

  Half$.extend({

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

    type: function(obj) { return typeof obj; },

    is$: function(obj){ return obj instanceof Half$; },

    isNumeric: function(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    },

    isString: (function(type){
      return function(item) { return typeof item === type; };
    }(typeof "")),

    isArray: Array.isArray,

    isFunction: isFunction

  });

/*
  Half$.map = function(obj,callback){
    var length = obj.length,
        i = 0;

    for(; i < length; i++){}
  };

  Half$.merge = function( first, second ) {
    var len = +second.length,
      j = 0,
      i = first.length;
    for ( ; j < len; j++ ) { first[ i++ ] = second[ j ]; }
    first.length = i;
    return first;
  };
*/


////////////////////////////////////////
// Functions to pass to each instance

  Half$.fn = Init.prototype = Half$.prototype = {
    version: 0.1,
    constructor: Half$,

    // Array-like necessities
    length: 0,
  	splice: arr.splice,
    push: arr.push,
    indexOf: arr.indexOf,
    map: function(callback){ return arr.map.call(this,callback,this); },

    concat: function(){
      var _this = this;
      Half$.each(arguments,function(){
        if ( Half$.isArray(this) ) {
          Half$.each(this,function(){ _this.push(this); });
        } else {
          _this.push(this);
        }
      });
      return this;
    },

    each: Half$.each,
    extend: Half$.extend,
/*
    each: function(callback){
      return Half$.each(this,callback);
    },
*/
    get: function(index) {
      if ( index === undefined ) { return slice.call(this); }
      return ( index < 0 ? this[index + this.length] : this[index] );
    },

    eq: function(index) { return Half$(this.get(index)); },
    first: function(){ return this.eq(0); },
    last: function(){ return this.eq(-1); }
  };



////////////////////////////////////////
// Classes

  Half$.fn.extend({

    addClass: function(c){
      var classes = c.split(' '),
          obj = this;

      Half$.fn.each(classes,function(i,c){
        obj.each(function(){
          if (this.classList) {
            this.classList.add(c);
          } else {
            this.className += ' ' + c;
          }
        });
      });

      return this;
    },

    removeClass: function(c){
      var classes = c.split(' '),
          obj = this;

      Half$.fn.each(classes,function(i,c){
        obj.each(function(){
          if (this.classList) {
            this.classList.remove(c);
          } else {
            this.className = this.className.replace(c,'');
          }
        });
      });

      return this;
    },

    toggleClass: function(c, state){
      if ( state !== undefined ) { return this[state ? 'addClass' : 'removeClass' ](c); }

      return this.each(function(){
        if (this.classList) {
          this.classList.toggle(c);
        } else {
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

  Half$.fn.extend({
    attr: function(attrName, value){
      if ( arguments.length === 1 ) { return this[0].getAttribute(attrName); }
      else if ( value === undefined ) { return this; }

      return this.each(function(){
        this.setAttribute(attrName,value);
      });
    },

    removeAttr: function(attrName){
      return this.each(function(){
        this.removeAttribute(attrName);
      });
    },

    data: function(){
      arguments[0] = 'data-' + arguments[0];
      return this.attr.apply(this,arguments); //this.attr('data-'+key,value);
    },

    prop: function(propName, value){
      if ( arguments.length === 1 ) { return this[0][propName]; }

      return this.each(function(){
        this[propName] = value;
      });
    },

    removeProp: function(propName) {
      return this.each(function(){
        delete this[propName];// = undefined
      });
    }
  });


////////////////////////////////////////
// Content / DOM manipulation

  Half$.fn.extend({

    html: function(content){
      if ( arguments.length === 0 ) { return this[0].innerHTML; }
      return this.each(function(){ this.innerHTML = content; });
    },

    text: function(content){
      if ( arguments.length === 0 ) { return this[0].textContent; }
      return this.each(function(){ this.textContent = content; });
    },

    empty: function(){ return this.html(''); },

    append: function(content){

      if ( Half$.isString(content) ) {
        return this.each(function(){ this.insertAdjacentHTML('beforeend',content); });
      }

      if ( content.length && content.length > 1 ) {
        var _this = this;
        Half$.each(content,function(){ _this.append(this); });
        return this;
      } else if ( content.length ) {
        content = content[0];
      }

      return ( content.nodeType ? this.each(function(i){
        this.appendChild(( i === 0 ? content : content.cloneNode(true) ));
      }) : this );

    },

    prepend: function(content){

      if ( Half$.isString(content) ) {
        return this.each(function(){ this.insertAdjacentHTML('afterbegin',content); });
      }

      if ( content.length && content.length > 1 ) {
        var _this = this;
        Half$.each(content,function(){ _this.prepend(this); });
        return this;
      } else if ( content.length ) {
        content = content[0];
      }

      return ( content.nodeType ? this.each(function(i){
          var first = this.childNodes[0];
          this.insertBefore(( i === 0 ? content : content.cloneNode(true) ),first);
        }) : this );

    },

    remove: function(){ return this.each(function(){ this.remove(); }); },

    appendTo: function(el){
      if ( !$.is$(el) ) { el = $(el); }
      el.append(this);
      return this;
    },

    prependTo: function(el){
      if ( !$.is$(el) ) { el = $(el); }
      el.prepend(this);
      return this;
    }

  });


////////////////////////////////////////
// Traversal

  Half$.fn.extend({

    // Find children
    find: function(selector){
      var $elems = Half$();
      if ( !selector ) { return $elems; }

      this.each(function(){
        $elems = $elems.concat(find(selector,this));
      });

      return $elems;
    },

    // Get parent, optionally filtered by selector
    parent: function(selector){
      var $elems = Half$();

      this.each(function(){
        var parent = this.parentNode;
        if ( selector && !matches(parent,selector) ) { return true; }
        $elems.push(parent);
      });

      return $elems;
    },

    children: function(selector){
      var $elems = Half$();

      this.each(function(){
        Half$.each(this.children,function(){
          if ( selector && !matches(this,selector) ) { return true; }
          $elems.push(this);
        });
      });

      return $elems;
    }
  });


////////////////////////////////////////
// Show/Hide, non-animated

  Half$.fn.extend({

    hide: function(){
      return this.each(function(){ this.style.display = 'none'; });
    },

    show: function(){
      return this.each(function(){ this.style.display = ''; });
    }
  });


////////////////////////////////////////
// Events

  Half$.fn.extend({

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

/*
    click: function(callback){
      return this.on('click',callback);
    }
*/

  });


////////////////////////////////////////
// Clone

  Half$.fn.extend({
    clone: function(){
      var $elems = Half$();
      this.each(function(){
        $elems.push(this.cloneNode(true));
      });
      return $elems;
    }
  });


////////////////////////////////////////
// Get Width / Height


  Half$.fn.extend({

    height: function(){ return this[0].clientHeight; },
    outerHeight: function(){ return this[0].offsetHeight; },

    width: function(){ return this[0].clientWidth; },
    outerWidth: function(){ return this[0].offsetWidth; }

  });

////////////////////////////////////////
// Offset & Position

  Half$.fn.extend({

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

    offsetParent: function(){ return Half$(this[0].offsetParent); }
  });



////////////////////////////////////////
// AJAX

  function ajaxRequest(opts){

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

  Half$.extend({
    ajax: function(url,opts){
      if ( arguments.length === 1 ) { opts = arguments[0]; }
      else { opts.url = url || opts.url; }
      return ajaxRequest(opts);
    },

    get: Half$.ajax,

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
// noConflict to remove Half$ if the original $ is needed;
  var _$ = window.$;

  Half$.noConflict = function(){
    if ( window.$ === Half$ ) { window.$ = _$; }
    return Half$;
  };

  // Set Half$ up in the global space to be used by other scripts
  window.$ = window.Half$ = Half$;

}(window,document));