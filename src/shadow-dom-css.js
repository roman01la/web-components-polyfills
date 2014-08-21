(function (scope) {

  /* Assume Shadow DOM is supported */
  scope.ShadowDOMCSS = { support: true };

  /* Check for Shadow DOM support */
  if ('createShadowRoot' in HTMLElement.prototype) { return; }

  /* If not — set to false */
  scope.ShadowDOMCSS.support = false;

  /* Shadow DOM CSS polyfill */
  scope.ShadowDOMCSS.shim = function (importEl) {

    var importStyles;

    /* Get styles from template. Depends on <template> element support */
    if ('HTMLTemplateElement' in window) {

        importStyles = importEl.import.body.querySelector('template')
            .content.querySelectorAll('style')
    } else {

        importStyles = importEl.import.body.querySelectorAll('style');
    }

    /* Process styles */
    Array.prototype.forEach.call(importStyles, function (importStyle) {

      /* Get custom element tag name */
      var scopeSelector = importStyle.textContent
                              .match(/\/\*! *([a-z,-]+) *\*\//)[1];

      /* Get host selector */
      var hostSelectorFn = importStyle.textContent.match(/(:host)(\((.*)\))/);

      /* Convert host selector */
      if (hostSelectorFn) {

        importStyle.textContent =
            importStyle.textContent.replace(RegExp(hostSelectorFn[1], 'g'), scopeSelector);

        importStyle.textContent =
            importStyle.textContent.replace(
              RegExp(hostSelectorFn[2].replace(/[()]/g, '\\$&'), 'g'), hostSelectorFn[3]);

      } else {

        importStyle.textContent =
          importStyle.textContent.replace(/:host/, scopeSelector);
      }

      /* Encapsulate styles with scope selector */
      var cssText = '';

      document.head.appendChild(importStyle);

      Array.prototype.forEach.call(importStyle.sheet.cssRules, function (rule) {

        var scopedSelector = rule.selectorText;

        if (!scopedSelector.match(scopeSelector)) {

            scopedSelector = scopeSelector + ' ' + scopedSelector;
        }

        cssText += scopedSelector + ' { ' + rule.style.cssText + ' } ';
      });

      /* Apply polyfilled styles */
      importStyle.textContent = cssText;
    });
  };
})(window);
