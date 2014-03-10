var mongoose = require('mongoose');

var deviceSchema = new mongoose.Schema({
  id: {type: Number, unique: true },
  name: String, 
  status: String, 
  analog: String,
  digital: String, 
  digitalport: String,
  room: String ,
  url: String,
  position: { //posição na room
    x: Number,
    y: Number
  }
});
var Device = mongoose.model( 'Device', deviceSchema );

//exemplo
Device.create({ id: 1, 
                name: 'Lights',
                status: 'OFF',
                analog: 'Temperature',
                digital: 'irreceiver', 
                digitalport: 'D',
                room: 'civil',
                url:'/img/lights.png',
                position: { x: 450, y: 90}
              },function (err, trash) {
              if (err) console.error('trash duplicated');
});
Device.create({ id: 2, 
                name: 'Heater',
                status: 'OFF',
                analog: 'Temperature',
                digital: 'irreceiver', 
                digitalport: 'E',
                room: 'manuroom',
                url:'/img/heater.png',
                position: { x: 500, y: 265}
              },function (err, trash) {
              if (err) console.error('trash duplicated');
});
Device.create({ id: 3, 
                name: 'Tv',
                status: 'ON',
                analog: 'None',
                digital: 'irreceiver', 
                digitalport: 'E',
                room: 'seixasroom',
                url:'/img/tv.png',
                position: { x: 400, y: 165}
              },function (err, trash) {
              if (err) console.error('trash duplicated');
});

if(process.env.VCAP_SERVICES){
    var env = JSON.parse(process.env.VCAP_SERVICES);
    var mongo = env['mongodb-1.8'][0]['credentials'];
}
else{
    var mongo = {
    "hostname":"localhost",
    "port":27017,
    "username":"",
    "password":"",
    "name":"",
    "db":"devices"
    }
}
var generate_mongo_url = function(obj){
    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'test');
    if(obj.username && obj.password){
        return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
    else{
        // return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
        return "mongodb://" + obj.hostname + "/" + obj.db;
    }
}
var mongourl = generate_mongo_url(mongo);

mongoose.connect(mongourl);