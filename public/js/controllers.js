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
  $scope.devname= [];
  $scope.status = [];
  $scope.analog = [];
  $scope.analogdata = [];
  $scope.anlg_original = [];
  $scope.digital = [];
  $scope.digitalport = [];
  $scope.local = [];
  $scope.analogTest = [];
  $scope.devId;

  //quando se clica num dispositivo
  $scope.selectdev = function(id) { 
      $scope.selection="device";
      $scope.stringID=String(id);
      $scope.devId=id;

      //title //id
      $scope.devTitle=$scope.devId + ': ' +$scope.devs[id].name;

      //FORM - name
      $scope.devname[id]=$scope.devs[id].name;
      //$(".devname").val($scope.devs[id].name);


      //status
      $scope.status[id] = $scope.devs[id].status;
      //$(".status").val(stat);
      
      //Analog
      $scope.anlg_original[id] = 231;
      if($scope.devs[id].analog=='None'){
        $scope.analog[id]= "None";
        //$(".analog option[value="+anl+"]").attr("selected",true);
        $scope.analogTest[id]=true;
        $scope.analogdata[id] = " ";
        
      }else{
        $scope.analog[id] = $scope.devs[id].analog;
        //$(".analog option[value="+anl+"]").attr("selected",true);
        $scope.analogTest[id]=false;
      }
      
      //digital
      $scope.digital[id]= $scope.devs[id].digital;
      //$(".digital").val(dig);
      
      //digitalport
      $scope.digitalport[id] = $scope.devs[id].digitalport;
      //$(".digitalport").val(digport);

      //local
      $scope.local[id] = $scope.devs[id].room;
      //$(".local").val(loc);
  }

  $scope.showOptions = function() { 
    $scope.selection="options";
  }

  $scope.updateName= function() {
      var newname = $scope.devname[$scope.devId]; 
      //= $(".devname").val();
      var upname= {id:$scope.devId,name:newname };
      socket.emit('update:name', upname);
      $("."+$scope.stringID+"").text(newname);
      $scope.devs[$scope.devId].name=newname;
      $scope.devTitle=$scope.devId + ': ' +newname;
  }

  $scope.updateStatus= function() {
     var stat = $scope.status[$scope.devId];
     var msg = {id:$scope.devId, status:stat};
     console.log(stat);
     socket.emit('send:status', msg); 
     console.log($scope.status)
     //devia-se bloquear ate se actualizar     
  }

  $scope.updateAnalog = function(){
    //var upAnalog= {id:$scope.devId,analog:$('select.analog').val()};
    var upAnalog= {id:$scope.devId,analog:$scope.analog[$scope.devId]};
    $scope.devs[$scope.devId].analog = $scope.analog[$scope.devId];

    //depois refactorizar
    if($scope.analog[$scope.devId] =="Brightness"){
      $scope.analogdata[$scope.devId]=(($scope.anlg_original[$scope.devId]*100)/800) + '%';
    }else if($scope.analog[$scope.devId] =="Temperature"){
      $scope.analogdata[$scope.devId]="24 °C";
    }else if($scope.analog[$scope.devId] =='Proximity'){
      $scope.analogdata[$scope.devId]='3 m';
    } 
     

    // = $('select.analog').val();
    socket.emit('update:analog', upAnalog);
  }

  $scope.updateDigital = function(){
    //var upDigital= {id:$scope.devId,digital:$('select.digital').val()};
    var upDigital= {id:$scope.devId,digital: $scope.digital[$scope.devId]};
    $scope.devs[$scope.devId].digital = $scope.digital[$scope.devId];
    //=$('select.digital').val();
    socket.emit('update:digital', upDigital);
  }

  $scope.upDigitalPort = function(){
    //var upDigitalPort= {id:$scope.devId,digitalport:$('select.digitalport').val()};
    var upDigitalPort= {id:$scope.devId,digitalport:$scope.digitalport[$scope.devId]};
    $scope.devs[$scope.devId].digitalport = $scope.digitalport[$scope.devId];//= $('select.digitalport').val();
    socket.emit('update:digitalport', upDigitalPort);
  }

  $scope.updateLocal= function() {
     //var upLocal= {id:$scope.devId,room:$("select.local").val()};
    var upLocal= {id:$scope.devId,room:$scope.local[$scope.devId]};
    $scope.devs[$scope.devId].room = $scope.local[$scope.devId];//= $("select.local").val();
    socket.emit('update:room', upLocal);
  }
  
  //communication
  //from octooff
  socket.on('receive:status', function (data) {
    $scope.devs[data.id].status= data.status;
    if(data.id==$scope.devId){
      $scope.status[data.id]=data.status;
      //$(".status").val(data.status);
    }
  });
  socket.on('receive:digitalport', function (data) {
      $scope.devs[data.id].digitalport = data.digitalport;
      if(data.id==$scope.devId){
      $scope.digitalport[data.id]=data.digitalport;
      //$(".digitalport").val(data.digitalport); 
    }
  });
  socket.on('receive:analogdata', function (data) {
    var anlgdata = data.analogdata;
    $scope.anlg_original[data.id]=anlgdata;
      if(anlgdata== 'x'){
        $scope.analogTest[data.id]=true;
        $scope.analog[data.id]= "None";
        $scope.analogdata[data.id] = " ";
      } else{
        $scope.analogTest[data.id]=false;
        if($scope.analog[data.id] =="Brightness"){
          $scope.analogdata[$scope.devId]=((anlgdata*100)/800) + '%';
        }else if($scope.analog[data.id] =="Temperature"){
          $scope.analogdata[data.id]="24 °C";
        }else if($scope.analog[data.id] =='Proximity'){
         $scope.analogdata[data.id]='3 m';
        } 
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
    
      if(data.analog=='None'){
        $scope.analogTest[data.id]=true;
        $scope.analog[data.id]= "None";
        $scope.analogdata[data.id] = " ";
      }else{
        $scope.analogTest[data.id]=false;
        $scope.devs[data.id].analog=data.analog;
        $scope.analog[data.id] = data.analog;
      }
  });

  socket.on('up:digital', function (data) {
      $scope.devs[data.id].digital= data.digital;
      $scope.digital[data.id] = data.digital;
  });
    
  socket.on('up:room', function (data) {
    $scope.devs[data.id].room = data.room;
    $scope.local[data.id] = data.room;
  });

  //when a new octonoff connects, the page makes auto reload
  socket.on('refresh:page', function (data) {
    location.reload();
  });

}).

