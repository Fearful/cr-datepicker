cr-datepicker ~ AngularJS Directive
=======================

You can navigate through month and years. You can also jump to today and select a date you wish to change to.

Usage: You simply pass a date value (this is the scope object that you will use) and done!
```html
<cr-datepicker type="text" date-Value="newDate" /></cr-datepicker>
```
Or:
```html
<div cr-datepicker date-Value="newDate" ></div>
```

Pure Js, only dependable (it's a directive) of angularJS.

We only watch for the change of the date to calculate the calendar again. This directive was meant to allow the user to select a date in a pop-up like calendar. The scope variable passed to the date-value attribute will change as the date is changed and selected.

I remind you all again, this is a WIP. Although is functional

Try it!: <a href="http://labs.coderevolution.com.ar/datePicker/views/index.html" > DatePicker Demo</a>
