dove-selfesteem


GOODBOY S3 Bucket Usage Notes

Setup Environment

1. install the AWS CLI - python flavor

pip install aws-cli --user

pip is the easiest way to manage python packages on your
system. see https://github.com/pypa/get-pip for the install
HOWTO


Setup AWS Credentials 

1. In directory of your choice create a file named goodboy with the following contents:

load-goodboy-creds () {
unset AWS_ACCESS_KEY AWS_SECRET_KEY AWS_CREDENTIAL_FILE AWS_CONFIG_FILE
export AWS_CREDENTIAL_FILE="${HOME}/YOUR_DIRECTORY/goodboy_creds.txt"
export AWS_CONFIG_FILE="${AWS_CREDENTIAL_FILE}"
}

2. In that same directory create a file named goodboy_creds.txt with the
following contents:

[profile default]
aws_access_key_id=YOUR_ACCESS_KEY_ID
aws_secret_access_key=YOUR_SECRET_KEY
region=eu-west-1

3. source the file created in step 1. :

source ./goodboy

This loads a bash function into your shell environment. Now run the function:

load-goodboy-creds 

Run the env command to check the AWS_CREDENTIAL_FILE and AWS_CONFIG_FILE 
environment variables if required.


Listing A Bucket

1. list top level of bucket 

aws s3 ls s3://kd57kykc9htu1d-gb/

2. recursively list bucket

aws s3 ls --recursive s3://kd57kykc9htu1d-gb/



Syncing Content To S3 Bucket

1. cd to directory hosting code to upload

2. sync all content to goodboy S3 bucket

aws s3 sync . s3://kd57kykc9htu1d-gb/

3. sync all content to S3 bucket path

aws s3 sync . s3://kd57kykc9htu1d-gb/target_path/


ENDPOINT

http://kd57kykc9htu1d-gb.s3-website-eu-west-1.amazonaws.com/



