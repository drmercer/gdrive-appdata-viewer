var gds = require('gdrive-simple');

var gdsInit = gds.init({
    clientId: "262230741042-6pk925ik2nrmpkp7ekb35r149p1om5t9.apps.googleusercontent.com",
    scopes: [
        "https://www.googleapis.com/auth/drive.appdata",
    ],
});

angular
.module('myApp', [])
.controller('myCtrl', myCtrl);

function myCtrl($scope) {
	$scope.test = "Hello world!";
	gdsInit.then(() => {
    gds.listenForSignInChange(isSignedIn => {
			console.log("isSignedIn:", isSignedIn);
		});
		$scope.test = "GDS initialized";
		$scope.$apply();
	});
}
