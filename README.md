# Notice
This is a mirror of https://github.com/markusfalk/tabs because I started on some fixing

tabs
====

Simple Tab Script (AMD, Bower).
Change animation defaults in init();

Additional Features
-------------------

* autoplay via class 'animated-tabs'
* aria-roles support
* animate tab content elements

Usage
-----

```html
<div class="tabs animated-tabs">
  <div class="tab-nav">
    <a href="#" data-rel="tab1">Tab 1</a>
    <a href="#" data-rel="tab2">Tab 2</a>
    <a href="#" data-rel="tab3">Tab 3</a>
  </div>
  <div class="tab-content">
    <div id="tab1" class="tab">
      <p>Tab 1.</p>
    </div>
    <div id="tab2" class="tab">
      <p>Tab 2.</p>
    </div>
    <div id="tab3" class="tab">
      <p>Tab 3.</p>
    </div>
  </div>
</div>
```

Events
------

```javascript
'tabs.opened' // passes next tab navigational element and content
'tabs.animated' // passes .animated-tabs
```

Installation
------------

```shell
bower install markusfalk/tabs
```
