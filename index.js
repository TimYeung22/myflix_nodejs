const express = require("express");
const app = express();
const https = require('http');
const mongoose=require('mongoose');
const bodyParser = require('body-parser');
var path = require('path');
const fs = require("fs");
const uuidlist = [];
const vidcatlist = [];
const catlist = [];
const namelist = [];
const catnamelist = [];
const uidlist = [];
const relist = [];

let url = "http://34.105.184.223/";
let reurl = "http://34.105.134.254/myflix/re"
let videosurl = url + "myflix/videos";
let caturl = url + "myflix/categories";


https.get(videosurl,(res) => {
    let body = "";

    res.on("data", (chunk) => {
        body += chunk;
    });

    res.on("end", () => {
        try {
            let json = JSON.parse(body);
            videocatalogue = json;
			for (var i = 0; i < videocatalogue.length; i++) {
				uuidlist.push(videocatalogue[i].video.uuid);
				vidcatlist.push(videocatalogue[i].video.category);
				namelist.push(videocatalogue[i].video.Name);
			}
        } catch (error) {
            console.error(error.message);
        };
    });

}).on("error", (error) => {
    console.error(error.message);
});

https.get(reurl,(res) => {
    let body = "";

    res.on("data", (chunk) => {
        body += chunk;
    });

    res.on("end", () => {
        try {
            let json = JSON.parse(body);
            reclist = json;
			for (var i = 0; i < reclist.length; i++) {
				uidlist.push(reclist[i].u_id);
				relist.push(reclist[i].i_id);
			}
        } catch (error) {
            console.error(error.message);
        };
    });
}).on("error", (error) => {
    console.error(error.message);
});

https.get(caturl,(res) => {
    let body = "";

    res.on("data", (chunk) => {
        body += chunk;
    });

    res.on("end", () => {
        try {
            let json = JSON.parse(body);
            catcatalogue = json;
			for (var i = 0; i < catcatalogue.length; i++) {
				catlist.push(catcatalogue[i]._id.$oid);
				catnamelist.push(catcatalogue[i].category);
			}
        } catch (error) {
            console.error(error.message);
        };
    });
}).on("error", (error) => {
    console.error(error.message);
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get('/uuid', function(req, res){
  res.send(uuidlist);
 });
 
app.get('/uuid/:id', function(req, res){
  vcatid = 0;
  let vuuid = req.params.id;
  for (var i = 0; i < uuidlist.length; i++) {
		if(vuuid == uuidlist[i]){
			vcatid = vidcatlist[i];
		}
  }
	for (var j = 0; j < catlist.length; j++){
		if(vcatid == catnamelist[j]){
			res.send(catnamelist[j]);
		}
	}
	res.end();
 });

app.get('/re/:id', function(req, res){
  vcatid = 0;
  let recomlist = [];
  let recomnameist = [];
  let uid = req.params.id;
  for (var i = 0; i < uidlist.length; i++) {
		if(uid == uidlist[i]){
			recomlist.push(relist[i]);
		}
  }
	for (var i = 0; i < recomlist.length; i++) {
		for (var j = 0; j < uuidlist.length; j++){
			if(recomlist[i] == uuidlist[j]){
				recomnameist.push(namelist[j]);
			}
		}
	}
	res.send(recomnameist);
});
 
app.get('/catalogues', function(req, res){
  res.send(catnamelist);
 });

app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, '/')));
app.use(express.static(path.join(__dirname, 'public')));
app.post("/video", function (req, res) {
  videoPath = req.body.videoname;
});

app.get("/thumb/:id", function (req, res) {
	imagepath = 'thumb/'+req.params.id+'.png';
	fs.readFile(imagepath, function(err, content) {
    if (err) {
      console.log("No thumbnail");
    } else {
      res.writeHead(200, { "Content-type": "image/png" });
      res.end(content);
    }
	  });
});

app.get("/vidname/:id", function(req, res){
  let vid = req.params.id;
  let name = "";
  console.log(req.params.id);
  for (var j = 0; j < uuidlist.length; j++){
		if(vid == uuidlist[j]){
			name = namelist[j];
		}
	}
  res.send(name);
});

app.get("/videos/:id", function (req, res) {
  videoPath = 'vid/'+req.params.id+'.mp4';
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
  }

  const videoSize = fs.statSync(videoPath).size;

  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, headers);

  const videoStream = fs.createReadStream(videoPath, { start, end });

  videoStream.pipe(res);
});

app.post('/login',(req, res) => {
	console.log(req.body.username);
  });

app.listen(8000, function () {
  console.log("Listening on port 8000!");
});
