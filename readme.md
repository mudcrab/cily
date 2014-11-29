# REDOIT

### Project

#### Get project
`GET /:id`

```
{
    "status": true,
    "data": {
        "id": 1,
        "name": "Test project",
        "repo_address": "git@github.com:mudcrab/redoit.git",
        "repo_type": "git",
        "repo_branch": "master"
    }
}
```

#### Save project
`POST|PATCH /:id/save`

```
{
    "status": true,
    "data": {
        "id": "1"
    }
}
```

#### Delete project
`DELETE /:id/remove`

```
{
    "status": true
}
```

#### Build project
`POST /:id/build`

```
{
    "status": true
}
```

#### Get project builds
`GET /:id/buids`

```
[
    {
        "id": 1,
        "task_id": 1,
        "status": null,
        "project_id": 1,
        "commit": null,
        "start_time": "2014-11-29T07:11:51.000Z",
        "end_time": null,
        "build_nr": 0
    },
    [ -- ]
    {
        "id": 16,
        "task_id": 1,
        "status": 1,
        "project_id": 1,
        "commit": "716c39d8e709a838d6d77f4020d6f1b0749c4688",
        "start_time": "2014-11-29T09:11:05.000Z",
        "end_time": "2014-11-29T09:11:07.000Z",
        "build_nr": 15
    }
]
```

#### Get last build
`GET /:id/builds/last`

```
{
    "project_id": 1,
    "id": 15,
    "task_id": 1,
    "status": 1,
    "commit": "716c39d8e709a838d6d77f4020d6f1b0749c4688",
    "start_time": "2014-11-29T09:11:36.000Z",
    "end_time": "2014-11-29T09:11:38.000Z",
    "build_nr": 14
}
```

## BUILDS

#### Get build
`GET /build/:id/:project`

```
{
    "status": true,
    "build": {
        "id": 16,
        "project_id": 1,
        "task_id": 1,
        "status": 1,
        "commit": "716c39d8e709a838d6d77f4020d6f1b0749c4688",
        "start_time": "2014-11-29T09:11:05.000Z",
        "end_time": "2014-11-29T09:11:07.000Z",
        "build_nr": 15
    },
    "log": "<cmd output>"
}
```