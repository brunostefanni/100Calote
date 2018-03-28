function search(value, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].id === parseInt(value)) {
            return myArray[i];
        }
    }
}

angular.module('app.controllers', []) .constant("CONSTANTES", {
        'url': 'https://backends.herokuapp.com/api/' //'http://localhost:8080/api/' //
    })
     
.controller('loginCtrl', function($rootScope,$scope,$filter,$state,$ionicPopup,$ionicNavBarDelegate,RequestService,CONSTANTES,$translate) {
	//Verificar idioma
	var idioma = localStorage.getItem('idioma');
	if (!idioma){
		if (navigator.globalization){
			navigator.globalization.getPreferredLanguage(
				function (language) {
					if (language.value.toUpperCase() !== 'PT-BR'){
						localStorage.setItem('idioma','EN');
						$translate.use('EN');
					}else{
						localStorage.setItem('idioma','PT-BR');						
					}				
				},
				function () {}
			  );
		}
	}else{
		$translate.use(idioma);
	}	
	//

    $ionicNavBarDelegate.showBackButton(false);
    $scope.lembrar = true;
	
	$scope.verificaEnter = function (t){
		if (t.charCode === 13){
			$scope.login();
		}
	}
    
    var usuario = localStorage.getItem('usuario');
    if (usuario){
        $rootScope.usuario = usuario;
        $state.go('menu.devedores', {}, {reload:true});		
        return;
    }
    
    $scope.login = function() {
        if (!$scope.email || !$scope.senha) {
            $ionicPopup.alert({
                title: $filter('translate')('atencao'),
				template: $filter('translate')('erroValidacao')
            });
            return;   
        }
        
        RequestService.async('POST',
                            CONSTANTES.url + 'usuario/login',
                            {'email': $scope.email, 'senha':$scope.senha},
                            {'Content-type': 'application/json'}
                            ).then(function(d) {
								if (d===null){
									$ionicPopup.alert({
                                            title: $filter('translate')('atencao'),
											template: $filter('translate')('erro')
                                        });
                                        return;
								}
								
                                if (d == 'ok') {                                    
                                    $rootScope.usuario = $scope.email;
                                    
                                    if ($scope.lembrar === true) {
                                        localStorage.setItem('usuario',$scope.email);
                                    }   
                                    $state.go('menu.devedores', {}, {reload:true});
                                }else{
                                        $ionicPopup.alert({
                                            title: $filter('translate')('atencao'),
											template: $filter('translate')('erroUsuario')
                                        });
                                        return;
                                }
                                
                            });            
    }
    
})
   
.controller('signupCtrl', function($rootScope,$ionicNavBarDelegate,$scope,$state,$ionicPopup,RequestService,CONSTANTES,$translate,$filter) {
$scope.usuario= {};
$scope.criar = function(){
    RequestService.async('POST',
            CONSTANTES.url + 'usuarios',
            $scope.usuario,
            {'Content-type': 'application/json'}
            ).then(function(d) {                                
                if (d === 'ok') {                                    
                    $rootScope.usuario = $scope.usuario.email;                    
                    localStorage.setItem('usuario', $scope.usuario.email);                       
                    $state.go('menu.devedores', {}, {reload:true});
                }else{
                        $ionicPopup.alert({
                            title: $filter('translate')('atencao'),
							template: $filter('translate')('erroEmail')
                        });
                        return;
                }                
            });
};
})
   
