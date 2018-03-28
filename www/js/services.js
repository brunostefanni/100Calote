angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('RequestService', ['$http','$ionicLoading',function($http,$ionicLoading){
    var show = function() {
		$ionicLoading.show({
		  template: 'Aguarde...'
		});
	  };
    
    var hide = function(){
		  $ionicLoading.hide();
    };
    try {
        
    
    var myService = {
    async: function(method,url,data,headers) {
        show();
        try {
         var promise = $http({
					  method: method,
					  url: url,
					  data: data,
					  headers: headers
					}).then(function (response) {
                        hide();
                        return response.data;
                    }).catch(function(e) {
						hide();
						return null;
					}); 
        } catch (error) {
          alert('Verifique sua conexão com a internet');
        }        
                    
      // Return the promise to the controller
      return promise;
    }
  };
  } catch (error) {
    console.log(error);   
    }
  return myService;
}]);

