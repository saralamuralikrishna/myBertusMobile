angular.module('starter.services', [])
.factory('Search', function searchService($http, $q, $window, appSettings) {
    var service = {};

    var showError = function(msg) {
        toaster.pop({
            type: 'error',
            title: 'Error',
            body: msg,
            showCloseButton: true
        });
    };

    service.search = function(filter) {
        var baseUri = appSettings.baseURI; //'http://apimobile-test.azurewebsites.net';
        var deferred = $q.defer();
        var url = baseUri + '/api/articles/';
        var req = {
            method: 'POST',
            url: url,
            withCredentials: true,
            headers: { 'Authorization': 'Bearer ' + $window.localStorage['authenticationtoken'], 'Content-Type': 'application/json;charset=UTF-8' },
            data: filter
        };

        $http(req)
            .success(function(data, status, headers) {
                deferred.resolve(headers('Location'));
            })
            .error(function(errorPayload) {
                console.log(errorPayload);
                deferred.reject(errorPayload);
            });

        return deferred.promise;
    };

    service.getArticles = function(location) {
        var deferred = $q.defer();
        var req = {
            method: 'GET',
            url: location,
            headers: { 'Authorization': 'Bearer ' + $window.localStorage['authenticationtoken']},
            withCredentials: true
        };

        $http(req)
            .success(function(payload) {
                deferred.resolve(payload);
            })
            .error(function(errorPayload) {
                deferred.reject(errorPayload);
            });

        return deferred.promise;
    }

    return service;
})


.factory('Login', function ($http, $q, $window, appSettings) {
    var loginfunc = function (userName, password) {
        var baseUri =appSettings.baseURI;  // 'http://apimobile-test.azurewebsites.net';
        var deferred = $q.defer();
        var url = baseUri + '/Token';
        var loginData = {
            userName: userName,
            password: password
        };
        var req = {
            method: 'POST',
            url: url,
            data: 'userName=' + userName + '&password=' + password + '&grant_type=password',
            withCredentials: true
        };

        $http(req)
            .success(function (data, status, headers, cfg) {
                $window.localStorage['username'] = userName;
                $window.localStorage['authenticationtoken'] = data.access_token;
                deferred.resolve(data);
            })
            .error(function (errorPayload) {
                //console.log(errorPayload);
                deferred.reject(errorPayload);
            });
        return deferred.promise;
    };

    var getUserName = function () {
        return $window.localStorage['username'];
    };

    var isUserLoggedIn = function () {
        if ($window.localStorage['username'] && $window.localStorage['authenticationtoken']) {
            return true;
        }

        return false;
    };

    var logout = function () {
        $window.localStorage['username'] = null;
        $window.localStorage['authenticationtoken'] = null;
    };

    return {
        login: loginfunc,
        getUserName: getUserName,
        isUserLoggedIn: isUserLoggedIn,
        logout: logout
    };
})

.factory('ArticleDetail', function($q, $window,$http, appSettings){
    var service = {};

    service.getArticleDetails = function(articleNumber){
        var baseUri = appSettings.baseURI;
        var deferred = $q.defer();
        var url = baseUri + '/api/article/' + articleNumber;
        var req = {
            method: 'GET',
            url: url,
            withCredentials: true,
            headers: { 'Authorization': 'Bearer ' + $window.localStorage['authenticationtoken'] }
        };
        $http(req)
            .success(function (data, status, headers, cfg) {
                console.log(data);
                deferred.resolve(data);
            })
            .error(function(errorPayload) {
                deferred.reject(errorPayload);
            });
        return deferred.promise;
    };
    return service;

})

.factory('WishList', function ($http, $q, $window, appSettings) {
        var getCount = function() {
            var baseUri = appSettings.baseURI; //'http://apimobile-test.azurewebsites.net';
            var deferred = $q.defer();
            var url = baseUri + '/api/wishlist/count';
            var req = {
                method: 'GET',
                url: url,
                withCredentials: true,
                headers: { 'Authorization': 'Bearer ' + $window.localStorage['authenticationtoken'] }
            };

            //var req = {
            //    url: 'https://localhost:44303/Account/LoginService', 
            //    method: 'POST',
            //    data: 'userName=' + userName + '&password=' + password
            //}

            $http(req)
                .success(function (data, status, headers, cfg) {
                    console.log(data);
                    //$window.localStorage['username'] = userName;
                    //$window.localStorage['authenticationtoken'] = data.access_token;
                    deferred.resolve(data);
                })
                .error(function(errorPayload) {
                    //console.log(errorPayload);
                    deferred.reject(errorPayload);
                });
            return deferred.promise;
        };

        return {
            getCount : getCount
        }
    })
.factory('Chats', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
        id: 0,
        name: 'Ben Sparrow',
        lastText: 'You on your way?',
        face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
    }, {
        id: 1,
        name: 'Max Lynx',
        lastText: 'Hey, it\'s me',
        face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
    }, {
        id: 2,
        name: 'Adam Bradleyson',
        lastText: 'I should buy a boat',
        face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
    }, {
        id: 3,
        name: 'Perry Governor',
        lastText: 'Look at my mukluks!',
        face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
    }, {
        id: 4,
        name: 'Mike Harrington',
        lastText: 'This is wicked good ice cream.',
        face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
    }];

    return {
        all: function () {
            return chats;
        },
        remove: function (chat) {
            chats.splice(chats.indexOf(chat), 1);
        },
        get: function (chatId) {
            for (var i = 0; i < chats.length; i++) {
                if (chats[i].id === parseInt(chatId)) {
                    return chats[i];
                }
            }
            return null;
        }
    };
});
