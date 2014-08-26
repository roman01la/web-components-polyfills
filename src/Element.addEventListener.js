//addEventListener polyfill 1.0 / Eirik Backer / MIT Licence
(function (scope, document) {

  if (scope.addEventListener) { return };   //No need to polyfill

  function docHijack (p) {

    var old = document[p]

    document[p] = function (v) { return addListen( old(v) ) };
  }

  function addEvent (on, fn, self) {

    return (self = this).attachEvent('on' + on, function (e) {

      var e = e || scope.event;

      e.preventDefault  = e.preventDefault  || function() { e.returnValue = false };
      e.stopPropagation = e.stopPropagation || function() { e.cancelBubble = true };

      fn.call(self, e);
    });
  }

  function addListen (obj, i) {
    if (i = obj.length) {

      while (i--) {

        obj[i].addEventListener = addEvent;
      }
    } else {

      obj.addEventListener = addEvent;
    }

    return obj;
  }

  addListen([document, scope]);

  if ('Element' in scope) {

    //IE8
    scope.Element.prototype.addEventListener = addEvent;
  } else {

    //IE < 8
    //Make sure we also init at domReady
    document.attachEvent('onreadystatechange', function() { addListen(document.all); });
    docHijack('getElementsByTagName');
    docHijack('getElementById');
    docHijack('createElement');
    addListen(document.all);
  }
})(window, document);