.controller('devedoresCtrl', function($rootScope,$scope,$ionicModal,$filter, $ionicPopup,$state,$window,RequestService,$timeout,$ionicLoading,CONSTANTES,ionicMaterialMotion,$translate,$filter) {
	if (navigator.globalization){
			navigator.globalization.getNumberPattern(
			function (pattern) {
				$scope.moeda = pattern.symbol;
				$scope.total = $filter('translate')('total') + ' ' + $scope.moeda;
			},
			function () {},
			{type:'currency'}
		);	
	}else{
		$scope.moeda = 'R$';
		$scope.total = $filter('translate')('total') + ' ' + $scope.moeda;
	}
	
	$scope.showLoading = function() {
		$ionicLoading.show({
			template: $filter('translate')('carregando')
		});
	};
	$scope.hideLoading = function(){
		$ionicLoading.hide();
	};

    if (!$rootScope.usuario) {        
		$rootScope.usuario = localStorage.getItem('usuario');
        //$state.go('login', {}, {reload:true});
        //return;
    }    
	
	/*$timeout(function () {
		ionicMaterialMotion.fadeSlideInRight();
	}, 300);*/
    
    $ionicModal.fromTemplateUrl('my-modal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	  }).then(function(modal) {
		$scope.modal = modal;
	  });
	  $scope.openModal = function(id) {
        var dados = id.split('_');
        $scope.item = search(dados[1], $scope.datas[dados[0]].Detalhes);//$scope.datas[id];//
        var ano = new Date($scope.item.data).getFullYear();
        var mes = new Date($scope.item.data).getMonth();
        var dia = new Date($scope.item.data).getDate()
		$scope.editData = new Date(ano, mes, dia);        
                
		$scope.modal.show();               
	  };
	  $scope.closeModal = function() {
		$scope.item = {};
		$scope.modal.hide();
	  };
	  //Cleanup the modal when we're done with it!
	  $scope.$on('$destroy', function() {
		$scope.modal.remove();
	  });
      $scope.salvar = function(){
        //$scope.item.data = $scope.editData;
        RequestService.async('PUT',
                            CONSTANTES.url + 'dividas',
                            $scope.item,
                            {'Content-type': 'application/json'}
                            ).then(function(d) {                                                                                                
                                if (d !== "ok") {
                                    $ionicPopup.alert({
                                        title: $filter('translate')('atencao'),
                                        template: $filter('translate')('erro')
                                    });
                                    return;
                                }
                                atualizar();
                                $scope.closeModal(); 
                                $window.location.reload();
                            });               
      };
      
      $scope.quitar = function(){
        var confirmPopup = $ionicPopup.confirm({
            title: $filter('translate')('confirmacao'),
            template: $filter('translate')('quitar'),
        });

        confirmPopup.then(function(res) {
            if(res) {		   
                RequestService.async('DELETE',
                            CONSTANTES.url + 'dividas',
                            $scope.item,
                            {'Content-type': 'application/json'}
                            ).then(function(d) {
                                if (d===null){
									$ionicPopup.alert({
                                            title: $filter('translate')('atencao'),
                                            template: $filter('translate')('erro')
                                        });
                                        return;
								}
                                if (d !== 'ok') {                                                                    
                                    $ionicPopup.alert({
                                        title: $filter('translate')('atencao'),
                                        template: $filter('translate')('erro')
                                    });                                        
                                }
                                atualizar();
                                $scope.closeModal();
                                $window.location.reload();
                            });
            }
            else
            {
                atualizar();
            }
        });
                       
      };
      
    var atualizar = function(){		
		$scope.showLoading();
        try {
            RequestService.async('GET',
                            CONSTANTES.url + 'dividas/devendo/' + $rootScope.usuario,
                            null,
                            {'Content-type': 'application/json'}
                            ).then(function(d) {
								$scope.hideLoading();
                                $scope.data = d;                                
                                if (d) {
                                     localStorage.setItem('devedores',JSON.stringify(d));
                                     $scope.datas = JSON.parse(localStorage.getItem('devedores'));
									 $timeout(function () {
											ionicMaterialMotion.fadeSlideInRight();
										}, 300);
                                }else{
                                        $ionicPopup.alert({
                                            title: $filter('translate')('atencao'),
											template: $filter('translate')('erro')
                                        });
                                        
                                        if (localStorage.getItem('devedores'))                                        
                                            $scope.datas = JSON.parse(localStorage.getItem('devedores'));
                                        return;
                                }                                
                            });
        } catch (error) {
            $ionicPopup.alert({
                        title: $filter('translate')('atencao'),
						template: $filter('translate')('erro')
                    });
        }finally{
           $scope.$broadcast('scroll.refreshComplete'); 
        }
        
    };
     $scope.doRefresh = function() {
        atualizar(); 
     };
     
    atualizar();
    
    $scope.novaDespesa=function(){
      $state.go('menu.novo', {}, {reload:true});  
    };
})
   
