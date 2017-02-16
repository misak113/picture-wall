Picture Wall
============

You can start server with --config argument where can be specified implementations of DataDriver, FileDriver & ImageResizeDriver.

## config.json
```
{
  "dataDriver": {
    "module": "./lib/FSDataDriver", // path to data saving driver. By default is stored as JSON on file system to ${project}/data folder 
    "args": ["./data"] // inject arguments to constructor
  },
  "fileDriver": {
    "module": "./lib/FSFileDriver", // path to file saving driver. By default is stored to file system to ${project}/upload folder
    "args": ["./upload"] // inject arguments to constructor
  },
  "imageResizeDriver": {
    "module": "./lib/ImageResize/LwipDriver", // path to image resize driver. By default is used linux like driver using package lwip. Also available SharpDriver (linux also using sharp) & ImagesDriver (windows some architectures using images module)
    "args": [] // inject arguments to constructor
  }
}
```

