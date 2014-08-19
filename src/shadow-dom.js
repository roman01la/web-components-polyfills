(function() {

    if ('createShadowRoot' in HTMLElement.prototype) { return; }

    HTMLElement.prototype.createShadowRoot = function() {

        return this.shadowRoot = this;
    };

})();