controller('CivilController', function ($scope, $http, socket) {
  
  //mensageem que depois deixa o socket no server guardado, para envair posteriormente os dados
  socket.emit('message', { name: 'jose'});
 
 //when a new octonoff connects, the page makes auto reload
  socket.on('refresh:page', function (data) {
    location.reload();
  });

  var svg = d3.select('#civil');
  var div = d3.select("body").append("div")   
      .attr("class", "tooltip")               
      .style("opacity", 0);

  $scope.devs = []; 
  $scope.stat = []; 

  $http({method: 'GET', url: '/api/devices'})
      .success(function(data, status, headers, config) {
        $scope.devices = data.devices;
        $scope.devices.forEach(function (device) {
           //pedrada
           if(device.room=='civil'){
            $scope.devs.push(device);
            $scope.device = device; 
           }
        });
        insertDevice(); 
      })
      .error(function(data, status, headers, config) {
  });
  


  var insertDevice = function () {
      svg.selectAll('div').data($scope.devs).enter().append("rect")
        .attr("x", function (d) { return d.position.x; })
        .attr("y", function (d) { return d.position.y; })
        .attr("width", 60)
        .attr("height", 60)
        .attr('transform', 'translate(10,10)')
        .style({'background-color':'darkkhaki','opacity':0.2})
        .on('click', function (d) {
          updateStatus(d);
        })
      
      svg.selectAll('div').data($scope.devs).enter().append("svg:image")
        .attr('id', function (d) { return d.id; })
        .attr("xlink:href",  function (d) { return updateImage(d); })
        .attr("x", function (d) { return d.position.x; })
        .attr("y", function (d) { return d.position.y; })
        .attr("width", "80")
        .attr("height", "80")
        .on('click', function (d) {
          updateStatus(d);
        })
    };

    var updateImage = function(dev){
      switch(dev.status){
        case 'ON':
         return '/img/lightson.png';
          break;
        case 'OFF':
         return '/img/lightsoff.png';
          break;
        default:
      }
    }
    
    var updateStatus= function(dev) {
      switch(dev.status){
        case 'ON':
          var msg = {id:dev.id, status:'OFF'};
          socket.emit('send:status', msg);
          //console.log('OFF'); 
          break;
        case 'OFF':
          var msg = {id:dev.id, status:'ON'};
          socket.emit('send:status', msg);
          //console.log('ON'); 
          break;
        default:
      }
    }



 //communication
  //from octooff
  socket.on('receive:status', function (data) {
      switch(data.status){
        case 'ON':
          $('image').attr("href", "/img/lightson.png");
          $scope.device.status = 'ON';
          break;
        case 'OFF':
          $('image').attr("href", "/img/lightsoff.png");
          $scope.device.status = 'OFF';
          break;
        default:
      }
  });



}).

