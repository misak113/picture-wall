Picture Wall
============

![Example](docs/example.png?raw=true)

You can start server with --config argument where can be specified implementations of DataDriver, FileDriver & ImageResizeDriver.

## Instalation & Start
```sh
npm install picture-wall --save
node node_modules/picture-wall/server.js
```

### With changed configuration
```sh
npm install picture-wall --save
nano config.json
node node_modules/picture-wall/server.js --config $PWD/config.json
```

## config.json (with defaults)
```js
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

Interfaces of replacable implementations are (in TS notation):

## DataDriver
```ts
interface DataDriver {
	getData(type: string, defaultValue: any = []): Promise<any>;
	saveData(type: string, data: any): Promise<void>;
}
```

## FileDriver
```ts
interface FileDriver {
        getFile(path: string): Promise<Buffer | string>;
        saveFile(type: string, data: string, mimeType: string = 'text/plain', encoding: string = 'utf8'): Promise<void>;
}

```

## ImageResizeDriver
```ts
interface ImageResizeDriver {
	resize(sourcePath: string, targetPath: string, options: { width: number; height: number; }): Promise<void>;
}
```

## Image drivers
There are 3 implemented types of image resizing drivers. Every is based on other node.js library (some works even on Windows systems).
- `./lib/ImageResize/LwipDriver` - `npm install lwip --save`
- `./lib/ImageResize/ImagesDriver` - `npm install images --save`
- `./lib/ImageResize/SharpDriver` - `npm install sharp --save`


## Google Drive Data & File Drivers
There are avaialable drivers for data & files to be stored in specified folder of google drive.
To setup gdrive drivers use following:
1. Go to [https://console.developers.google.com/apis/dashboard](https://console.developers.google.com/apis/dashboard)
2. Create your own project (ex.: `My picture wall`)
![Create project](docs/setup_gdrive_1.png?raw=true)
3. Go `Credentials` and `Create credentials` -> `OAuth client ID`
![Create credentials](docs/setup_gdrive_2.png?raw=true)
4. Select `Other`, fill Name and create.
![Create credentials other](docs/setup_gdrive_3.png?raw=true)
5. Download configuration JSON file
![Download credentials JSON](docs/setup_gdrive_4.png?raw=true)
6. Authenticate using following command to get tokens
```sh
node node_modules/picture-wall/tools/google_oauth2_getToken.js ~/Download/client_secret_000000000000-xxxx.apps.googleusercontent.com.json
```
After visiting shown page & pasting verification code you will see something like this:
```sh
Authorize this app by visiting this url: https://accounts.google.com/o/oauth2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive&response_type=code&client_id=000000000000-xxx.apps.googleusercontent.com&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob
Enter the code from that page here: 4/xxxxxxx_xxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
{"access_token":"xxxx","refresh_token":"xxxx","token_type":"Bearer","expiry_date":1511125384964}
```
7. Copy line with JSON containing tokens & also copy content of `~/Download/client_secret_000000000000-xxxx.apps.googleusercontent.com.json` and paste it into config.json file:
```js
{
  "dataDriver": {
    "module": "./lib/GDriveDataDriver",
    "args": [{
      "credentials": {"installed":/* ...client_secret...json file goes here */},
      "token": {"access_token": "xxxx","refresh_token": "xxxx","token_type": "Bearer","expiry_date": 1510948622527},
      "folderId": "GOOGLE_DRIVE_FOLDER_ID_FOR_DATA_GOES_HERE"
    }]
  },
  "fileDriver": {
    "module": "./lib/GDriveFileDriver",
    "args": [{
      "credentials": {"installed":/* ...client_secret...json file goes here */},
      "token": {"access_token": "xxxx","refresh_token": "xxxx","token_type": "Bearer","expiry_date": 1510948622527},
      "folderId": "GOOGLE_DRIVE_FOLDER_ID_FOR_IMAGES_GOES_HERE"
    }]
  },
  "imageResizeDriver": {
    "module": "./lib/ImageResize/SharpDriver",
    "args": []
  }
}
```
8. GOOGLE_DRIVE_FOLDER_ID_FOR_DATA_GOES_HERE & GOOGLE_DRIVE_FOLDER_ID_FOR_IMAGES_GOES_HERE will be found in your personal google drive in address bar.
![Search for gdrive folderId](docs/setup_gdrive_5.png?raw=true)

* To perform up saving of changes in /admin page, use gdrive cached drivers which will cache all files & datas to local /tmp/ directory using FS `./lib/GDriveCachedDataDriver` & `./lib/GDriveCachedFileDriver`.

## Other screenshots
![Example](docs/example_detail.png?raw=true)
