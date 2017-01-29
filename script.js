var toLoadFirst= function() {
  console.log("Here");
  if(localStorage.getItem('presentUserStorage') == null){
      // no user is signed in
  } else {
    // user is signedin and he refreshed
    presentUser = JSON.parse(localStorage.getItem('presentUserStorage'));
    console.log("Presentuser from local storage" +presentUser);
  }
};

var app = angular.module('myApp', ['ngRoute']);
var userData = [];
var messagesData = [];
var presentUser = {};

var deletePresentUserLocalStorage = function(){
  localStorage.removeItem("presentUserStorage");
};
// To store users in local storage
var storeUsersInLocalStorage = function( ){
  // sessionStorage.storageName = angular.toJson(userData);
  window.localStorage['userNamesStorage'] = angular.toJson(userData);
   console.log("The user data after storing in local storage: " +userData);
   userData = angular.fromJson(localStorage.userNamesStorage);
}

var storeMessagesInLocalStorage = function(){
  // sessionStorage.storageName = angular.toJson(userData);
  window.localStorage['messagesStorage'] = angular.toJson(messagesData);
   console.log("The messages in the local storage is: " +messagesData);
   messagesData = angular.fromJson(localStorage.messagesStorage);

}

//  Function with takes the email address, gets the index and gets the username
 var getIndex = function(username){
   var index = -1;
   for(var i=0;i<userData.length;i++){
     if(username == userData[i].username){
       index = i;
     }
   }
   return index;
 }

 // Function which takes in email and printsout index
 var getIndexFromEmail = function(email){
   var index = -1;
   for(var i=0;i<userData.length;i++){
     if(email == userData[i].email){
       index = i;
     }
   }
   return index;
 }

app.config(function($routeProvider){
    $routeProvider

     .when('/signup',{
         templateUrl:'signup.html'
     })

    .when('/login',{
      templateUrl:'login.html'
  })
    .when('/profile',{
      templateUrl:'profile.html'
    })

    .otherwise({
      redirectTo:'/login'
    });
});


//----------------------------Global Controller ----------------------------------
app.controller('global-controller',function($scope,$rootScope,$http){
  toLoadFirst();
  $rootScope.onLoad = this.onLoad = function(){
  if(localStorage.getItem('userNamesStorage')==null){
    $http.get("validate.json")
    .then(function(response) {
      userData = response.data;
      storeUsersInLocalStorage();
      });
    } else{
      userData = angular.fromJson(localStorage.userNamesStorage);
    }
    if(localStorage.getItem('messagesStorage')==null){
      $http.get("messages.json")
      .then(function(response) {
        messagesData = response.data;
        storeMessagesInLocalStorage();
        $scope.messages = messagesData;
        console.log("Messages Data"+messagesData);
        });
      } else{
        messagesData = angular.fromJson(localStorage.messagesStorage);

      }

  }
});
//----------------------------End of GlobalController ----------------------------------


//----------------------------Login Controller ----------------------------------
app.controller('loginController', function($scope, $http, $location,$rootScope) {
  toLoadFirst();
  $rootScope.onLoad = this.onLoad = function(){
  if(localStorage.getItem('userNamesStorage')==null){
    $http.get("validate.json")
    .then(function(response) {
      userData = response.data;
      storeUsersInLocalStorage();
      });
    } else{
      userData = angular.fromJson(localStorage.userNamesStorage);
    }
    if(localStorage.getItem('messagesStorage')==null){
      $http.get("messages.json")
      .then(function(response) {
        messagesData = response.data;
        storeMessagesInLocalStorage();
        $scope.messages = messagesData;
        console.log("Messages Data"+messagesData);
        });
      } else{
        messagesData = angular.fromJson(localStorage.messagesStorage);

      }
  }

  console.log("Entered Login Controller");
                //----------Validating Users -------------------
  $scope.validateUsers = function(){
    $scope.presentUserIndex;
    for(var i=0;i<userData.length;i++){
      if(((userData[i].username)==$scope.username) && ((userData[i].password)==$scope.password)){
        presentUserIndex = i;
        console.log(i);
        presentUser =
          userData[i];
          console.log(presentUser);
          window.localStorage['presentUserStorage'] = angular.toJson(presentUser);
         $location.url('/profile');
      }
    }
  };
                //---------- End of Validating Users ---------------

});
//----------------------------End of Login Controller ----------------------------------------

