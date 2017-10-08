var amqp = require('amqplib/callback_api');
var rabbitmq = 'amqp://student:cph@datdb.cphbusiness.dk:5672'
var js2xmlparser = require("js2xmlparser");

amqp.connect(rabbitmq, function (err, conn) {
    conn.createChannel(function (err, ch) {
        var ex = 'recipientListEx';

        var topics = ["poor"];


        ch.assertExchange(ex, 'topic', {
            durable: false
        });

        ch.assertQueue('', {
            durable: true
        }, function (err, q) {
            console.log(' [*] Waiting for logs. To exit press CTRL+C');

            topics.forEach(function (key) {
                ch.bindQueue(q.queue, ex, key);
            });

            ch.consume(q.queue, function (msg) {
                var xml = js2xmlparser.parse("LoanRequest", msg.content);
                console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
            }, {
                noAck: true
            });
        });

    });
});