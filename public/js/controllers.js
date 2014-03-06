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

      //FORM - name
      $scope.devname=$scope.devs[id].name;
      
      //status
      var stat= $scope.devs[id].status;
      $scope.status= stat;
      $(".status option[value="+stat+"]").attr("selected",true);
      
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
      $(".digital option[value="+dig+"]").attr("selected",true);
      
      //digital
      var digport = $scope.devs[id].digitalport;
      $scope.digitalport= digport;
      $(".digitalport option[value="+digport+"]").attr("selected",true);

      //local
      var loc =$scope.devs[id].room;
      $scope.localmodel= loc;
      $(".local option[value="+loc+"]").attr("selected",true);
  }

  $scope.showOptions = function() { 
    $scope.selection="options";
  
  }

  $scope.updateName= function() {
      //console.log($(".devname").val());
      var newname = $(".devname").val();
      var upname= {id:$scope.devId,name:newname };
      socket.emit('update:name', upname);
      $("."+$scope.stringID+"").text(newname);
      $scope.devs[$scope.devId].name=newname;
  }

  $scope.updateStatus= function() {
     var stat = $("select.status").val();
     var msg = {id:$scope.devId, status:stat};
     console.log(stat);
     socket.emit('send:status', msg); 
     //devia-se bloquear ate se actualizar     
  }

  $scope.updateAnalog = function(){
    //console.log($('select.analog').val());
    var upAnalog= {id:$scope.devId,analog:$('select.analog').val()};
     $scope.devs[$scope.devId].analog = $('select.analog').val();
    socket.emit('update:analog', upAnalog);
  }

  $scope.updateDigital = function(){
    //console.log($('select.digital').val());
    var upDigital= {id:$scope.devId,digital:$('select.digital').val()};
    $scope.devs[$scope.devId].digital = $('select.digital').val();
    socket.emit('update:digital', upDigital);
  }

  $scope.upDigitalPort = function(){
    //console.log($('select.digitalport').val());
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
  socket.on('receive:status', function (data) {
    if(data.id==$scope.devId){
      //$scope.status= data.status;
      $(".status option[value="+data.status+"]").attr("selected",true);  
    }
  });
  socket.on('receive:digitalport', function (data) {
       if(data.id==$scope.devId){
     // $scope.digitalport= data.digitalport;
      $(".digitalport option[value="+data.digitalport+"]").attr("selected",true); 
    }
  });

}).

controller('HomePlanController', function ($scope, $http, socket) {
});