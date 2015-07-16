// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ionictodol', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

  //Projects Business Model(Factory)
.factory('Projects',function(){
  var all=function(){
    var projectString=window.localStorage['projects'];
    if(projectString) return angular.fromJson(projectString);
    return [];
  };
  var save=function(projects){
    window.localStorage['projects']=angular.toJson(projects);
  };
  var newProject=function(projectTitle){
    return{
      title:projectTitle,
      tasks:[]
    };
  };
  var getLastActiveIndex=function(){
    return parseInt(window.localStorage['lastActiveProject']) || 0;
  };
  var setLastActiveIndex=function(index){
    window.localStorage['lastActiveProject']=index;
  };
  return {
    all:all,
    save:save,
    newProject:newProject,
    getLastActiveIndex:getLastActiveIndex,
    setLastActiveIndex:setLastActiveIndex
  };
})

    //todolctrl Controller
.controller('todolctrl', function($scope,$ionicModal,$timeout,$ionicSideMenuDelegate,Projects){
  var createProject=function(projectTitle){
    var newProject=Projects.newProject(projectTitle);
    $scope.projects.push(newProject);
    Projects.save($scope.projects);
    $scope.selectProject(newProject,$scope.projects.length-1);
  };
  $scope.projects=Projects.all();
  $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];
  // Called to create a new project
  $scope.newProject = function() {
    var projectTitle = prompt('Project name');
    if(projectTitle) {
      createProject(projectTitle);
    }
  };
  // Called to select the given project
  $scope.selectProject = function(project, index) {
    $scope.activeProject = project;
    Projects.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };

  // Create our modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope
  });

  $scope.createTask = function(task) {
    if(!$scope.activeProject || !task) {
      return;
    }
    $scope.activeProject.tasks.push({
      title: task.title,
      done:false
    });
    $scope.taskModal.hide();

    // Inefficient, but save all the projects
    Projects.save($scope.projects);

    task.title = "";
  };

  $scope.updateStatus=function(){   
     Projects.save($scope.projects);
  }

  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  }

  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };


  // Try to create the first project, make sure to defer
  // this by using $timeout so everything is initialized
  // properly
  $timeout(function() {
    if($scope.projects.length == 0) {
      while(true) {
        var projectTitle = prompt('Your first project title:');
        if(projectTitle) {
          createProject(projectTitle);
          break;
        }
      }
    }
  });

  /*$scope.tasks=[];
  $ionicModal.fromTemplateUrl('new-task.html',function(modal){
    $scope.taskModal=modal;
  },
  {
    scope:$scope,
    animation:'slide-in-down'
  });

  $scope.createTask=function(task){
    $scope.tasks.push({title:task.title});
    $scope.taskModal.hide();
    task.title="";
  };

  // Open our new task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  // Close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };*/
});
