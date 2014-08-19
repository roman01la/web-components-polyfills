# Lightweight Web Components polyfills

`build/web-components-polyfills.min.js` lightly polyfills HTML Imports, Shadow DOM, `document.createElement` and `document.currentScript`.

With this polyfill it is possible to create lightweight and compatible (mobile & IE9+) Web Components according to W3C standards, so the code will run great in both oudated and moder browsers versions.

## Usage

Include polyfill on the page and import your components using `<link rel="import">` element.

```
<html>
  <head>

    <link rel="import" href="/path/to/component.html" />

  </head>
  <body>

    <my-custom-element></my-custom-element>

    <script src="/build/web-components-polyfills.min.js"></script>

  </body>
</html>
```

## Creating web components

Name your component, for example `custom-element`. Create HTML file `custom-element.html`.

There's a `template` HTML element which stores component's template:

```
<template id="template">

  <h1>Hola!</h1>

</template>
```

In order to use your component on the page you should register and initialize it:

<small>follow comments</small>

```
<script>

  /* Wrap code with self-executing anonymous function
   * and pass global document into the scope.
   * This will prevent components conflicts,
   * because the code is running on the parent page. */
  (function (document, currentScript) {

      /* Get import document scope */
      var ownerDocument = currentScript.ownerDocument;

      /* Create component from HTMLElement */
      var CustomElement = Object.create(HTMLElement.prototype);

      /* Initialize component immediately after it was created within the parent scope */
      CustomElement.createdCallback = function() {

          /* Create encapsulation entry point for component's structure */
          var shadow = this.createShadowRoot();

          /* Get template !!! THIS CODE IS REQUIRED FOR COMPATIBILITY REASON !!! */
          var template = ownerDocument.querySelector('#template') ||
                          currentScript.import.querySelector('#template');

          /* Put template inside of the component
           * !!! THIS CODE IS REQUIRED FOR COMPATIBILITY REASON !!! */
          template.content ?
          shadow.appendChild(template.content.cloneNode(true)) :
          shadow.innerHTML = template.innerHTML;
      };

      /* Register component within the parent scope */
      document.registerElement('my-custom-element', { prototype: CustomElement });

  })(document, document.currentScript);

</script>
```

## Development

Make sure you have installed *Node.js* runtime and `grunt-cli` module globally.

Run `npm install` within repository directory. Make you edits and run `grunt` to build minified polyfill runtime.

## To-Do

- Shadow DOM CSS selectors polyfill
- Nested HTML imports support
- Tests
