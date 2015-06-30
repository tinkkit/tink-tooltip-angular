# Tink tooltip Angular directive

v1.0.0

## What is this repository for?

The Tink tooltip Angular provides a scaffold for a directive or service that can easily work with Tink.

Tink is an in-house developed easy-to-use front end framework for quick prototyping and simple deployment of all kinds of websites and apps, keeping a uniform and consistent look and feel.

## Setup

### Prerequisites

* nodeJS [http://nodejs.org/download/](http://nodejs.org/download/)
* bower: `npm install -g bower`

### Install

1. Go to the root of your project and type the following command in your terminal:

   `bower install tink-tooltip-angular --save`

2. Add the following files to your project:

   `<link rel="stylesheet" href="bower_components/tink-core/dist/tink.css" />` (or one of the Tink themes)

   `<script src="bower_components/tink-tooltip-angular/dist/tink-tooltip-angular.js"></script>`

3. Add `tink.tooltip` to your app module's dependency.

   `angular.module('myApp', ['tink.tooltip']);`



----------



## How to use

### tink-tooltip

To use this directive you have to add `tink-tooltip` to the element of your choice and assign the content to `tink-tooltip-template`.

You can use the `tink-tooltip-align` options to position the tooltip container to your liking.

```html
<button tink-tooltip="" tink-tooltip-align="bottom" tink-tooltip-template="views/tooltip-template.html">Open tooltip</button>
```

### Options

Attr | Type | Default | Details
--- | --- | --- | ---
tink-tooltip-align | `string` | `''` | Alignment of the tooltip to the element. Possible values are `left`, `center`, `right`, `top` or `bottom.
tink-tooltip-template | `string` | `''` | The url of the tooltip template.

### Example

A working example can be found in [the Tink documentation](http://tink.digipolis.be/#/docs/directives/popover#example).

## Contribution guidelines

* If you're not sure, drop us a note
* Fork this repo
* Do your thing
* Create a pull request

## Who do I talk to?

* Jasper Van Proeyen - jasper.vanproeyen@digipolis.be - Lead front-end
* Tom Wuyts - tom.wuyts@digipolis.be - Lead UX
* [The hand](https://www.youtube.com/watch?v=_O-QqC9yM28)
