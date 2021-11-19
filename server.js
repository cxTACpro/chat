const mongoose = require('mongoose');
const Msg = require('./models/messages');
const io = require('socket.io')(3000)
const mongoDB = 'mongodb+srv://cxtacpro:password4@cluster0.v3ses.mongodb.net/message-database?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('MONGOSE CNCT')
}).catch(err => console.log(err))
io.on('connection', (socket) => {
    Msg.find().then(result => {
        socket.emit('output-messages', result)
    })
    console.log('LOGIN');
    socket.emit('message', 'Message cooldown: 1.15 seconds');
    socket.on('disconnect', () => {
        console.log('LOG OUT');
    });
    socket.on('chatmessage', msg => {
        const message = new Msg({ msg });
        message.save().then(() => {
            io.emit('message', msg)
        })


    })
});