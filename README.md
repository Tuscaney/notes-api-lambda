# Notes API (AWS Lambda + API Gateway)

## Overview
A minimal serverless API that returns a JSON array of notes via AWS Lambda and an HTTP API in API Gateway.  
This project demonstrates how to deploy a simple Node.js Lambda function and connect it to an API Gateway endpoint to create a publicly accessible API.

---

## Lambda

- **Name:** `notes-api`
- **Runtime:** Node.js (latest available, e.g., 22.x)
- **Handler:** `index.handler`

## API Gateway
- **Invoke URL:** https://3ia9nkara2.execute-api.us-east-2.amazonaws.com/notes


## IAM
- Execution role: `notes-api-role-hx4nbjn5`
