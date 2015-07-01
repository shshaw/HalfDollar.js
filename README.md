# WORK IN PROGRESS

# HalfDollar.js

```
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
```

*A micro replacement for jQuery using modern browser methods.*

There are plenty of times where manually working out bugs and fallbacks with vanilla Javascript can be painful and time consuming, but using 50kb+ worth of jQuery just isn't worth it. Creating a custom build of jQuery with only the desired modules can still leave you with a 30+kb file.

With HalfDollar.js, you can use the familiar jQuery API in modern browsers, but at a fraction of the size (7.7kb minified, 2.7kb gzipped!). The goal is not full feature-parity, but lightweight DOM access.

**Target:** IE9+ and last 2 browser versions

*Inspired by the brilliant [youmightnotneedjquery.com](http://youmightnotneedjquery.com)*

## How To Use

Simply include the minified HalfDollar.js and use it like you would the basic features of jQuery. 

```html
<script src="js/HalfDollar.min.js"></script>
```

If you need support for older browsers like IE8, fallback to jQuery v1! Use Google's Hosted Libraries or change the url to use your own local copy.

```html
<script src="js/HalfDollar.min.js"></script>
<script>
(function(half$,s,u){ if ( !half$ ) { 
  var sc = document.createElement(s); sc.src = u;
  var f = document.getElementsByTagName(s)[0]; f.parentNode.insertBefore(sc, f);
} }(window.half$,'script','https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js'));
</script>
```
Be sure to wrap your code in a DOM ready call `$(function(){ ... });` and HalfDollar.js will queue up your code until the fallback loads. Plugins declared via `$.fn.extend` should also be added to jQuery after it loads.


## API

HalfDollar.js tries to provide API compatibility without becoming bloated. All methods are generally compatible with jQuery's, but may have a few missing features. 

## To Do

- [x] .css
- [x] .filter
- [x] .is
- [ ] .val
- [ ] .trigger
- [ ] .makeArray, .toArray
- [ ] .map, .slice
- [ ] fully test AJAX implementation
- [ ] Separate modules and allow for custom builds
- [ ] .insertBefore, .insertAfter ?
- [ ] .parents ?
- [ ] .next, .prev ?
- [ ] .siblings ?
- [ ] .scrollLeft, .scrollTop ?