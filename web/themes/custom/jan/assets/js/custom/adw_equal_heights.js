function equalHeights(classToEqualize, resize, byRow) {
  // console.log('equalHeights : classToEqualize: ', classToEqualize, ' resize: ', resize, ' byRow: ', byRow);
  var cName = (classToEqualize !== undefined) ? classToEqualize : 'equal-heights';
  var elements = document.getElementsByClassName(cName);

  if (byRow) {
    var _parse = function (value) {
      // parse value and convert NaN to 0
      return parseFloat(value) || 0;
    };

    var rowItems = getRows(elements);
    var allRowHeights = [];
    // console.log(getRows(elements));
    for (var h = 0; h < rowItems.length; h++) {
      if (rowItems[h].length > 1) {
        var rh = [];
        for (var g = 0; g < rowItems[h].length; g++) {
          var elHeight = rowItems[h][g].clientHeight;
          rh.push(elHeight);
        }
        allRowHeights.push(rh);
      } else {
        var elHeight = rowItems[h].clientHeight;
        allRowHeights.push(elHeight);
      }
    }

    // console.log('allRowHeights: ', allRowHeights);
    for (k = 0; k < rowItems.length; k++) {
      // Only rows with more than 1 item
      if (rowItems[k].length > 1) {
        for (var j = 0; j < rowItems[k].length; j++) {
          rowItems[k][j].style.height = Math.max.apply(Math, allRowHeights[k]) + 'px';

          // Optional: Add show class to prevent FOUC
          /*if(resize === false){
            if(!elements[k][j].classList.contains('show'))
            elements[k][j].className = elements[k][j].className + ' show';
          }*/
        }
      }
    }
  } else {
    var allHeights = [];
    if (resize === true) {
      for (var i = 0; i < elements.length; i++) {
        elements[i].style.height = 'auto';
      }
    }
    for (j = 0; j < elements.length; j++) {
      var elementHeight = elements[j].clientHeight;
      allHeights.push(elementHeight);
    }
    for (k = 0; k < elements.length; k++) {
      elements[k].style.height = Math.max.apply(Math, allHeights) + 'px';
    }
    resize = false;
    // Optional: Add show class to prevent FOUC
    for (var d = 0; d < elements.length; d++) {
      if (resize === false) {
        if (!elements[d].classList.contains('show'))
          elements[d].className = elements[d].className + ' show';
      }
    }
  }
}

function getRows(elements) {
  var tolerance = 1,
    lastTop = null,
    rows = [];

  for (k = 0; k < elements.length; k++) {
    var _that = elements[k],
      top = (_that.offsetTop - ((_that.style.marginTop > '') ? _parse(_that.style.marginTop) : 0)),
      lastRow = rows.length > 0 ? rows[rows.length - 1] : null;

    if (lastRow === null) {
      // first item on the row, so just push it
      rows.push([_that]);
    } else {
      // if the row top is the same, add to the row group
      if (Math.floor(Math.abs(lastTop - top)) <= tolerance) {
        rows[rows.length - 1] = rows[rows.length - 1].concat(_that);
      } else {
        // otherwise start a new row group
        rows.push([_that]);
      }
    }
    // keep track of the last row top
    lastTop = top;
  }
  return rows;
}
