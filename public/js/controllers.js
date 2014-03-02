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

  $scope.devTitle="Device";
  $scope.selection="withoutdev";
  $scope.stringID="";
  $scope.devID;

  //quando se clica num dispositivo
  $scope.selectdev = function(id) { 
      $scope.selection="device";
      $scope.stringID=String(id);
      $scope.devID=id;

      //title //id
      $scope.devTitle=$scope.devID + ': ' +$scope.devs[id].name;

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
      var upname= {id:$scope.devID,name:newname };
      socket.emit('update:name', upname);
      $("."+$scope.stringID+"").text(newname);
      $scope.devs[$scope.devID].name=newname;
  }

  $scope.updateStatus= function() {
     var stat = $("select.status").val();
     var msg = {id:$scope.devID, status:stat};
     console.log(stat);
     socket.emit('send:status', msg); 
     //devia-se bloquear ate se actualizar     
  }

  $scope.updateAnalog = function(){
    //console.log($('select.analog').val());
    var upAnalog= {id:$scope.devID,analog:$('select.analog').val()};
     $scope.devs[$scope.devID].analog = $('select.analog').val();
    socket.emit('update:analog', upAnalog);
  }

  $scope.updateDigital = function(){
    //console.log($('select.digital').val());
    var upDigital= {id:$scope.devID,digital:$('select.digital').val()};
    $scope.devs[$scope.devID].digital = $('select.digital').val();
    socket.emit('update:digital', upDigital);
  }

  $scope.upDigitalPort = function(){
    //console.log($('select.digitalport').val());
    var upDigitalPort= {id:$scope.devID,digitalport:$('select.digitalport').val()};
    $scope.devs[$scope.devID].digitalport = $('select.digitalport').val();
    socket.emit('update:digitalport', upDigitalPort);
  }

  $scope.updateLocal= function() {
     //console.log($("select.local").val());
    var upLocal= {id:$scope.devID,room:$("select.local").val()};
    $scope.devs[$scope.devID].room = $("select.local").val();
    socket.emit('update:room', upLocal);
  }

    //communication
  socket.on('update:status', function (data) {
       console.log(data);
  });

}).

controller('HomePlanController', function ($scope, $http, socket) {
});


/*
controller('MapController', function ($scope, $http, socket) {

    var svg = d3.select('#map');
    var div = d3.select("body").append("div")   
      .attr("class", "tooltip")               
      .style("opacity", 0);

    var counter = 0;
    $scope.trashes = {}
    $scope.data = []

    $http({method: 'GET', url: '/api/trashes'})
      .success(function(data, status, headers, config) {
        $scope.trashes = data.trashes;
        $scope.trashes.forEach(function (trash) {
          insertTrash(trash);
        });
      })
      .error(function(data, status, headers, config) {
        
      });


//setInterval(function() { socket.emit('message', message) }, 1000)
setInterval(function() { socket.emit('message', { name: 'jose'}) }, 100000)

    socket.on('connection', function (trashes) {
      // $scope.trashes = trashes;
      // $scope.trashes.forEach(function (trash) {
      //   insertTrash(trash);
      
    });

    socket.on('change:color', function (data) {
      svg.selectAll('circle').style('fill', data);
    });

    socket.on('register:trash', function (data) {
      insertTrash(data);
    });

    socket.on('update:trash', function (data) {
      updateTrash(data);
    });

    var insertTrash = function (data) {
      $scope.trashes[data.name] = counter++;
      $scope.data.push(data);
      
      insertData();
    };

    var updateTrash = function (data) {
      var position = $scope.trashes[data.name];
      $scope.data[position] = data.data;
      console.log('aquiqqqqq')
      updateData(data.name, data.level);
    };

    var insertData = function () {
      svg.selectAll('circle').data($scope.data).enter().append('circle')
      .attr('id', function (d) { return d.name; })
      .attr('cx', function (d) { return d.position.x; })
      .attr('cy', function (d) { return d.position.y; })
      .attr('r', 0)
      .on("mouseover", function(d) {      
        d3.select(this).transition().duration(500).attr('r', (d.position.r + 5));
      })                  
      .on("mouseout", function(d) {       
            d3.select(this).transition().duration(500).attr('r', d.position.r);
      })
      .on('click', function (d) {
        console.log(d.name);
      })

      .style('fill', function (d) {
        if (d.level >= 0 && d.level < 65) {
          return '#46a546';
        } else {
            if(d.level >= 65 && d.level <90 ){
               return '#ffd700';
            }
            else {
              return '#9d261d';
          }
      }
      });

      svg.selectAll('circle').data($scope.data).transition().duration(750)
        .attr('r', function (d) { return d.position.r; });
    };

    var updateData = function (name, level) {
      var id = '#' + name;
      var color;

      if (level >= 0 && level < 65) {
        color = '#46a546';
      } else {
          if(level >= 65 && level <90 ){
             color = '#ffd700';
          }
          else {
             color = '#9d261d';
          }
      }

      svg.select(id).style('fill', color);
    };

*/