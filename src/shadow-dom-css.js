(function (scope) {

  scope.ShadowDOMCSS = { support: true };

  if ('createShadowRoot' in HTMLElement.prototype) { return; }

  scope.ShadowDOMCSS = {
    support: false,
    shim: function (importEl) {

      var importStyles;

      if ('HTMLTemplateElement' in window) {

          importStyles = importEl.import.body.querySelector('template')
              .content.querySelectorAll('style')
      } else {

          importStyles = importEl.import.body.querySelectorAll('style');
      }

      Array.prototype.forEach.call(importStyles, function (importStyle) {

          var scopeSelector = importStyle.textContent
                                  .match(/\/\*! *([a-z,-]+) *\*\//)[1];

          importStyle.textContent =
              importStyle.textContent.replace(/:host/, scopeSelector);

          var cssText = '';

          document.head.appendChild(importStyle);

          Array.prototype.forEach.call(importStyle.sheet.cssRules, function (rule) {

              var scopedSelector = rule.selectorText;

              if (scopedSelector !== scopeSelector) {

                  scopedSelector = scopeSelector + ' ' + scopedSelector;
              }

              cssText += scopedSelector + ' { ' + rule.style.cssText + ' } ';
          });

          importStyle.textContent = cssText;
      });
    }
  };
})(window);
