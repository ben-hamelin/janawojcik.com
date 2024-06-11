
/**
 *  @name ADWBGImageSwap
 *  @desc Dynamically writes css for background images from a data-src-set
 *  @author  Chip Moeser
 *  @example 
 * 
 *   
 * 1) Generate a responsive image in twig via the URI
    {% set _image = {
      '#theme': 'responsive_image',
      '#responsive_image_style_id': 'split_width_image',
      '#uri': content.field_featured_image['#items'].entity.uri.value,
      '#attributes': { alt: content.field_featured_image['#items'].0.alt, class: 'listings__img' }
    } %}

  2)Include the class 'background-image-swap' on the div you want to have responsive image background for and print the generated _image
    <div class="push-nav__BG background-image-swap" {{_image}}>
   
  2) Make sure you have a twig theme file that will output the correct image styles. See Greene, BBL, Pathways. Output will be something like:

  <div class="push-nav__BG background-image-swap"
    <!-- THEME DEBUG -->
    <!-- THEME HOOK: 'responsive_image' -->
    <!-- FILE NAME SUGGESTIONS:
      x responsive-image--style-600x375x1200x750.html.twig
      * responsive-image.html.twig
    -->
    <!-- BEGIN OUTPUT from 'themes/greene/templates/image/responsive-image--style-600x375x1200x750.html.twig' -->
        data-src-set="
                /sites/default/files/styles/1200x750/public/searchImg.jpg?itok=g6Kr8SKJ, all and (min-width: 601px)|
                /sites/default/files/styles/600x375/public/searchImg.jpg?itok=Fqc8VsGO, all and (max-width: 600px)|
        "

    <!-- END OUTPUT from 'themes/greene/templates/image/responsive-image--style-600x375x1200x750.html.twig' -->

    ></div>

   3)  // Include this div which instatiates the module
    <div class="es-module clearfix" data-module="ADWBGImageSwap" data-module-options="{}"></div>
  
 */
!function(e){function t(n){if(s[n])return s[n].exports;var o=s[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var s={};t.m=e,t.c=s,t.d=function(e,s,n){t.o(e,s)||Object.defineProperty(e,s,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var s=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(s,"a",s),s},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="http://greene.local/themes/greene/assets/js/custom/",t(t.s=0)}([function(e,t,s){e.exports=s(1)},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=s(2),o=s(3);document.addEventListener("DOMContentLoaded",function(){var e=document.querySelectorAll(".es-module");new n.Main([o.ADWBGImageSwap],e).init()})},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(e,t){this._modulesLoaded={},this._imports=e,this._esModules=t}return e.prototype.getModulesOnPage=function(e){var t,s,n=[];if(this._esModules.length>0)for(var o=0;o<this._esModules.length;o++){s=this._esModules[o].getAttribute("data-module"),t=this._esModules[o].getAttribute("data-module-options");for(var r=0;r<this._imports.length;r++)e[r].prototype.name()===s&&n.push([s,t])}return n},e.prototype.instantiateModules=function(e){for(var t,s,n=this.getModulesOnPage(e),o=[],r=0;r<e.length;r++){s=Object.create(e[r]).prototype.name();for(var i=void 0,a=0;a<n.length;a++)s===n[a][0]&&(i=a),i>-1&&-1===o.indexOf(s+"-"+a)&&(t=new e[r](JSON.parse(n[i][1])),t.init(),o.push(s),this._modulesLoaded[s+"-"+a]=t)}this._modulesLoaded._length=o.length},e.prototype.modulesLoaded=function(){return this._modulesLoaded},e.prototype.init=function(){this.instantiateModules(this._imports)},e}();t.Main=n},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(){this._bgImages=document.querySelectorAll(".background-image-swap"),this._selectors=[]}return e.prototype.giveElementsID=function(){for(var e=0;e<this._bgImages.length;e++)this._bgImages[e].setAttribute("id","background-image-swap-"+e);this.parseElements()},e.prototype.parseElements=function(){for(var e=this,t=0;t<this._bgImages.length;t++)!function(t){if(null!==e._bgImages[t].getAttribute("data-src-set")){var s=e._bgImages[t].getAttribute("data-src-set").trim(),n=s.split("|").map(function(e){var s;return s={},s["background-image-swap-"+t]=e.trim().split(","),s});e._selectors.push(n)}}(t);this.createStyles()},e.prototype.createStyles=function(){for(var e=0;e<this._selectors.length;e++)for(var t=0;t<this._selectors[e].length;t++){var s=this._selectors[e][t]["background-image-swap-"+e][1],n="@media "+s,o=this._selectors[e][t]["background-image-swap-"+e][0],r="#background-image-swap-"+e+" { background-image:url("+o+"); }";this._styles.sheet.insertRule(n+" { "+r+" } ",t)}},e.prototype.createStyleSheet=function(){this._styles=document.createElement("style"),this._styles.appendChild(document.createTextNode("")),document.head.appendChild(this._styles)},e.prototype.name=function(){return"ADWBGImageSwap"},e.prototype.init=function(){this.createStyleSheet(),this.giveElementsID()},e}();t.ADWBGImageSwap=n}]);
//# sourceMappingURL=adw_bg_image_swap.map