//----------------------------Profile Controller ----------------------------------------
app.controller('profile-controller', function($scope,$http,$rootScope,$location){
  toLoadFirst();
  $rootScope.onLoad = this.onLoad = function(){
  if(localStorage.getItem('userNamesStorage')==null){
    $http.get("validate.json")
    .then(function(response) {
      userData = response.data;
      storeUsersInLocalStorage();
      });
    } else{
      userData = angular.fromJson(localStorage.userNamesStorage);
    }
    if(localStorage.getItem('messagesStorage')==null){
      $http.get("messages.json")
      .then(function(response) {
        messagesData = response.data;
        storeMessagesInLocalStorage();
        $scope.messages = messagesData;
        console.log("Messages Data"+messagesData);
        });
      } else{
        messagesData = angular.fromJson(localStorage.messagesStorage);

      }
  }
  var index;
  var indexemail;
    $scope.loggedUser = presentUser.username;
    $scope.messages = messagesData;
    console.log("$scope.message" + JSON.stringify($scope.messages));

    $scope.username = presentUser.username;
    $scope.password = presentUser.password;
    $scope.firstname = presentUser.firstname;
    $scope.lastname = presentUser.lastname;
    $scope.location = presentUser.location;
    $scope.email = presentUser.email;
    $scope.phone = presentUser.phone;
    $scope.updateInfo = function(){
      // check for username conflict
      userData[presentUserIndex].username= $scope.username;
      userData[presentUserIndex].password= $scope.password;
      userData[presentUserIndex].firstname= $scope.firstname;
      userData[presentUserIndex].lastname= $scope.lastname;
      userData[presentUserIndex].location= $scope.location;
      userData[presentUserIndex].email= $scope.email;
      userData[presentUserIndex].phone=$scope.phone;
      presentUser = userData[presentUserIndex];
      storeInLocalStorage();
  //---------- End of Editting the profile ---------------
    }
    $scope.logout =function(){
      console.log("Logout button is clicked");
      deletePresentUserLocalStorage();
      console.log("present user deleted from local storage");
      $location.url('/login');
    };
    // Reply Button
    $scope.replyButton = function(obj){
      // prefil attributes
      $scope.re = ! ($scope.re);
      console.log("Reply button is clicked")
      index = getIndex(obj.sender);
      $scope.replyEmail = userData[index].email;
      $scope.replySubject = "RE:"+obj.title;
    };
    // Reply - send functionality
    $scope.replySend = function(){
      // var finalIndex = messageData.length+1;
      console.log("Reply-send button is clicked")
      // check email validation
      for(var i=0;i<userData.length;i++){
        if($scope.replyEmail == userData[i].email){
          console.log("Eneter the if loop");
          //create new message object
          console.log("Creating new message object");
          indexEmail = getIndexFromEmail($scope.replyEmail);
          var messageObject = {
            // "_id":finalIndex,
            "recipient":userData[indexEmail].username,
            "sender":presentUser.username,
            "title":$scope.replySubject,
            "description":$scope.replyMessage,
            "created_at":new Date(),
            "important":"0"
          }
          console.log("Message object: "+messageObject)
          //push the object to global message array
          console.log("pushing the object to global message array");
          messagesData.push(messageObject);
          console.log(messagesData);
          //push that to local storage
          console.log("Pushing to local storage");
          storeMessagesInLocalStorage();
          // push that to $scope message for ng-repeat
          console.log("Pushing to ng-repeat messages");
          $scope.messages=messagesData;
          console.log("messages:" +$scope.messages)
        }
    }

    //to hide reply dispplay
    
    };
    //Delete functionality
    $scope.deleteMessage = function(obj2){
      console.log(obj2);
      var x = messagesData.indexOf(obj2);

      // // get index of global msg to deleteMessage
      // ind = obj2._id;
      // cosole.log("The index: "+ind);
      //
      // // splice the global msg array
       messagesData.splice(x,1);
       console.log(messagesData);

      // update the local storage
      storeMessagesInLocalStorage();

      //update UI
      $scope.messages = messagesData;


    };
});
//---------------------------- End of profile-controller ----------------------------------


//----------------------------Signup Controller ------------------------------------------
app.controller('signup-controller',function($scope,$rootScope){
  toLoadFirst();
  $rootScope.onLoad = this.onLoad = function(){
  if(localStorage.getItem('userNamesStorage')==null){
    $http.get("validate.json")
    .then(function(response) {
      userData = response.data;
      storeUsersInLocalStorage();
      });
    } else{
      userData = angular.fromJson(localStorage.userNamesStorage);
    }
    if(localStorage.getItem('messagesStorage')==null){
      $http.get("messages.json")
      .then(function(response) {
        messagesData = response.data;
        storeMessagesInLocalStorage();
        $scope.messages = messagesData;
        console.log("Messages Data"+messagesData);
        });
      } else{
        messagesData = angular.fromJson(localStorage.messagesStorage);

      }
  }
               //---------- Sign Up as a new user ---------------
$scope.signUp = function(){
  console.log("Entered Signup method")
  console.log("Checking"+$scope.username);
   $scope.newUser ={
     "username":$scope.username,
     "password":$scope.password,
     "firstname":$scope.firstname,
     "lastname":$scope.lastname,
     "location":$scope.location,
     "email":$scope.email,
     "phone":$scope.phone
   };
   console.log($scope.newUser);
   console.log("before pushed" +userData);
   userData.push($scope.newUser);
   console.log("new user pushed" +userData);
   storeUsersInLocalStorage();
}
});
//---------------------------- End of Signup Controller ----------------------------------
