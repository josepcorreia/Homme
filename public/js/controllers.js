'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function ($scope, socket) {
    $scope.response = 'No response';
    $scope.message = '';
    socket.on('send:name', function (data) {
      $scope.name = data.name;
    });
    socket.on('response', function (data) {
      $scope.response = data;
    });

    $scope.sendMessage = function () {
      console.log('sending message');
      socket.emit('message',$scope.message);
    }
  }).
  


//controllers
controller('DeviceController', function ($scope, $http, socket) {
  $scope.devs = []; 

  $http({method: 'GET', url: '/api/devices'})
      .success(function(data, status, headers, config) {
        $scope.devices = data.devices;
        $scope.devices.forEach(function (device) {
           $scope.devs[device.id]=device; 
        });
      })
      .error(function(data, status, headers, config) {
  });
  //mensageem que depois deixa o socket no server guardado, para envair posteriormente os dados
  socket.emit('message', { name: 'jose'});
  
  $scope.devTitle="Device";
  $scope.selection="withoutdev";
  $scope.stringID="";
  $scope.devId;

  //quando se clica num dispositivo
  $scope.selectdev = function(id) { 
      $scope.selection="device";
      $scope.stringID=String(id);
      $scope.devId=id;

      //title //id
      $scope.devTitle=$scope.devId + ': ' +$scope.devs[id].name;

      //FORM - name(na primeira vez o mdel funciona, e o jquery nao, das outras é ao contrario)
      $scope.devname=$scope.devs[id].name;
      $(".devname").val($scope.devs[id].name);


      //status
      var stat= $scope.devs[id].status;
      $scope.status= stat;
      $(".status").val(stat);
      
      //Analog
      if($scope.devs[id].analog=='none'){
        var anl ="None";
        $scope.analog=anl;
        $(".analog option[value="+anl+"]").attr("selected",true);
        $scope.analogTest=true;
        $scope.analogdata = " ";
      }else{
        var anl = $scope.devs[id].analog;
        $scope.analog=anl;
        $(".analog option[value="+anl+"]").attr("selected",true);
        $scope.analogTest=false;
        $scope.analogdata = "22 °C";
        //$(".analog option[value='None']").remove();
      }
      
      //digital
      var dig = $scope.devs[id].digital;
      $scope.digital= dig;
      $(".digital").val(dig);
      
      //digitalport
      var digport = $scope.devs[id].digitalport;
      $scope.digitalport= digport;
      $(".digitalport").val(digport);

      //local
      var loc =$scope.devs[id].room;
      $scope.localmodel= loc;
      $(".local").val(loc);
  }

  $scope.showOptions = function() { 
    $scope.selection="options";
  }

  $scope.updateName= function() {
      var newname = $(".devname").val();
      var upname= {id:$scope.devId,name:newname };
      socket.emit('update:name', upname);
      $("."+$scope.stringID+"").text(newname);
      $scope.devs[$scope.devId].name=newname;
      $scope.devTitle=$scope.devId + ': ' +$scope.devs[$scope.devId].name;
  }

  $scope.updateStatus= function() {
     var stat = $("select.status").val();
     var msg = {id:$scope.devId, status:stat};
     console.log(stat+'teste');
     socket.emit('send:status', msg); 
     //devia-se bloquear ate se actualizar     
  }

  $scope.updateAnalog = function(){
    var upAnalog= {id:$scope.devId,analog:$('select.analog').val()};
     $scope.devs[$scope.devId].analog = $('select.analog').val();
    socket.emit('update:analog', upAnalog);
  }

  $scope.updateDigital = function(){
    var upDigital= {id:$scope.devId,digital:$('select.digital').val()};
    $scope.devs[$scope.devId].digital = $('select.digital').val();
    socket.emit('update:digital', upDigital);
  }

  $scope.upDigitalPort = function(){
    var upDigitalPort= {id:$scope.devId,digitalport:$('select.digitalport').val()};
    $scope.devs[$scope.devId].digitalport = $('select.digitalport').val();
    socket.emit('update:digitalport', upDigitalPort);
  }

  $scope.updateLocal= function() {
     //console.log($("select.local").val());
    var upLocal= {id:$scope.devId,room:$("select.local").val()};
    $scope.devs[$scope.devId].room = $("select.local").val();
    socket.emit('update:room', upLocal);
  }
  
    //communication
  //from octooff
  socket.on('receive:status', function (data) {
    $scope.devs[data.id].status= data.status;
    if(data.id==$scope.devId){
      //$scope.status= data.status;
      $(".status").val(data.status);
      $scope.status=data.status;
    }
  });
  socket.on('receive:digitalport', function (data) {
      $scope.devs[data.id].digitalport= data.digitalport;
      if(data.id==$scope.devId){
      $(".digitalport").val(data.digitalport); 
    }
  });

  //from other clients
  socket.on('up:name', function (data) {
      $("."+data.id+"").text(data.name);
      $scope.devs[data.id].name=data.name;
      if(data.id==$scope.devId){
        $(".devname").val(data.name);
        $scope.devTitle=$scope.devId + ': ' +$scope.devs[$scope.devId].name;
      }
  });
  socket.on('up:analog', function (data) {
      $scope.devs[data.id]=data.analog;
      if(data.analog=='none'){
        var anl ="None";
        $(".analog").val(anl);
        $scope.analogTest=true;
        $scope.analogdata = " ";
      }else{
        $(".analog").val(data.analog);
        $scope.analogTest=false;
        $scope.analogdata = "21 °C";
      }
  });
  socket.on('up:digital', function (data) {
      $scope.devs[data.id].digital= data.digital;
      if(data.id==$scope.devId){
        $(".digital").val(data.digital);
      }
  });
    
  socket.on('up:room', function (data) {
    $scope.devs[data.id].room = data.room;
    if(data.id==$scope.devId){
      $(".local").val(data.room);
    }
  });

}).

controller('HomePlanController', function ($scope, $http, socket) {
});