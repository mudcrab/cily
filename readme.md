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
```

#### Build project
`POST /:id/build`

```
```

#### Get project builds
`GET /:id/buids`

```
```

#### Get last build
`GET /:id/builds/last`

```
```

## BUILDS

#### Get build
`GET /build/:id/:project`

```
```