controller('HomePlanController', function ($scope, $http, socket) {
  
  $scope.devskitchen = [];
  $scope.devsmanu = [];  

  $http({method: 'GET', url: '/api/devices'})
      .success(function(data, status, headers, config) {
        $scope.devices = data.devices;
        $scope.devices.forEach(function (device) {
           //pedrada
           if(device.room=='kitchen'){
            $scope.devskitchen.push(device);
           } else if (device.room=='manuroom'){
               $scope.devsmanu.push(device);
           }
        });
      })
      .error(function(data, status, headers, config) {
  });



  //mensageem que depois deixa o socket no server guardado, para envair posteriormente os dados
  socket.emit('message', { name: 'jose'});
  
  $scope.roomTitle="Kitchen";
  $scope.room_selected = 'Kitchen';
  $scope.selection="kitchen";

  $scope.rooms = [{room:'Kitchen'},{room:'Manu\'s Room'},{room:'Rafael\'s Room'},{room:'Seixas\' Room'},{room:'Zé\'s Room'}]
  $scope.selectroom = function(room) {
    $scope.roomTitle=room; 
    $scope.room_selected = room;
    if(room.substr(room.length - 4)=='Room'){
      $scope.selection="bedroom";
      insertDevice(devsmanu);
    }else if(room == 'Kitchen'){
      $scope.selection="kitchen";
      insertDevice(devskitchen);
    }
  }
  


  var insertDevice = function (devs) {
      svg.selectAll('div').data(devs).enter().append("rect")
        .attr("x", function (d) { return d.position.x; })
        .attr("y", function (d) { return d.position.y; })
        .attr('transform', 'translate(0,-40)')
        .attr("width", 80)
        .attr("height", 120)
        .style({'background-color':'darkkhaki','opacity':0.4})
        .on('click', function (d) {
          console.log(d);
              //showupdatebox(d);
        })
      
      svg.selectAll('div').data($scope.devs).enter().append("svg:image")
        .attr('id', function (d) { return d.id; })
        .attr("xlink:href",  function (d) { return d.url; })
        .attr("x", function (d) { return d.position.x; })
        .attr("y", function (d) { return d.position.y; })
        .attr("width", "80")
        .attr("height", "80")
        .on('click', function (d) {
          console.log(d);
            //showupdatebox(d);
        })
      
      svg.selectAll('div').data($scope.devs).enter().append("text")
        .attr('id', function (d) { return d.id; })
        .text(function(d) { return d.name;}) 
        .attr('transform', 'translate(0,-20)')
        .attr("x", function (d) { return d.position.x; })
        .attr("y", function (d) { return d.position.y; })
        .attr("font-family", "Open Sans")
        .attr("font-size", "16px")
        .attr("fill", "white")
        .on('click', function (d) {
          console.log(d);
           //showupdatebox(d);
        })

      svg.selectAll('div').data($scope.devs).enter().append("text")
        .attr('id', function (d) { return d.id; })
        .text(function(d) {return "Status: " + d.status;})
        .attr("x", function (d) { return d.position.x; })
        .attr("y", function (d) { return d.position.y; })
        .attr("font-family", "Open Sans")
        .attr("font-size", "14px")
        .attr("fill", "white")
        .on('click', function (d) {
          // showupdatebox(d);
        })
    };

});