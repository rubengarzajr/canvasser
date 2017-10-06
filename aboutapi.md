
# Get

## Get all of a type in all Projects
```
GET SERVER/api/v1/files?type=json
```
Sample response:
```
[
  {"project":"kitty", "url":"SERVER/canvasser_content/kitty/json/meow.json",     type:"json"},
  {"project":"rub",   "url":"SERVER/canvasser_content/kitty/json/en.json",       type:"json"},
  {"project":"test",  "url":"SERVER/canvasser_content/kitty_cat/json/test.json", type:"json"}
]
```

## Get all files in all Projects
```
GET SERVER/api/v1/files
```
Sample response:
```
[
  {"project":"kitty", "url":"SERVER/canvasser_content/kitty/json/meow.json",             type:"json"},
  {"project":"rub",   "url":"SERVER/canvasser_content/kitty/image/cute-kitty-frog2.jpg", type:"image"},
  {"project":"test",  "url":"SERVER/canvasser_content/kitty_cat/json/hiss.json",         type:"json"}
]
```

## Get a Project
```
GET SERVER/api/v1/project/{projectName}
```
Sample response:
````
{
    "id":"kitty",
    "files":[
      {"project":"kitty", "url":"SERVER/canvasser_content/kitty/json/meow.json",             type:"json"},
      {"project":"kitty", "url":"SERVER/canvasser_content/kitty/image/cute-kitty-frog2.jpg", type:"image"},
      {"project":"kitty", "url":"SERVER/canvasser_content/kitty_cat/json/hiss.json",         type:"json"}
    ]
}
```

## Get all files in a Project
```
GET SERVER/api/v1/projects/{projectName}/files
```
Sample response:
```
[
      {"project":"kitty", "url":"SERVER/canvasser_content/kitty/json/meow.json",             type:"json"},
      {"project":"kitty", "url":"SERVER/canvasser_content/kitty/image/cute-kitty-frog2.jpg", type:"image"},
      {"project":"kitty", "url":"SERVER/canvasser_content/kitty_cat/json/hiss.json",         type:"json"}
]
```

## Get a file
```
GET SERVER/api/v1/files?project=name&file=name.ext
GET SERVER/api/v1/projects/{projectName}/files/{fileName.ext}
```
Sample response:
```
[{"project":"kitty", "url":"SERVER/canvasser_content/kitty/json/meow.json", type:"json"}]
```

# POST

# DELETE
05. Delete a specific file in a project
DELETE api/v1/files?project=name&file=name.ext
DELETE api/v1/projects/{projectName}/files/{fileName.ext}


06. Delete a project
DELETE api/v1/files?project=name
DELETE api/v1/projects/{projectName}

05. DELETE api/v1/projects/project=name

04. Upload a file    


POST JSON
   Extract Images / Sounds


07. Rename a file in a project
08. rename a project

09. Copy a file in a project
10. Copy a project
