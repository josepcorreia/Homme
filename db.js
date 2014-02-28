var mongoose = require('mongoose');

var deviceSchema = new mongoose.Schema({
  id: {type: Number, unique: true },
  name: String, 
  status: String, //ON-1 or OFF-0
  room: String ,
  /*position: { //posição na room
    x: Number,
    y: Number,
    r: Number
  },*/
  temperature: Number

});
var Device = mongoose.model( 'Device', deviceSchema );

//exemplo
Device.create({ id: 1, name: 'Tv',status: 'on', room: 'kitchen'}, function (err, trash) {
  if (err) console.error('trash duplicated');
});
Device.create({ id: 2, name: 'Heater',status: 'off', room: 'seixasroom'}, function (err, trash) {
  if (err) console.error('trash duplicated');
});
Device.create({ id: 3, name: 'Lights',status: 'off', room: 'manuroom'}, function (err, trash) {
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