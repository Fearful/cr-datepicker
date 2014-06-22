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
    '<table>',
    '<thead><tr>',
    '<td colspan="7" ng-bind="currentMonth +  currentYear"></td>',
    '</tr><tr>',
    '<td ng-click="prevYear()">&lt;&lt;</td>',
    '<td ng-click="prev()">&lt;</td>',
    '<td colspan="3" ng-click="today()">Today</td>',
    '<td ng-click="next()">&gt;</td>',
    '<td ng-click="nextYear()">&gt;&gt;</td></tr><tr>',
    '<td  ng-repeat="day in days" ng-bind="day"></td>',
    '</tr></thead>',
    '<tbody><tr ng-repeat="week in weeks">',
    '<td  ng-repeat="d in week.days" ng-bind="d.day" ng-click="selectDay(d)" ng-class="{active:d.selected}"></td>',
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
            $scope.prev = function() {
                $scope.dateValue = new Date($scope.dateValue).setMonth(new Date($scope.dateValue).getMonth() - 1);
            };
            $scope.prevYear = function() {
                $scope.dateValue = new Date($scope.dateValue).setYear(new Date($scope.dateValue).getFullYear() - 1);
            };
            $scope.next = function() {
                $scope.dateValue = new Date($scope.dateValue).setMonth(new Date($scope.dateValue).getMonth() + 1);
            };
            $scope.nextYear = function() {
                $scope.dateValue = new Date($scope.dateValue).setYear(new Date($scope.dateValue).getFullYear() + 1);
            };
            $scope.today = function() {
                $scope.dateValue = new Date();
            };
            $scope.selectDate = function() {
                $scope.selecting = !$scope.selecting;
            };
            $scope.selectDay = function(day) {
                $scope.dateValue = day.date;
                $scope.selecting = !$scope.selecting;
            };
            $scope.days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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
                    var firstDayOfMonth = new Date(jsYear, jsMonth, 1).toDateString().split(' ')[0];
                    var firstDayIndex = scope.days.indexOf(firstDayOfMonth);
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
                scope.$watch('dateValue', function(val) {
                    calculateCalendar();
                });
            };

        }
    };
});
datePicker.run([
    '$templateCache',
    function($templateCache) {
        $templateCache.put('datePicker.tmpl', datePickerTemplate); // This saves the html template we declared before in the $templateCache
    }
]);