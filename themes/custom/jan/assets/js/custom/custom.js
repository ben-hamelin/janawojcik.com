/*Hide and Seek Nav JS*/

(function () {
  var header = document.querySelector("#header");
  var headroom = new Headroom(header, {
    tolerance: {
      down: 0,
      up: 0
    },
    offset: 190
  });
  headroom.init();
})();
