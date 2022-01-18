# DOXA API

![So Happy](https://github.com/Hack-22-OGP/doxa-api/actions/workflows/ci.yml/badge.svg)

## Install Dependencies

```sh
npm install -g serverless
npm install
sls dynamodb install
```

## Run local

Run serverless offline:

```sh
npm run dev
```

## Deploy AWS

Configure your AWS credentials (access key, secret, session token), and deploy:

```sh
sls deploy
```

## API Documentation

List of implemented API:

- Create Poll
- List Polls
- Get Poll by Poll ID
- Create Vote to a Poll

Temporary security authorization before implementing sgID or Singpass:
HTTP Headers: Authorization

```
Bearer <userId>
```

\<userId\> is free text, no format validation or encryption for now. \<pollId\>-\<userId\> is stored to vote-user table for validating if user has voted before.

### Create Poll

POST - /poll
Input:

```
{
  "title": "Poll description",
  "options": [
    {
      "title": "Option description #1"
    },
    {
      "title": "Option description #2"
    }
  ]
}
```

Output:

```
{
  "success": true,
  "response": {
    "id": "e359c9fd-bbaa-418f-a1ab-8dff619beedf",
    "title": "Poll description",
    "options": [
      {
        "id": 0,
        "title": "Option description #1",
        "voteCount": 0
      },
      {
        "id": 1,
        "title": "Option description #2",
        "voteCount": 0
      }
    ],
    "createdDate": "2022-01-16T05:47:56.049Z",
    "updatedDate": "2022-01-16T05:47:56.049Z"
  }
}
```

### List Polls

GET - /poll

Output:

```
{
  "success": true,
  "response": [
    {
      "id": "e359c9fd-bbaa-418f-a1ab-8dff619beedf",
      "title": "Poll description"
    },
    {
      "id": "e359c9fd-bbaa-418f-a1ab-8dff619beedf",
      "title": "Another Poll description"
    }
  ]
}
```

### Get Poll by Poll ID

GET - /poll/{id}
GET - /poll/e359c9fd-bbaa-418f-a1ab-8dff619beedf

Output:

```
{
  "success": true,
  "response": {
    "id": "e359c9fd-bbaa-418f-a1ab-8dff619beedf",
    "title": "Poll description",
    "options": [
      {
        "id": 0,
        "title": "Option description #1",
        "voteCount": 0
      },
      {
        "id": 1,
        "title": "Option description #2",
        "voteCount": 0
      }
    ],
    "createdDate": "2022-01-16T05:47:56.049Z",
    "updatedDate": "2022-01-16T05:47:56.049Z"
  }
}
```

### Create Vote to a Poll

POST - /poll/{id}/vote
POST - /poll/e359c9fd-bbaa-418f-a1ab-8dff619beedf/vote

Input:

```
{
  "optionId": 0
}
```

Output:

```
{
  "success": true,
  "response": {
    "id": "e359c9fd-bbaa-418f-a1ab-8dff619beedf",
    "title": "Poll description",
    "options": [
      {
        "id": 0,
        "title": "Option description #1",
        "voteCount": 0
      },
      {
        "id": 1,
        "title": "Option description #2",
        "voteCount": 1
      }
    ],
    "createdDate": "2022-01-16T05:47:56.049Z",
    "updatedDate": "2022-01-16T05:55:02.020Z"
  }
}
```

### Check User Vote status

GET - /poll/{id}/check-vote
GET - /poll/e359c9fd-bbaa-418f-a1ab-8dff619beedf/check-vote

status value:

- true: User has existing vote to pollId
- false: User has not voted to pollId

Output:

```
{
  "success": true,
  "response": {
    "status": true
  }
}
```
