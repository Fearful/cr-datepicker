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
    '<td class="currentDate" colspan="7" ng-bind="displayDate"></td>',
    '</tr><tr class="navigation">',
    '<td ng-click="prevYear()">&lt;&lt;</td>',
    '<td ng-click="prev()">&lt;</td>',
    '<td colspan="3" ng-click="today()">Today</td>',
    '<td ng-click="next()">&gt;</td>',
    '<td ng-click="nextYear()">&gt;&gt;</td></tr><tr>',
    '<td  ng-repeat="day in days" ng-bind="day"></td>',
    '</tr></thead>',
    '<tbody><tr ng-repeat="week in weeks" class="week">',
    '<td  ng-repeat="d in week" ng-click="selectDay(d)" ng-class="{active: d.selected, otherMonth: d.notCurrentMonth}">{{ d.day | date: &#39;d&#39;}}</td>',
    '</tr></tbody>',
    '</table>',
    '</div>',
    '</div>'
].join('\n');
datePicker.directive('crDatepicker', function($parse) {
    return {
        restrict: "AE",
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
                $scope.dateValue = day.day;
                $scope.selecting = !$scope.selecting;
            };
            $scope.days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            $scope.weeks = [];
        },
        scope: {
            dateValue: '='
        },
        link: function(scope, element, attrs) {
            var modelAccessor = $parse(attrs.dateValue);
            if(!scope.dateValue){ scope.dateValue = new Date() };
            var calculateCalendar = function(date) {
                var date = new Date(date || new Date());
                scope.currentDate = date.getDate() + '/' + Math.abs(date.getMonth() + 1) + '/' + date.getFullYear(); //Value that will be binded to the input
                var startMonth = date.getMonth(),
                    startYear = date.getYear();
                date.setDate(1);
                if (date.getDay() === 0) {
                    date.setDate(-6);
                } else {
                    date.setDate(date.getDate() - date.getDay());
                }
                if (date.getDate() === 1) {
                    date.setDate(-6);
                }
                var weeks = [];
                while (weeks.length < 6) { // creates weeks and each day
                    if (date.getYear() === startYear && date.getMonth() > startMonth) break;
                    var week = [];
                    for (var i = 0; i < 7; i++) {
                        week.push({
                            day: new Date(date),
                            selected: new Date(date).setHours(0) == new Date(scope.dateValue).setHours(0) ? true : false,
                            notCurrentMonth: new Date(date).getMonth() != new Date(scope.dateValue).getMonth() ? true : false
                        });
                        date.setDate(date.getDate() + 1);
                    }
                    weeks.push(week);
                }
                scope.weeks = weeks; // Week Array
                scope.displayDate = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()).toDateString().split(' ')[1] + ' ' + date.getFullYear(); // Current Month / Year
            }
            scope.$watch('dateValue', function(val) {
                calculateCalendar(scope.dateValue);
            });
        }
    };
});
datePicker.run([
    '$templateCache',
    function($templateCache) {
        $templateCache.put('datePicker.tmpl', datePickerTemplate); // This saves the html template we declared before in the $templateCache
    }
]);