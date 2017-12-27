var gds = require('gdrive-simple');

const DEMO_CLIENT_ID = "262230741042-6pk925ik2nrmpkp7ekb35r149p1om5t9.apps.googleusercontent.com";

angular
.module('myApp', [])
.controller('myCtrl', myCtrl);

function myCtrl($scope) {
	$scope.wipClientId = DEMO_CLIENT_ID;
	$scope.siteOrigin = window.location.origin;

	function load(promise) {
		$scope.errorMessage = ""
		$scope.loading = true;
		return promise.then(result => {
			$scope.loading = false;
			$scope.$apply();
			return result;
		}, err => {
			$scope.loading = false;
			showErr(err && err.message)
		});
	}

	window.addEventListener('beforeunload', function() {
		$scope.loading = true;
		$scope.$apply();
	});

	$scope.setClientId = id => {
		load(gds.init({
		    clientId: id,
		    scopes: [
		        "https://www.googleapis.com/auth/drive.appdata",
		    ],
		}).then(() => {
			$scope.clientId = id
		}).then(onGdsInitComplete));
	};

	function onGdsInitComplete() {
		$scope.initializing = false;

    gds.listenForSignInChange(isSignedIn => {
			$scope.signedIn = isSignedIn;
			$scope.stack = [];

			if (isSignedIn) {
				$scope.enterFolder(gds.getAppDataFolder());
			}

			$scope.$apply();
		});
	}

	$scope.signIn = () => load(gds.signIn());
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

	$scope.openFile = file =>
		load(file.read({raw: true}))
				.then(contents => openContentsInNewTab(contents, file.mimeType, file.name))
				.catch(err => showErr(err && err.message));

	function showErr(msg) {
		$scope.errorMessage = "" + msg;
		$scope.$apply();
	}
}

function openContentsInNewTab(contents, type, name) {
	var blob = (contents instanceof Blob) ? contents :
		/* */(typeof contents === "string") ? new Blob([contents], {type}) :
		/* */ (type === "application/json") ? new Blob([JSON.stringify(contents, null, 2)], {type})
		/* ^ to protect alignemnt */        : null;
	if (!blob) {
		throw new Error(`Unrecognized type: ${type} (Contents: ${JSON.stringify(contents)})`);
	}
	var url = URL.createObjectURL(blob);
	window.open(url, name);
}
