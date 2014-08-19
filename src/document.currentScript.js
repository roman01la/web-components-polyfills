/*************************************
 * `document.currentScript` polyfill *
 *************************************/

(function() {

  // Inspect the polyfill-ability of this browser
  var needsPolyfill = !("currentScript" in document);
  var canDefineGetter = document.__defineGetter__;
  var canDefineProp = typeof Object.defineProperty === "function" &&
    (function() {
      var result;
      try {
        Object.defineProperty(document, "_xyz", {
          value: "blah",
          enumerable: true,
          writable: false,
          configurable: false
        });
        result = document._xyz === "blah";
        delete document._xyz;
      }
      catch (e) {
        result = false;
      }
      return result;
    })();

  var hasStack = (function() {
    var result = false;
    try {
      throw new Error();
    }
    catch (err) {
      result = typeof err.stack === "string" && !!err.stack;
    }
    return result;
  })();


  // This page's URL
  var pageUrl = window.location.href;

  // Live NodeList collection
  var scripts = document.getElementsByTagName("script");

  // Get script object based on the `src` URL
  function getScriptFromUrl(url) {
    if (typeof url === "string" && url) {
      for (var i = 0, len = scripts.length; i < len; i++) {
        if (scripts[i].src === url) {
          return scripts[i];
        }
      }
    }
    //return undefined;
  }

  // If there is only a single inline script on the page, return it; otherwise `undefined`
  function getSoleInlineScript() {
    var script;
    for (var i = 0, len = scripts.length; i < len; i++) {
      if (!scripts[i].src) {
        if (script) {
          return undefined;
        }
        script = scripts[i];
      }
    }
    return script;
  }

  // Get the currently executing script URL from an Error stack trace
  function getScriptUrlFromStack(stack, skipStackDepth) {

    var url, matches, remainingStack,
        ignoreMessage = typeof skipStackDepth === "number";
    skipStackDepth = ignoreMessage ? skipStackDepth : (typeof _currentScript.skipStackDepth === "number" ? _currentScript.skipStackDepth : 0);
    if (typeof stack === "string" && stack) {
      if (ignoreMessage) {
          matches = stack.match(/((?:http[s]?|file):\/\/[\/]?.+?\/[^:\)]*?)(?::\d+)(?::\d+)?/);
      }
      else {
        matches = stack.match(/^(?:|[^:@]*@|.+\)@(?=http[s]?|file)|.+?\s+(?: at |@)(?:[^:\(]+ )*[\(]?)((?:http[s]?|file):\/\/[\/]?.+?\/[^:\)]*?)(?::\d+)(?::\d+)?/);
        if (!(matches && matches[1])) {
          matches = stack.match(/\)@((?:http[s]?|file):\/\/[\/]?.+?\/[^:\)]*?)(?::\d+)(?::\d+)?/);
          if (matches && matches[1]) {
            url = matches[1];
          }
        }
      }

      if (matches && matches[1]) {
        if (skipStackDepth > 0) {
          remainingStack = stack.slice(stack.indexOf(matches[0]) + matches[0].length);
          url = getScriptUrlFromStack(remainingStack, (skipStackDepth - 1));
        }
        else {
          url = matches[1];
        }
      }
    }
    return url;
  }

  // Get the currently executing `script` DOM element
  function _currentScript() {
    // Yes, this IS actually possible
    if (scripts.length === 0) {
      return;  //return undefined;
    }

    if (scripts.length === 1) {
      return scripts[0];
    }

    if ("readyState" in scripts[0]) {
      for (var i = scripts.length; i--; ) {
        if (scripts[i].readyState === "interactive") {
          return scripts[i];
        }
      }
    }

    if (document.readyState === "loading") {
      return scripts[scripts.length - 1];
    }

    if (scripts[0].src.match(/data:text\/javascript/)) {
        return scripts[0];
    }

    if (hasStack) {
      try {
        throw new Error();
      }
      catch (err) {
        console.log(scripts[0])
        // NOTE: Cannot use `err.sourceURL` or `err.fileName` as they will always be THIS script
        var url = getScriptUrlFromStack(err.stack);
        var script = getScriptFromUrl(url);
        if (!script && url === pageUrl) {
          script = getSoleInlineScript();
        }
        return script;
      }
    }

    //return undefined;
  }

  // Configuration
  _currentScript.skipStackDepth = 1;



  // Add the "private" property for testing, even if the real property can be polyfilled
  document._currentScript = _currentScript;

  // Polyfill it!
  if (needsPolyfill) {
    if (canDefineProp) {
      Object.defineProperty(document, "currentScript", {
        get: _currentScript,
        enumerable: true,
        configurable: false
      });
    }
    else if (canDefineGetter) {
      document.__defineGetter__("currentScript", _currentScript);
    }
  }

})();
