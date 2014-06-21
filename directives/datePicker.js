function exampleController($scope) {
    $scope.newDate = new Date();
}
var datePicker = angular.module("example", []) // Example module
var datePickerTemplate = [ // Template for the date picker, no CSS, pure HTML. The date-picker tag will be replaced by this
    '<div class="datePicker">',
    '<label ng-click="selectDate()">',
    '<input type="text" ng-model="currentDate" disabled>',
    '</label>',
    '<div ng-show="selecting">',
    '<div>',
    '<a><span ng-click="prev()">Prev</span></a>',
    '<a><span ng-click="next()">Next</span></a>',
    '<div>',
    '<span ng-bind="currentMonth">January</span>',
    '<span ng-bind="currentYear"></span>',
    '</div>',
    '</div>',
    '<table>',
    '<thead><tr>',
    '<th ng-repeat="day in days"><span ng-bind="day"></span></th>',
    '</tr></thead>',
    '<tbody><tr ng-repeat="week in weeks">',
    '<td ng-repeat="d in week.days"><a ng-bind="d.day" ng-click="selectDay(d)" ng-class="{active:d.selected}">1</a></td>',
    '</tr></tbody>',
    '</table>',
    '</div>',
    '</div>'
    ].join('\n');
datePicker.directive('datePicker', function($parse) {
    return {
        restrict: "E",
        templateUrl: "datePicker.tmpl",
        transclude: true,
        controller: function($scope) {
            $scope.currentDate = new Date(2000, 0, 2);
            $scope.prev = function() {
                $scope.dateValue = new Date($scope.dateValue).setMonth(new Date($scope.dateValue).getMonth() - 1);
            };
            $scope.next = function() {
                $scope.dateValue = new Date($scope.dateValue).setMonth(new Date($scope.dateValue).getMonth() + 1);
            };
            $scope.selecting = false;
            $scope.selectDate = function() {
                $scope.selecting = !$scope.selecting;
            };
            $scope.selectDay = function(day) {
                $scope.dateValue = day.date;
                $scope.selecting = !$scope.selecting;
            };
            $scope.currentMonth = '';
            $scope.currentYear = '';
            $scope.days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
            $scope.weeks = [];
        },
        scope: {
            dateValue: '='
        },
        compile: function(element, attrs) {
            var modelAccessor = $parse(attrs.dateValue);
            return function(scope, element, attrs, controller) {
                var calculateCalendar = function() {
                    var date = new Date(scope.dateValue);
                        jsDay = date.getDate(),
                        jsMonth = date.getMonth(),
                        jsYear = date.getFullYear(),
                        totalDays = [31, (jsYear % 4 == 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // Calculating the quantity of days in february by it's year
                    if (jsDay == 1) {
                        jsMonth = jsMonth - 1;
                        jsDay = totalDays[jsMonth];
                    } else {
                        jsDay = jsDay - 1;
                    }
                    scope.currentDate = jsDay + '/' + Math.abs(jsMonth + 1) + '/' + jsYear;
                    if (!scope.weeks.length > 0 || scope.weeks[0].days[6].date.getMonth() != jsMonth) {
                        var firstDayOfMonth = new Date(jsYear, jsMonth, 1).toDateString().split(' ');
                        var firstDayIndex;
                        for (var i in scope.days) {
                            if (scope.days[i] == firstDayOfMonth[0]) {
                                firstDayIndex = i;
                            }
                        }
                        var allDays = [];
                        var h = 0;
                        for (i = 0; i < totalDays[jsMonth] + 6; i++) { // How many times it has to iterate to generate the five weeks componing the calendar
                            if (i >= firstDayIndex && (h + 1) <= totalDays[jsMonth]) {
                                allDays.push({
                                    day: ++h,
                                    date: new Date(jsYear, jsMonth, h + 1),
                                    selected: new Date(jsYear, jsMonth, h + 1).setHours(0) == new Date(scope.dateValue).setHours(0, 0, 0, 0) ? true : false
                                });
                            } else {
                                allDays.push({}); // And empty object is pushed when the day is from another month
                            }
                        }
                        var calendar = []; // weeks container
                        var chunk = 7; // Size of the chunk (days of the week)
                        for (i = 0, allDays.length; i < allDays.length; i += chunk) { // We populate the calendar array with week objects that contain the chunk of days we wanted
                            calendar.push({
                                days: allDays.slice(i, i + chunk) // It slices the chunk of days based on the current index
                            });
                        };
                        scope.weeks = calendar;
                        scope.currentYear = jsYear;
                        scope.currentMonth = date.toDateString().split(' ')[1];
                    }
                }
                scope.$watch('dateValue', function(val) {
                    calculateCalendar();
                });
            };

        }
    };
});
datePicker.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('datePicker.tmpl', datePickerTemplate); // This saves the html template we declared before in the $templateCache
    }
  ]);