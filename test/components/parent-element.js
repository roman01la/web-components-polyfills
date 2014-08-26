(function (document, currentScript, ownerDocument) {

  var ParentElement = Object.create(HTMLElement.prototype);

  ParentElement.createdCallback = function() {

    var shadow = this.createShadowRoot();

    var template = ownerDocument.querySelector('#template') ||
                    currentScript.import.querySelector('#template');

    template.content ?
    shadow.appendChild(template.content.cloneNode(true)) :
    shadow.innerHTML = template.innerHTML;

  };

  document.registerElement('parent-element', { prototype: ParentElement });

})(document, document.currentScript, document.currentScript.ownerDocument);
