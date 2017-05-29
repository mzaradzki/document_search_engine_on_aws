
// Configure AWS SDK for JavaScript
AWS.config.update({region: 'PLACEHOLDER_REGION'});
AWS.config.credentials = new AWS.CognitoIdentityCredentials(
  {
    IdentityPoolId: 'PLACEHOLDER_REGION:PLACEHOLDER_ID'
  }
);

// Prepare to call Lambda function
var lambda = new AWS.Lambda({region: 'PLACEHOLDER_REGION', apiVersion: '2015-03-31'});

