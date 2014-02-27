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
  $http({method: 'GET', url: '/api/devices'})
      .success(function(data, status, headers, config) {
        $scope.devices = data.devices;
        
      })
      .error(function(data, status, headers, config) {
  });

  $scope.devTitle="Device";
  $scope.selection="withoutdev";
  $scope.deviceID=0;
  //quando se clica num dispositivo
  $scope.selectdev = function(device) { 
    $scope.selection="device";
    //title
    $scope.devTitle=device.type;
    //id
    $scope.deviceID=device.id;

    //FORM
    //type
    var type=device.type;
    $scope.typemodel=type;
    $(".typedev option[value="+type+"]").attr("selected",true);
    //status
    var stat= device.status;
    $scope.statusmodel= stat;
    $(".status option[value="+stat+"]").attr("selected",true);
    //local
    var loc =device.room;
    $scope.localmodel= loc;
    $(".local option[value="+loc+"]").attr("selected",true);

  }
    

     $scope.updateType= function() {
       
       console.log($("select.typedev").val());
      
     }
    $scope.updateStatus= function() {
      var stat = $("select.status").val();
      var msg = {id:$scope.deviceID, status:stat};
      console.log(stat);
      socket.emit('update:status', msg);      
    }
    $scope.updateLocal= function() {
      console.log($("select.local").val());
    }

    //communication
    socket.on('update:status', function (data) {
      
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

  }).
  controller('ManagerController', function ($scope, $http) {
    $http({method: 'GET', url: '/api/trashes'})
      .success(function(data, status, headers, config) {
        $scope.trashes = data.trashes;
      })
      .error(function(data, status, headers, config) {
        
      });
  });
*/