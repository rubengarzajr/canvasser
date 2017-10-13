
# Supported File Types:
```
Supported files: json, mp3, jpg, gif, png, wav, html
Image files: jpg, gif, png
Sound files: mp3, wav
```

# Get

## Get all files in all Projects
```
GET SERVER/api/v1/files
```
Sample response:
```
[
  {"project":"kitty", "url":"SERVER/canvasser_content/kitty/json/meow.json",           type:"json"},
  {"project":"rub",   "url":"SERVER/canvasser_content/rub/image/cute-kitty-frog2.jpg", type:"image"},
  {"project":"test",  "url":"SERVER/canvasser_content/test/json/hiss.json",            type:"json"}
]
```

## Get all of a type in all Projects
To get all image files, use ?type=image  
To get all sound files, use ?type=sound
```
GET SERVER/api/v1/files?type={fileType}
```
Sample response:
```
[
  {"project":"kitty", "url":"SERVER/canvasser_content/kitty/json/meow.json",     type:"json"},
  {"project":"rub",   "url":"SERVER/canvasser_content/rub/json/en.json",         type:"json"},
  {"project":"test",  "url":"SERVER/canvasser_content/test/json/test.json",      type:"json"}
]
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

## Get all of a type in a Project
To get all image files, use ?type=image  
To get all sound files, use ?type=sound
```
GET SERVER/api/v1/projects/{projectName}/files?type={fileType}
```
Sample response:
```
[
  {"project":"kitty", "url":"SERVER/canvasser_content/kitty/json/meow.json",     type:"json"},
  {"project":"kitty", "url":"SERVER/canvasser_content/kitty/json/en.json",       type:"json"}
]
```

# POST

## Post a file to a Project

```
POST SERVER/api/v1/projects/{projectName}/files/{fileName.extension}
```
Sample response:
```
[
  {"project":"kitty", "url":"SERVER/canvasser_content/kitty/json/meow.json",     type:"json"},
]
```

# DELETE

## Delete a project
```
DELETE SERVER/api/v1/projects/{projectName}
```
Sample response:
```
[{"status":"delete command received"}]
```
## Delete a specific file in a project
```
DELETE api/v1/projects/{projectName}/files/{fileName.ext}
```

```
[{"status":"delete command received"}]
```


# RENAME
## Rename a file in a project
```
```
## Rename a project
```
```
# COPY
## Copy a file in a project
```
```
## Copy a project
```
```
