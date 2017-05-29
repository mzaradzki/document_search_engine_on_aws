var AWS = require('aws-sdk');

addToIndex = function (bucketName, docName, docContent, context) {
    
    var SERVICES_REGION = process.env.SERVICES_REGION;
    var CS_NAME = process.env.CS_NAME;
    
    var csd = new AWS.CloudSearchDomain({
        endpoint: CS_NAME+'.'+SERVICES_REGION+'.cloudsearch.amazonaws.com',
        apiVersion: '2013-01-01'
    });
    
    // see documentation at :
    // http://docs.aws.amazon.com/cloudsearch/latest/developerguide/preparing-data.html#creating-document-batches
    var jbatch = [
         {"type": "add",
          "id":   bucketName+':'+docName, // INFO : concatenate bucket and filename
          "fields": {
            "content": docContent,
            "content_encoding":	"ISO-8859-1",
 	        "content_type":	"text/plain",
 	        "resourcename": docName
          }
         },
        ];
    
    var params = {
        contentType: 'application/json',
        //documents: new Buffer('...'),
        //documents: streamObject,
        documents: JSON.stringify(jbatch),
    };
    csd.uploadDocuments(params, function(err, data) {
        if (err) {
            console.log('CloudSearchDomain ERROR');
            console.log(err, err.stack);
            context.done();
        }
        else {
            console.log('CloudSearchDomain SUCCESS');
            console.log(data);
            context.done();
        }
    });
};

deleteFromIndex = function (bucketName, docName, context) {
    
    var SERVICES_REGION = process.env.SERVICES_REGION;
    var CS_NAME = process.env.CS_NAME;
    
    var csd = new AWS.CloudSearchDomain({
        endpoint: CS_NAME+'.'+SERVICES_REGION+'.cloudsearch.amazonaws.com',
        apiVersion: '2013-01-01'
    });
    
    // see documentation at :
    // http://docs.aws.amazon.com/cloudsearch/latest/developerguide/preparing-data.html#creating-document-batches
    var jbatch = [
         {"type": "delete",
          "id": bucketName+':'+docName,
         }
        ];
    
    var params = {
        contentType: 'application/json',
        //documents: new Buffer('...'),
        //documents: streamObject,
        documents: JSON.stringify(jbatch),
    };
    csd.uploadDocuments(params, function(err, data) {
        if (err) {
            console.log('CloudSearchDomain ERROR');
            console.log(err, err.stack);
            context.done();
        }
        else {
            console.log('CloudSearchDomain SUCCESS');
            console.log(data);
            context.done();
        }
    });
};

exports.handler = (event, context, callback) => {
    
    console.log(event.Records.length); // INFO : this function assumes there is 1 file event
    console.log(event.Records[0].eventName); // 'ObjectCreated:Put' or 'ObjectRemoved:Delete'
    
    var goesIN = (event.Records[0].eventName == 'ObjectCreated:Put');
    console.log(goesIN);
    var goesOUT = (event.Records[0].eventName == 'ObjectRemoved:Delete');
    console.log(goesOUT);
    
    var filename = event.Records[0].s3.object.key;
    var bucketname = event.Records[0].s3.bucket.name;
    
    var params = {
        Bucket: bucketname,
        Key: filename,
        RequestPayer: 'requester',
    };
    var s3 = new AWS.S3();
    s3.getObject(params, function (err, data) {
        if (err) {
            //console.log(err, err.stack);
            if (goesIN) {
                console.log('file was not found : ERROR');
            }
            else if (goesOUT) {
                console.log('file was not found : as expected');
                //console.log(data);
                deleteFromIndex(bucketname, filename, context);
            }
            else {
                console.log('SCENARIO NOT HANDLED');
                context.done();
            }
        }
        else {
            if (goesIN) {
                console.log('file was found : as expected');
                //console.log(data);
                var contentText = data.Body.toString('utf8');
                addToIndex(bucketname, filename, contentText, context);
            }
            else if (goesOUT) {
                console.log('file WAS found : ERROR');
            }
            else {
                console.log('SCENARIO NOT HANDLED');
                context.done();
            }
        }
    });
};
