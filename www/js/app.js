// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives','ionic-material','ionMdInput','ngAnimate','ngCordova','pascalprecht.translate'])

.config(function ($translateProvider) {
	var translations = {
		"PT-BR": {
			'configuracoes':'Configurações',
			'salvar':'Salvar',
			'notificacoes': 'Receber Notificações',
			'idioma': 'Idioma',
			'editar': 'Editar',
			'devedores': 'Devedores',
			'carregando': 'Aguarde',
			'total': 'Total',
			'erro': 'Erro, verifique sua conexão e tente novamente',
			'sucesso': 'Sucesso',
			'atencao': 'Atenção',
			'erroValidacao': 'Informe todos os dados',
			'erroUsuario': 'Usuário ou Senha inválido(s)',
			'erroEmail':'Email já cadastrado',
			'protestada': 'Dívida protestada, entraremos em contato com quem está te cobrando',
			'dados': 'Configurações salvas',
			'confirmacao' : 'Confirmação',
			'sair': 'Deseja realmente sair?',
			'quitar': 'Deseja realmente quitar?',
			'msgCompartilhar': 'Quer cobrar seus amigos sem perder a amizade? Baixe agora o "100Calote" em https://play.google.com/store/apps/details?id=br.com.brunostefanni.semcalote',
			
			'BUTTON_LANG_EN': 'Inglês',			
			'BUTTON_LANG_PT-BR': 'Português'
		},
		"EN": {
			'configuracoes':'Settings',
			'salvar': 'Save',
			'notificacoes': 'Receive Notifications?',
			'idioma': 'Language',
			'editar': 'Edit',
			'devedores': '',
			'carregando': 'Loading...',
			'total': 'Total',
			'erro': '',
			'atencao': '',
			'sucesso': '',
			'erroValidacao': '',
			'erroUsuario': '',
			'erroEmail':'',
			'protestada': '',
			'dados': '',
			'confirmacao' : '',
			'sair': '',
			'quitar':'',
			'msgCompartilhar': '',
			
			'BUTTON_LANG_EN': 'English',			
			'BUTTON_LANG_PT-BR': 'Portuguese'
		}
	}
	for(lang in translations){
		$translateProvider.translations(lang, translations[lang]);
	}

	$translateProvider.preferredLanguage('PT-BR');
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    setTimeout(function() {
      if(navigator.splashscreen)
          navigator.splashscreen.hide();
    }, 300);
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})