var hapi = require('hapi');
var inert = require('inert');
var mongoose = require('mongoose');
var User = require('./schemas/user');

var server = new hapi.Server();
server.connection({
    port: ~~process.env.PORT | 8000,
    routes: {cors:true}
});

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/gifthub');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
    console.log("Connection with database succeeded.");
});

server.register([inert], function(err){
	server.route([{method: 'POST', path: '/email', config:{
        handler: function(request, reply){
            console.log(request.payload);
            var newUser = new User({
                email: request.payload.email
            });
            newUser.save(function(err){
                if(err){
                    console.log(err);
                    boom.badRequest("Couldn't save email into the server");
                }
                console.log("all good");
                reply("Email saved");
            });
        }
    } }]);

	server.start(function () {
	    console.log('Server running at:', server.info.uri);
	});
});
