function calendarController($scope) {
    $scope.config = new Date(2013, 4, 25);
}
angular.module("calendar", []).directive('miniCalendar', function($parse) {
    return {
        restrict: "E",
        templateUrl: "../views/template.html",
        transclude: true,
        controller: function($scope) {
            $scope.currentDate = new Date();
            $scope.prev = function() {
                $scope.mCalDate = new Date($scope.mCalDate.getFullYear(), $scope.mCalDate.getMonth() - 1, $scope.mCalDate.getDay());
            };
            $scope.next = function() {
                $scope.mCalDate = new Date($scope.mCalDate.getFullYear(), $scope.mCalDate.getMonth() + 1, $scope.mCalDate.getDay());
            };
            $scope.selecting = false;
            $scope.selectDate = function() {
                $scope.selecting = !$scope.selecting;
            };
            $scope.selectDay = function(day) {
                $scope.mCalDate = day.date;
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
            mCalDate: '='
        },
        compile: function(element, attrs) {
            var modelAccessor = $parse(attrs.mCalDate);
            return function(scope, element, attrs, controller) {
                var calculateCalendar = function() {
                    scope.currentDate = Math.abs(scope.mCalDate.getDate() - 1) + '/' + Math.abs(scope.mCalDate.getMonth() + 1) + '/' + scope.mCalDate.getFullYear();
                    if (!scope.weeks.length > 0 || scope.weeks[0].days[6].date.getMonth() != scope.mCalDate.getMonth()) {
                        var firstDayOfMonth = new Date(scope.mCalDate.getFullYear(), scope.mCalDate.getMonth(), 1).toDateString().split(' ');
                        var totalDays = new Date(scope.mCalDate.getFullYear(), scope.mCalDate.getMonth() + 1, 0).getDate();
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
                                    dayName: scope.days[new Date(scope.mCalDate.getFullYear(), scope.mCalDate.getMonth(), h + 1).getDay()].day,
                                    day: ++h,
                                    date: new Date(scope.mCalDate.getFullYear(), scope.mCalDate.getMonth(), h + 1)
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
                        scope.currentYear = scope.mCalDate.getFullYear();
                        scope.currentMonth = scope.mCalDate.toDateString().split(' ')[1];
                    }
                }
                calculateCalendar();
                scope.$watch('mCalDate', function(val) {
                    calculateCalendar();
                });
            };

        }
    };
});