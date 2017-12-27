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
	$scope.initializing = true;

	gdsInit.then(() => {
		$scope.initializing = false;
		$scope.$apply();

    gds.listenForSignInChange(isSignedIn => {
			$scope.signedIn = isSignedIn;
			$scope.stack = [];

			if (isSignedIn) {
				$scope.enterFolder(gds.getAppDataFolder());
			}

			$scope.$apply();
		});
	});

	$scope.signIn = gds.signIn;
	$scope.signOut = gds.signOut;

	$scope.enterFolder = folder => {
		Promise.all([
			folder.listFiles({getAll:true}),
			folder.listFolders({getAll:true}),
		]).then(data => {
			$scope.stack.push(folder);
			$scope.files = data[0].files;
			$scope.folders = data[1].files;
			$scope.$apply();
		});
	};
}
