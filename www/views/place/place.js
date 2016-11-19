angular.module('App')
.config(function ($stateProvider) {
    $stateProvider.state('place', {
        url: '/places/:place_id',
        controller: 'PlaceController as vm',
        templateUrl: 'views/place/place.html',
        /*resolve: {
            Place: function ($http, $stateParams) {
                var url = 'https://neozork-apis.herokuapp.com/easycardapium/place?place_id=' + $stateParams.place_id;
                return $http.get(url);
            }
        }*/
    });
})
.controller('PlaceController', function ($scope, $ionicLoading, $ionicActionSheet, $http, $stateParams) {
    var vm = this;
     
    $ionicLoading.show();

    var url = 'https://neozork-apis.herokuapp.com/easycardapium/place?place_id=' + $stateParams.place_id;
    $http.get(url).then(function(response) {
        vm.place = response.data.result;
        $ionicLoading.hide();
    });
    
    //vm.place = Place.data.result;
    
    $scope.$on('$ionicView.afterEnter', function() {
      $ionicLoading.hide();
    });
    
    vm.openSheet = function () {
        var sheet = $ionicActionSheet.show({
            titleText: 'Share',
            buttons: [
                {text: 'Twitter'},
                {text: 'Facebook'},
                {text: 'Email'},
            ],
            cancelText: 'Cancel',
            buttonClicked: function (index) {
                switch(index) {
                    case 0:
                        window.open('https://twitter.com/intent/tweet?text=' + 
                        encodeURIComponent('Nice place! ' + vm.place.url));
                        break;
                    case 1:
                        window.open('https://www.facebook.com/sharer/sharer.php?u=' + vm.place.url);
                        break;
                    case 2:
                        window.open('mailto:?subject=' + encodeURIComponent('Nice place!') + '&body=' + vm.place.url);
                        break;
                }
                sheet();
            }
        });  
    };
});