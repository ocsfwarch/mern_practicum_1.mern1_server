const express       = require('express');
const app           = express();
const bodyParser    = require('body-parser');
const cors          = require('cors');
const mongoose      = require('mongoose');
const mern1Routes   = express.Router();
const upload        = require('express-fileupload');
let Mern1           = require('./mern1.model.js');
const fs            = require("fs");
const PORT          = 4000;

const OcsaConverter = require("./OcsaConverter.js");
let ocsaConverter = new OcsaConverter();

app.use(cors());
app.use(bodyParser.json());
app.use(upload());

mongoose.connect('mongodb://127.0.0.1:27017/mern1', {useNewUrlParser:true});
const connection = mongoose.connection;

connection.once('open', function(){
    console.log("MongoDb database connection was successfully established.");
});

mern1Routes.route('/saveFile').post(function(req, res){
    console.log("Received saveFile request");
    if(req.files){

        let fileItem           = req.files.fileitem;
        let strFilename        = fileItem.name;
        let jsonObj            = JSON.parse(req.body.model);
        let strFileDescription = jsonObj.file_description;
        let strEmail           = jsonObj.email;
        let bTranscribe        = jsonObj.transcribe;
        let strPathToFile      = "/temp/" + strFilename;

        console.log("Received a file = " + strFilename + "Transcribe = " + bTranscribe);
        
        // Save the file to disk
        fileItem.mv(strPathToFile, function(err){
            if(err){
                console.log(err);
                res.send("File was not sucessfully processed");
            }else{
                let objDbJson = {
                    file_name:strFilename,
                    file_description:strFileDescription,
                    file_email:strEmail,
                    file_status:"submitted"
                }
                let objTranscribeJson = {
                    file_name:strFilename,
                    file_name_trans:"",
                    file_description:strFileDescription,
                    file_email:strEmail,
                    file_path:strPathToFile,
                    file_path_trans:"",
                    file_transcribe:bTranscribe
                }
                // For testing only
                //res.send("File has been submitted for processing");
                
                // Save the information to the db
                let mern1 = new Mern1(objDbJson);
                mern1.save()
                .then(mern1 => {
                    // Trigger the file audio to speech processing here
                    process.nextTick(function(){
                        ocsaConverter.performConversion(objTranscribeJson);
                    });

                    // Return the results
                    console.log("returning results");
                    res.send("File has been submitted for processing");
                })
                .catch(err => {
                    res.send("File was not submitted for processing");
                });
                

            }// End else
        });
    }else{
        console.log("No File Found");
    }

    //res.status(200).json({'file':'got it'});
});

mern1Routes.route('/').get(function(req, res){
    Mern1.find(function(err, mern1){
        if(err){
            console.log(err);
        }else{
            res.json(mern1);
        }
    });
});

mern1Routes.route('/search/:email').get(function(req, res){
    const email = req.params.email;
    Mern1.find({file_email:email}, function(err, mern1){
        if(err){
            console.log(err);
        }else{
            res.json(mern1);
        }
    });
});

mern1Routes.route('/:id').get(function(req, res){
    const id = req.params.id;
    Mern1.findById(id, function(err, mern1){
        if(err){
            console.log(err);
        }else{
            console.log("FOUND = " + mern1.file_name);
            const strTranFilePath = "/temp/" + ocsaConverter.createTranscribedFilename(mern1.file_name);
            let strResults = "";
            const newItem = {
                file_description:mern1.file_description,
                file_name:mern1.file_name,
                file_status:mern1.status,
                file_email:mern1.file_email,
                file_data:"",
                id:mern1.id
            }

            fs.readFile(strTranFilePath, {encoding:'utf-8'}, function(err, data){
                if(err){
                    console.log("Error reading file");
                    strResults = "Error reading file";
                }else{
                    strResults = data;
                    //res.json(mern1);
                }
                newItem.file_data = strResults;
                res.json(newItem);
            });
        }
    });
});

app.use('/mern1', mern1Routes);

app.listen(PORT, function(){
    console.log("Server is running on Port: " + PORT);
})