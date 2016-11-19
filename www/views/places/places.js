angular.module('App')
.config(function($stateProvider) {
    $stateProvider.state('places', {
        url: '/places',
        controller: 'PlacesController as vm',
        templateUrl: 'views/places/places.html'
    });
})
.controller('PlacesController', function($http, $scope, $ionicLoading, Geolocation, $ionicHistory, Types, $state) {
    var vm = this;
    
    if (!Geolocation.data.geometry || !Geolocation.data.geometry.location) {
        $state.go('location');
        return;
    }
    
    var base = 'https://neozork-apis.herokuapp.com/easycardapium/places?location=' + Geolocation.data.geometry.location.lat + ',' + Geolocation.data.geometry.location.lng;
    var token = (token == undefined) ? '' : token;
    vm.canLoad = true;

    //var base = 'http://phonegap-filipe1309.c9users.io/apis/easycardapium/places?location=' + Geolocation.geometry.location.lat + ',' + Geolocation.geometry.location.lng;
    //var base = 'https://civinfo-apis.herokuapp.com/civic/places?type=park&location=' + Geolocation.geometry.location.lat + ',' + Geolocation.geometry.location.lng;
    
    vm.places = (vm.places == undefined) ? [] : vm.places;
    
    vm.load = function load() {
        $ionicLoading.show();
        var url = base;
        var query = [];
        angular.forEach(Types, function (type) {
            if (type.enabled === true) {
                query.push(type.type.toLowerCase());
            }
        });
        
        url += '&query=' + query.join('|');
        
        if (token) {
          url += '&token=' + token;
        }
        $http.get(url).then(function handleResponse(response) {
            vm.places = vm.places.concat(response.data.results);
            token = response.data.next_page_token;
            
            if (!response.data.next_page_token) {
                vm.canLoad = false;
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $ionicLoading.hide();
        });
    };
    
    $scope.$on('$ionicView.beforeEnter', function() {
      var previous = $ionicHistory.forwardView();
      if (!previous || previous.stateName != 'place') {
          token = '';
          vm.canLoad = false;
          vm.places = [];
          //vm.load();
      }
      vm.load();
    });
    
    /*vm.load();
    $scope.$on('$ionicView.beforeLeave', function() {
      $ionicLoading.show();
    });*/
});

/*
.config(function($httpProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
})
*/