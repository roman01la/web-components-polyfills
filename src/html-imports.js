(function (scope) {

    if ('import' in document.createElement('link')) { return; }

    Array.prototype.forEach.call(document.querySelectorAll('link[rel="import"]'), function (importElement) {

        (function() {

            var importEl = importElement;

            var xhr = new XMLHttpRequest();

            xhr.open('GET', importEl.getAttribute('href') && importEl.getAttribute('href'));
            xhr.onload = function() {

                if (xhr.status === 200) {

                    importEl.import = document.implementation.createHTMLDocument('import');
                    importEl.import.body.innerHTML = xhr.responseText;

                    if (!scope.ShadowDOMCSS.support) { scope.ShadowDOMCSS.shim(importEl); }

                    var importScripts = importEl.import.body.querySelectorAll('script');

                    Array.prototype.forEach.call(importScripts, function (importScript, index) {

                        (function() {

                            var scriptIndex = index,
                                script = document.createElement('script');

                            script.currentScript = importScript;
                            script.import = importEl.import;

                            if ('btoa' in window) {

                                script.src = 'data:text/javascript;base64,' +
                                            btoa(script.currentScript.textContent);
                            } else {

                                script.src = 'data:text/javascript;charset=utf-8,' +
                                            encodeURIComponent(script.currentScript.textContent);
                            }

                            script.onload = function() {

                                this.parentNode.removeChild(script);

                                if (scriptIndex === importScripts.length - 1) {

                                    importEl.onload && importEl.onload();
                                }
                            };

                            document.head.appendChild(script);
                        })();
                    });

                }
            };

            xhr.send();

        })();
    });
})(window);