.controller('novoCtrl', function($rootScope,$scope,$state,$ionicNavBarDelegate,$ionicPopup,$cordovaContacts,$ionicPlatform, RequestService,CONSTANTES,$translate,$filter) {
    $scope.item = {};
    $scope.item.cobranca = 'M';
    $scope.item.email = $rootScope.usuario;
    $ionicNavBarDelegate.showBackButton(true);
    $scope.salvar = function (){	
        $scope.item.data = Date.now();         
        RequestService.async('POST',
                            CONSTANTES.url + 'dividas',
                            $scope.item,
                            {'Content-type': 'application/json'}
                            ).then(function(d) {
                                if (d !== 'ok') {
                                     $ionicPopup.alert({
                                        title: $filter('translate')('atencao'),
                                        template: $filter('translate')('erro')
                                    });
                                    return;
                                }
                                $scope.item = {};
                                $ionicNavBarDelegate.back();
                                return;
                            });
    };
	
	$scope.getAllContacts = function() {
		alert("vai" );
		try{
			$cordovaContacts.find({filter: ''}).then(function(result) {
				alert(result);
				$scope.contacts = result;
			}, function(error) {
				alert("ERROR: " + error);
			});
		}catch(error){
			alert(error);
		}
		alert("ok" );
		$scope.pesquisarAgenda = true;
		$scope.inserirDados = false;
	  };

  $scope.findContactsBySearchTerm = function (searchTerm) {
	var opts = {                                           //search options
	  filter : searchTerm,                                 // 'Bob'
	  multiple: true,                                      // Yes, return any contact that matches criteria
	  fields:  [ 'displayName', 'name' ],                   // These are the fields to search for 'bob'.
	  desiredFields: [id]    //return fields.
	};

	if ($ionicPlatform.isAndroid()) {
	  opts.hasPhoneNumber = true;         //hasPhoneNumber only works for android.
	};

	$cordovaContacts.find(opts).then(function (contactsFound) {
	  $scope.contacts = contactsFound;
	});
  }

  $scope.pickContactUsingNativeUI = function () {
	$cordovaContacts.pickContact().then(function (contactPicked) {
	  $scope.contact = contactPicked;
	})
  }  
  
  document.getElementById('fab-add').remove();

})

