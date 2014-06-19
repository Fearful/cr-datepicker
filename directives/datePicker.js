function exampleController($scope) {
    $scope.newDate = new Date(2013, 4, 25);
}
var datePicker = angular.module("example", [])
var datePickerTemplate = [
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
    '<th ng-repeat="day in days"><span ng-bind="day.day"></span></th>',
    '</tr></thead>',
    '<tbody><tr ng-repeat="week in weeks">',
    '<td ng-repeat="d in week.days"><a ng-bind="d.day" ng-click="selectDay(d)">1</a></td>',
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
            $scope.currentDate = new Date();
            $scope.prev = function() {
                $scope.dateValue = new Date($scope.dateValue.getFullYear(), $scope.dateValue.getMonth() - 1, 2);
            };
            $scope.next = function() {
                $scope.dateValue = new Date($scope.dateValue.getFullYear(), $scope.dateValue.getMonth() + 1, 2);
            };
            $scope.selecting = false;
            $scope.selectDate = function() {
                $scope.selecting = !$scope.selecting;
            };
            $scope.selectDay = function(day) {
                $scope.dateValue = day.date;
            };
            $scope.currentMonth = '';
            $scope.currentYear = '';
            $scope.days = [{
                day: "Sun"
            }, {
                day: "Mon"
            }, {
                day: "Tue"
            }, {
                day: "Wed"
            }, {
                day: "Thu"
            }, {
                day: "Fri"
            }, {
                day: "Sat"
            }];
            $scope.weeks = [];
        },
        scope: {
            dateValue: '='
        },
        compile: function(element, attrs) {
            var modelAccessor = $parse(attrs.dateValue);
            return function(scope, element, attrs, controller) {
                var calculateCalendar = function() {
                    var filteredDay;
                    var filteredMonth;
                    if (scope.dateValue.getDate() == 1) {
                        filteredDay = new Date(scope.dateValue.getFullYear(), scope.dateValue.getMonth(), 0).getDate();
                        filteredMonth = scope.dateValue.getMonth();
                        scope.dateValue.setMonth(Math.abs(scope.dateValue.getMonth() - 1));
                    } else {
                        filteredDay = Math.abs(scope.dateValue.getDate() - 1);
                        filteredMonth = Math.abs(scope.dateValue.getMonth() + 1);
                    }
                    scope.currentDate = filteredDay + '/' + filteredMonth + '/' + scope.dateValue.getFullYear();
                    if (!scope.weeks.length > 0 || scope.weeks[0].days[6].date.getMonth() != scope.dateValue.getMonth()) {
                        var firstDayOfMonth = new Date(scope.dateValue.getFullYear(), scope.dateValue.getMonth(), 1).toDateString().split(' ');
                        var totalDays = new Date(scope.dateValue.getFullYear(), scope.dateValue.getMonth() + 1, 0).getDate();
                        var firstDayIndex;
                        for (var i in scope.days) {
                            if (scope.days[i].day == firstDayOfMonth[0]) {
                                firstDayIndex = i;
                            }
                        }
                        var allDays = [];
                        var h = 0;
                        for (i = 0; i < totalDays + 6; i++) {
                            if (i >= firstDayIndex && (h + 1) <= totalDays) {
                                allDays.push({
                                    dayName: scope.days[new Date(scope.dateValue.getFullYear(), scope.dateValue.getMonth(), h + 1).getDay()].day,
                                    day: ++h,
                                    date: new Date(scope.dateValue.getFullYear(), scope.dateValue.getMonth(), h + 1)
                                });
                            } else {
                                allDays.push({});
                            }
                        }
                        var calendar = []
                        var chunk = 7;
                        for (i = 0, allDays.length; i < allDays.length; i += chunk) {
                            calendar.push({
                                week: calendar.length,
                                days: allDays.slice(i, i + chunk)
                            });
                        }
                        scope.weeks = calendar;
                        scope.currentYear = scope.dateValue.getFullYear();
                        scope.currentMonth = scope.dateValue.toDateString().split(' ')[1];
                    }
                }
                calculateCalendar();
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
      $templateCache.put('datePicker.tmpl', datePickerTemplate);
    }
  ]);