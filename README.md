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

### Mockpass

To run sgID mock locally, clone https://github.com/opengovsg/mockpass and set env SHOW_LOGIN_PAGE=true

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
- Check User Vote status

Authentication API:

- Authenticate User

API Authorization uses HTTP Headers: Authorization. (Temporary solution)

```
Bearer <userId>
```

\<userId\> is free text, no format validation or encryption for now. \<pollId\>-\<userId\> is stored to vote-user table for validating if user has voted before.

### Create Poll

POST - /api/poll
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

GET - /api/poll

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

GET - /api/poll/{id}

GET - /api/poll/e359c9fd-bbaa-418f-a1ab-8dff619beedf

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

POST - /api/poll/{id}/vote

POST - /api/poll/e359c9fd-bbaa-418f-a1ab-8dff619beedf/vote

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

GET - /api/poll/{id}/check-vote

GET - /api/poll/e359c9fd-bbaa-418f-a1ab-8dff619beedf/check-vote

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

### Authenticate User

GET - /api/auth?target={path}

GET - /api/auth?target=/poll

Calling this API will redirect user-agent to sgID. Upon successful authentication it will redirect to 'target' URL and set cookie 'u' with sgID openid.
(Temporary solution)