.controller('devendoCtrl',function($rootScope,$scope,$ionicModal,$state,$ionicPopup,$ionicLoading,$timeout,RequestService,CONSTANTES,ionicMaterialMotion,$translate,$filter){
	$scope.showLoading = function() {
		$ionicLoading.show({
			template: $filter('translate')('carregando')
		});
	};
	$scope.hideLoading = function(){
		$ionicLoading.hide();
	};
	
    if (!$rootScope.usuario) {        
        $state.go('login', {}, {reload:true});
        return;
    }
    
    $scope.descricao = null;
    
    $ionicModal.fromTemplateUrl('my-modal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	  }).then(function(modal) {
		$scope.modal = modal;
	  });
	  $scope.openModal = function(id) {
        $scope.showProtestar = false;
        $scope.descricao = null;
        
        var dados = id.split('_');
        $scope.item = search(dados[1], $scope.datas[dados[0]].Detalhes);    
		$scope.modal.show();
	  };
	  $scope.closeModal = function() {
        $scope.showProtestar = false;
		$scope.item = {};
		$scope.modal.hide();
	  };
	  //Cleanup the modal when we're done with it!
	  $scope.$on('$destroy', function() {
        $scope.showProtestar = false;
        $scope.modal.remove();
	  });
      
    var atualizar = function(){
		$scope.showLoading();
		try {
			RequestService.async('GET',
                            CONSTANTES.url + 'dividas/devedor/' + $rootScope.usuario,
                            null,
                            {'Content-type': 'application/json'}
                            ).then(function(d) {
								$scope.hideLoading();
                                $scope.data = d;                                
                                if (d) {
                                     localStorage.setItem('devedores',JSON.stringify(d));
                                     $scope.datas = JSON.parse(localStorage.getItem('devedores'));
									 
									$timeout(function () {
										ionicMaterialMotion.fadeSlideInRight();
									}, 300);
                                }else{
                                        $ionicPopup.alert({
                                            title: $filter('translate')('atencao'),
											template: $filter('translate')('erro')
                                        });

                                        if (localStorage.getItem('devedores'))
                                            $scope.datas = JSON.parse(localStorage.getItem('devedores'));
                                        return;
                                }
                            });
		} catch (error) {
            $ionicPopup.alert({
                        title: $filter('translate')('atencao'),
                        template: $filter('translate')('erro')
                    });
        }finally{
           $scope.$broadcast('scroll.refreshComplete'); 
        }
    };
    
    
    $scope.protestar =function() {
        $scope.showProtestar = true;
    };
    
    $scope.enviar = function(){
        if (!$scope.item.argumento) {
             $ionicPopup.alert({
                title: $filter('translate')('atencao'),
				template: $filter('translate')('erroValidacao')
            });
            return;
        }
        
        RequestService.async('POST',
                            CONSTANTES.url + 'dividas/protestar/' + $scope.item.id,
                            $scope.item,
                            {'Content-type': 'application/json'}
                            ).then(function(d) {
                                $scope.data = d;                                
                                if (true) {
                                     
                                }
                               $ionicPopup.alert({
                                            title: $filter('translate')('sucesso'),
                                            template: $filter('translate')('protestada')
                                        });
                               $scope.closeModal();
                               atualizar(); 
                            });
                            
    };
    
     $scope.doRefresh = function() {
        atualizar(); 
     };
    
    
    atualizar();
})

.controller('LogoutController', function($rootScope,$scope,$ionicPopup,$state,$translate,$filter) {
    var confirmPopup = $ionicPopup.confirm({
		 title: $filter('translate')('sucesso'),
		 template: $filter('translate')('sair')
		});

		confirmPopup.then(function(res) {
		 if(res) {		   
		    localStorage.clear();
		    $rootScope.usuario = null;
            $state.go('login', {}, {reload:true});
            //$location.url('/login');
		 }
         else
         {
             $state.go('menu.devedores', {}, {reload:true});
             //$location.url('/devedores'); 
         }
		});
})
 
 
 .controller('configController', function($rootScope,$scope,$ionicPopup,$state,$translate,$filter) {	
    $scope.changeLanguage = function () {		
		$translate.use($scope.language);
	};
	
	$scope.salvar = function(){
		localStorage.setItem('idioma',$scope.language);
		$ionicPopup.alert({
					title: $filter('translate')('sucesso'),
					template: $filter('translate')('dados')
				});
	};
})

.controller('sobreCtrl', function($scope, $stateParams,$translate,$filter) {
	//if(typeof analytics !== undefined) { analytics.trackView("sobre"); }
	
	$scope.facebookShare=function(){     
		window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint($filter('translate')('msgCompartilhar'), null /* img */, null /* url */, 'Basta colar o texto para compartilhar!', null, function(errormsg){console.log(errormsg)});
	}
	$scope.whatsappShare=function(){
		window.plugins.socialsharing.shareViaWhatsApp($filter('translate')('msgCompartilhar'), null /* img */, "https://play.google.com/store/apps/details?id=br.com.brunostefanni.semcalote" /* url */, null, function(errormsg){alert("Problema ao compartilhar, favor tente novamente")});
	};
	$scope.twitterShare=function(){
		window.plugins.socialsharing.shareViaTwitter($filter('translate')('msgCompartilhar'), null /* img */, 'https://play.google.com/store/apps/details?id=br.com.brunostefanni.semcalote', null, function(errormsg){alert("Problema ao compartilhar, favor tente novamente")});
	};
	$scope.OtherShare=function(){
		window.plugins.socialsharing.share($filter('translate')('msgCompartilhar'), null, null, 'https://play.google.com/store/apps/details?id=br.com.brunostefanni.semcalote');
	};
})