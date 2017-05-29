# legidata
scrapper


## Notes on using non-default packages in Lambda Nodejs
To use non-default packages such as cheerio "html dom parser" you need to send your Lamdba code as a zip file to AWS. If your zip is too large because of the packages you wont be able to edit/test the code from the console.

However in that case you can use **lambda-local** to emulate Lambda locally. See this link : https://github.com/ashiina/lambda-local


## Usefull links
- To convert html to pdf with Lambda see : https://www.drivenbycode.com/creating-pdfs-from-html-with-aws-lambda-and-api-gateway/
- To convert RTF to text see the nodejs packages "RTF2TEXT" : need to check memory/time cost !
- To convert RTF to PDF (and more combination) see "Pandoc on AWS Lambda" tutorial at : https://claudiajs.com/tutorials/pandoc-lambda.html


## What we have so far as Lambda functionality
- Function that write updates to dynamodb
- Function that write files to S3
- Function that reads file meta-data from S3
- Function that reads HTML
- Function that download files on the web
- Function that write/read messages to/from SQS
- Function that queries from cloudsearch
- Function that index documents to cloudsearch


## Description (changing quickly)
- legiscrap0 writes all scraped links to SQS
- legiscrap_manager1 picks-up 1 SQS message and delegates it to scrap1 (triggered by CloudWatch CRON)
- legiscrap1 fetch html or attachement online and saves it on S3
- docIndexer listens to S3 file addition events and send index commands to CloudSearch
- docSearcher could be exposed through an API to query CloudSearch
- indexCleaner scans CloudSearch documents and check they all have a matching S3 file (triggered by CloudWatch CRON)
- indexCatcher scans S3 and check all files are in CloudSearch index (triggered by CloudWatch CRON)

Note that:
- indexCatcher uses an SQS Queue to keep track of its position in the S3 bucket as it processes it by chuncks
- indexCleaner uses an SQS Queue to keep track of its position in CloudSearch index


## Browser code credentials
To invoke Lambda from the Browser the page need to provide credential in the form of an **Identity Pool** managed by AWS Cognito.
See : http://docs.aws.amazon.com/cognito/latest/developerguide/identity-pools.html
The pool will allow to control permissions for both authenticated and un-authenticated users via specific **roles**.


