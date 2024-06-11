/*
 * ******************************************************************************************************
 *
 *  ES5 GA. Parses all <a> tags on the page and tracks outbound links, download & mailto's.
 *  To add/remove file types just edit the folowing: var fileTypes = ['.pdf', '.doc', '.xls']
 *
 *  @author   Chip Moeser
 *  @date     Tue May 22 13:36:00 EDT 2018
 *
 * ******************************************************************************************************
 */

document.addEventListener("DOMContentLoaded", function() {
  //Parse all of the links on a page and if it's a external domain, file download or mailto add GA tracking
  if (typeof ga !== "undefined") {

    var anchors = document.getElementsByTagName("a");
    var func = function(e) {
      var linkUrl = e.target.href;

      if (linkUrl.indexOf('mailto:') !== -1) {
        makeMailTo(e);
      } else if (checkIfFileDownload(linkUrl)){
        e.preventDefault();
        makeDownload(e);
      } else {
        e.preventDefault();
        makeHref(e);
      }
    };

    for (var i = 0; i < anchors.length; i++) {
      var elem = anchors[i];

      if((elem.getAttribute('href') !== null) && checkAddTracking(elem.getAttribute('href'))) {
          // add click function trackingClick
          elem.onclick = func;
      }
    }
  }
});

// only add tracking click to external url's pdf's and mailto's
function checkAddTracking(linkUrl) {
  var addTrackingCall = false;

  if (linkUrl.indexOf('mailto:') !== -1) {
    addTrackingCall = true;
  } else if (checkIfFileDownload(linkUrl)) {
    addTrackingCall = true;
  } else if (checkIsExternal(linkUrl)) {
    addTrackingCall = true;
  }

  return addTrackingCall;
}

function checkIfFileDownload(_link) {
  var isFileDownload = false;
  var fileTypes = ['.pdf', '.doc', '.xls']

  for (var i = 0; i < fileTypes.length; i++) {
    if(_link.indexOf(fileTypes[i]) !== -1) {
      isFileDownload = true;
    }
  }

  return isFileDownload;
}

function checkIsExternal(linkUrl) {
  var isExternal = false;
  var thisDomain = document.domain;
  var thisProtocol = window.location.protocol.replace(":", "");
  var str = "^" + thisProtocol + "?://([^/?#]+)(?:[/?#]|$)";
  var rgex = new RegExp(str, "i");

  var matches = linkUrl.match(rgex);
  var domain = matches && matches[1];

  if (!(domain === thisDomain) && domain !== null) {
    // console.log('isExternal: ')
    isExternal = true
  }

  return isExternal;
}

function makeHref(e) {
  // console.log('Make href: ', e.target.href)
    ga("send", "event", "outbound", "click", e.target.href);
    setTimeout(function() {
      window.location =  e.target.href;
    }, 250);
}

function makeMailTo(e) {
  var mailTO = e.target.href.slice(e.target.href.indexOf(':')+1);
  // console.log('Make mailto call: ', mailTO);
  ga('send','event','mailto','click', mailTO);
}

function makeDownload(e) {
  // console.log('Make file download call: ', e.target.href);
  ga('send','event','download','click', e.target.href);
  setTimeout(function() {
    window.location =  e.target.href;
  }, 250);
}
