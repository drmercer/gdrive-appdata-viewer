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

	function load(promise) {
		$scope.loading = true;
		return promise.then(result => {
			$scope.loading = false;
			$scope.$apply();
			return result;
		});
	}

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
		load(showFolderContents(folder)
		.then(() => {
			$scope.stack.push(folder);
		}))
	};

	function showFolderContents(folder) {
		return Promise.all([
			folder.listFiles({getAll:true}),
			folder.listFolders({getAll:true}),
		]).then(data => {
			$scope.files = data[0].files;
			$scope.folders = data[1].files;
		});
	}

	$scope.goUp = () => {
		const dest = $scope.stack.slice(-2)[0];
		load(showFolderContents(dest)
		.then(() => {
			// Remove last element
			$scope.stack.pop();
		}))
	}
}
