(function (scope) {

    /* Do not apply polyfill if HTML Imports is supported */
    if ('import' in document.createElement('link')) { return; }

    var documentHead = document.querySelector('head');

    /* Process each import */
    Array.prototype.forEach.call(document.querySelectorAll('link[rel="import"]'), function (importEl) {

        // var importEl = importElement;

        /* Fetch import */
        var xhr = new XMLHttpRequest();
        xhr.open('GET', importEl.getAttribute('href') && importEl.getAttribute('href'));
        xhr.onreadystatechange = function() {

            if (xhr.readyState === 4 && xhr.status === 200) {

                /* Create and store document */
                importEl['import'] = document.createDocumentFragment('import');

                var importBody = document.createElement('body');
                importEl['import'].appendChild(importBody);

                importBody.innerHTML = xhr.responseText;

                /* Shim Shadow DOM CSS selectors if doesn't supported */
                if (!scope.ShadowDOMCSS.support) { scope.ShadowDOMCSS.shim(importEl); }

                /* Handle JavaScript from import document.
                 * Load and execute external scripts first, then inline */
                var importScripts = importBody.querySelectorAll('script'),
                    loadingScripts = 0,
                    inlineScriptsCache = [];

                Array.prototype.forEach.call(importScripts, function (importScript) {

                    var scriptSrc = importScript.getAttribute('src');

                    /* Handle external script */
                    if (scriptSrc) {

                        /* Create execution stack for following inline scripts */
                        inlineScriptsCache.push([]);

                        loadingScripts++;

                        var script = document.createElement('script');
                        script.src = scriptSrc;

                        /* As soon as external script loaded,
                         * execute following stack of inline scripts */
                        script.onload = function() {

                            var callStack = inlineScriptsCache[
                                    inlineScriptsCache.length - loadingScripts];

                            for (var i = 0, ln = callStack.length; i < ln; i++) {

                                handleInlineScript(importEl,
                                    importScripts, callStack[i]);
                            }

                            loadingScripts--;
                        };

                        documentHead.appendChild(script);
                    }

                    /* Handle inline script */
                    else {

                        /* Execute script if no external loading */
                        if (!loadingScripts) {

                            handleInlineScript(importEl, importScripts, importScript);
                        }

                        /* Put script into current execution stack */
                        else {

                            inlineScriptsCache[loadingScripts - 1].push(importScript);
                        }
                    }
                });

            }
        };

        xhr.send();
    });

    function handleInlineScript (importEl, importScripts, importScript) {

        var script = document.createElement('script');

        script.currentScript = importScript;
        script['import'] = importEl['import'];

        if ('btoa' in window) {

            script.src = 'data:text/javascript;base64,' +
                        btoa(script.currentScript.textContent);
        } else {

            script.innerHTML = script.currentScript.innerHTML;
        }

        script.onload = function() { this.parentNode.removeChild(script); };

        documentHead.appendChild(script);
    }
})(window);
