datePicker-AngularJS-directive
=======================

AngularJs Directive, date picker, with no dependencies, plain JS.

Still in progress~ (I've still to define what should the behaviour be in some special use-cases. It is functional though! :D )

Usage: You simply pass a date value (this is the scope object that you will use) and done!
```html
<date-picker type="text" date-Value="newDate" />
```
Or:
```html
<div cr-datepicker date-Value="newDate" ></div>
```
You can navigate through month and years. You can also jump to today and select a date you wish to change to.

Pure Js, only dependable (it's a directive) of angularJS.
This directive was build on top of certain knowledge, we use the compile function instead of the link function because we are not dealing with live-data when calculating the calendar, as we are in the compile cycle of the directive inside of angular's lifecycle, we can manipulate and create dom objects (weeks & days), with almost none performance cost. 

We only watch for the change of the date to calculate the calendar again. This directive was meant to allow the user to select a date in a pop-up like calendar. The scope variable passed to the date-value attribute will change as the date is changed and selected.

I remind you all again, this is a WIP.

Demo: <a href="http://labs.coderevolution.com.ar/datePicker/views/index.html" > DatePicker Demo</a>
