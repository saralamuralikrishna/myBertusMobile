angular.module('starter.controllers', ['ngCordova'])
.filter('currency', function (numberFilter) {
    return function currencyFilter(input, currencyCode) {
        switch (currencyCode) {
            case 'EUR':
                return '€ ' + numberFilter(input, 2);
            case 'CZK':
                return 'Kč ' + numberFilter(input, 0);
            case 'HUF':
                return 'Ft ' + numberFilter(input, 0);
            default:
                return currencyCode + ': ' + input;
        }
    }
}).filter('monetaryAmount', function (currencyFilter) {
    return function monetaryAmountFilter(monetaryAmount) {
        return currencyFilter(monetaryAmount.Amount, monetaryAmount.Currency);
    }
})
.controller('DashCtrl', function ($scope) { })

.controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
        Chats.remove(chat);
    };
})

.controller('MainCtrl', function ($scope, Login, $state) {
    $scope.Logout = function () {
        Login.logout();
        $state.go('tab.home');
    };
})

.controller('WishListCtrl', function ($scope, Login, $state, WishList, $cordovaBarcodeScanner) {
    if (Login.isUserLoggedIn()) {
        $state.go('main.wishlist');
    }
    $scope.userName = Login.getUserName();
    $scope.wishListCount = 0;
    $scope.barCodeData = '';


    $scope.doRefresh = function () {
        WishList.getCount().then(function (payload) {
            $scope.wishListCount = payload;
        }, function (errorPayload) {
            $scope.wishListCount = errorPayload;
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.scan = function () {
        $cordovaBarcodeScanner.scan().then(function (imageData) {
            $scope.barCodeData = 'Image Text -: ' + imageData.text + ' Image format -:' + imageData.format + ' cancelled ->' + imageData.cancelled;
        }, function (error) {
            $scope.barCodeData = 'Error:' + error;
        });
    };

        $scope.doRefresh();
    })

.controller('HomeCtrl', function ($scope, Login, $state, $cordovaBarcodeScanner, $ionicPlatform) {
    $scope.data = {
        username: '',
        password: ''
    };
    if (Login.isUserLoggedIn()) {
        $state.go('main.wishlist');
    }
    $scope.login = function () {
        Login.login($scope.data.username, $scope.data.password)
        .then(function (payload) {
            $state.go('main.wishlist');
        }, function (errorPayload) {
            alert(errorPayload);
        })
    };

    $scope.scan = function () {
        $ionicPlatform.ready(function () {
            $cordovaBarcodeScanner.scan().then(function (imageData) {
                $scope.barCodeData = 'Image Text -: ' + imageData.text + ' Image format -:' + imageData.format + ' cancelled ->' + imageData.cancelled;
            }, function (error) {
                $scope.barCodeData = 'Error:' + error;
            });
        });

    };

})

.controller('SearchCtrl', function ($scope, Login, $state, $cordovaBarcodeScanner, $ionicPlatform, Search) {
    var filterObject = {};
    if (!Login.isUserLoggedIn) {
        $state.go('tab.home');
    }

    $scope.Articles = [];

    filterObject.ActivatedSince = 0;
    filterObject.Artist = '';
    filterObject.Title = '';
    filterObject.SelectedProductTypes = 'CD,CD-S,DUALD,SACD,BLRY,DVD,LP,12in,BOOK,MRCH';
    filterObject.SelectedAvailability = 'Available,Direct,NoLongerAvailable,NotAvailableYet,PreOrder,Soon';
    filterObject.OnlyBertusLabel = false;
    filterObject.OnlyUpcomingReleases = false;
    filterObject.Page = 0;
    filterObject.SelectedGenre = 'All';
    $scope.Test = {};
    $scope.Test.searchBarcode = '';
    $scope.searchResult = '';
    $scope.search = function () {
        $scope.Articles = [];
        filterObject.Artist = $scope.Test.searchBarcode;
        Search.search(filterObject).then(function (payload) {
            $scope.searchResult = payload;
            Search.getArticles(payload).then(function (payload) {
                $scope.searchResult = payload;
                $scope.Articles = payload.Collection;
            }, function (errorPayload) {
                $scope.searchResult = errorPayload;
            })
        }, function (errorPayload) {
            $scope.searchResult = errorPayload;
        });
    };

    $scope.scan = function () {
        $ionicPlatform.ready(function () {
            $cordovaBarcodeScanner.scan().then(function (imageData) {
                $scope.searchResult = 'Image Text -: ' + imageData.text + ' Image format -:' + imageData.format + ' cancelled ->' + imageData.cancelled;
                $scope.Test.searchBarcode = imageData.text;
                if($scope.Test.searchBarcode && $scope.Test.searchBarcode.length == 12 && !isNaN(parseFloat($scope.Test.searchBarcode)) && isFinite($scope.Test.searchBarcode))
                {
                    $scope.Test.searchBarcode = '0' + $scope.Test.searchBarcode;
                }
            }, function (error) {
                $scope.searchResult = 'Error:' + error;
            });
        });

    };

})

.controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function ($scope) {
    $scope.settings = {
        enableFriends: true
    };
});
