var AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
    
    var SERVICES_REGION = process.env.SERVICES_REGION;
    var CS_NAME = process.env.CS_NAME;
    
    var csd = new AWS.CloudSearchDomain({
        endpoint: CS_NAME+'.'+SERVICES_REGION+'.cloudsearch.amazonaws.com',
        apiVersion: '2013-01-01'
    });
    
    var size = 20;
    try {
        size = event.size;
    }
    catch (e) {}
    if (size>50) {
        callback('SIZE must not be greater than 50');
        context.done();
    }
    
    var start = 0;
    try {
        start = event.start;
    }
    catch (e) {}
    if (start<0) {
        callback('START must be positive');
        context.done();
    }
    
    var params = {
        query: event.query,
        sort: '_score desc',
        size: size,
        start: start,
        queryOptions: JSON.stringify({fields: ['content']}),
    };
    // see documentation at :
    // docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudSearchDomain.html#search-property
    csd.search(params, function(err, data) {
        if (err) {
            console.log('CloudSearch ERROR');
            console.log(err, err.stack);
            callback('CloudSearch ERROR');
            context.done();
        }
        else {
            console.log('CloudSearch SUCCESS');
            //console.log(data);
            //console.log(data.hits);
            console.log(data.hits.found);
            //console.log(data.hits.hit);
            if (data.hits.found > 0) {
                console.log(data.hits.hit[0].id);
                //console.log(data.hits.hit[0].fields); // to large to print in console
            }
            callback(null, data);
            context.done();
        }
    });
};
