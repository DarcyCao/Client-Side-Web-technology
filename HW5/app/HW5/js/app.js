(function () {
    "use strict";

    /*
     * An array of US state abbreviations -> names. This should ideally
     * be data in an external resource like a DB or something, but for simplicity
     * hard coding here.
     */
    var usStates = {
        AL: "ALABAMA",
        AK: "ALASKA",
        AS: "AMERICAN SAMOA",
        AZ: "ARIZONA",
        AR: "ARKANSAS",
        CA: "CALIFORNIA",
        CO: "COLORADO",
        CT: "CONNECTICUT",
        DE: "DELAWARE",
        DC: "DISTRICT OF COLUMBIA",
        FM: "FEDERATED STATES OF MICRONESIA",
        FL: "FLORIDA",
        GA: "GEORGIA",
        GU: "GUAM",
        HI: "HAWAII",
        ID: "IDAHO",
        IL: "ILLINOIS",
        IN: "INDIANA",
        IA: "IOWA",
        KS: "KANSAS",
        KY: "KENTUCKY",
        LA: "LOUISIANA",
        ME: "MAINE",
        MH: "MARSHALL ISLANDS",
        MD: "MARYLAND",
        MA: "MASSACHUSETTS",
        MI: "MICHIGAN",
        MN: "MINNESOTA",
        MS: "MISSISSIPPI",
        MO: "MISSOURI",
        MT: "MONTANA",
        NE: "NEBRASKA",
        NV: "NEVADA",
        NH: "NEW HAMPSHIRE",
        NJ: "NEW JERSEY",
        NM: "NEW MEXICO",
        NY: "NEW YORK",
        NC: "NORTH CAROLINA",
        ND: "NORTH DAKOTA",
        MP: "NORTHERN MARIANA ISLANDS",
        OH: "OHIO",
        OK: "OKLAHOMA",
        OR: "OREGON",
        PW: "PALAU",
        PA: "PENNSYLVANIA",
        PR: "PUERTO RICO",
        RI: "RHODE ISLAND",
        SC: "SOUTH CAROLINA",
        SD: "SOUTH DAKOTA",
        TN: "TENNESSEE",
        TX: "TEXAS",
        UT: "UTAH",
        VT: "VERMONT",
        VI: "VIRGIN ISLANDS",
        VA: "VIRGINIA",
        WA: "WASHINGTON",
        WV: "WEST VIRGINIA",
        WI: "WISCONSIN",
        WY: "WYOMING"
    };

    /*
     * Here we create the module that is referenced by the ng-app directive.
     *
     * See https://docs.angularjs.org/api/ng/function/angular.module
     */
    var app = angular.module('myApp', ["file-data-url", "ngMap", "LocalStorageModule", "ngRoute"]);

    app.config(function ($routeProvider, $locationProvider) {
            $routeProvider.when('/', {
                templateUrl: 'views/contactList.html',
                controller: 'contactListController'
            }).when('/contact', {
                templateUrl: 'views/contact.html',
                controller: 'contactController'
            }).when('/contact/:id', {
                templateUrl: 'views/contact.html',
                controller: 'contactController'
            });
            $locationProvider.html5Mode(false);
            $locationProvider.hashPrefix('!');
        })
        .config(function (localStorageServiceProvider) {
            localStorageServiceProvider
                .setPrefix('08724.hw5');
        })
        .controller('contactListController', function ($scope, localStorageService, $location) {
            $scope.submittedAddresses = [];
            $scope.addContact = function () {
                $location.path('/contact')
            };
            var lskey = localStorageService.keys();
            //for (var key in lskey) {
            //    $scope.submittedAddresses.push(localStorageService.get(key));
            //}
            for (var i = 0; i < lskey.length; i++) {
                var key = lskey[i];
                $scope.submittedAddresses.push(localStorageService.get(key));
            }
            $scope.removeAddress = function (index) {
                var keys = localStorageService.keys();
                var key = keys[index];
                localStorageService.remove(key);
                $scope.submittedAddresses.splice(index, 1);
            };
            $scope.change = function(index) {
                var keys = localStorageService.keys();
                var key = keys[index];
                $location.path('/contact/' + key);
            }
        })
        .controller('contactController', function ($scope, localStorageService, $routeParams, $location) {
            $scope.stateOptions = usStates; //Available via closure
            //var id = $routeParams.id;
            //if (isNaN(id)) {
            //    $scope.address = {};
            //    var keys = localStorageService.keys();
            //    if (keys.length > 0) {
            //        $scope.id = keys.length;
            //    } else {
            //        $scope.id = 0;
            //    }
            //} else {
            //    var keys = localStorageService.keys();
            //    $scope.address = localStorageService.get(keys[id]);
            //}
            var name = $routeParams.id;
            if (typeof (name) == 'undefined') {
                $scope.address = {};
            } else {
                //var keys = localStorageService.keys();
                $scope.address = localStorageService.get(name);
            }
            $scope.submit = function () {
                var name = $scope.address.firstName.toString() + $scope.address.lastName.toString();
                localStorageService.set(name, $scope.address);
                $location.path("");

            };
        });
})();
