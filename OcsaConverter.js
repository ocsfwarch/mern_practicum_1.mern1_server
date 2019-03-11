const speech = require("@google-cloud/speech");
const fs = require("fs");
const nodemailer    = require('nodemailer');
const smtpTransport = require("nodemailer-smtp-transport");
const MAIL_SERVER_URL = "192.169.245.1";

class OcsaConverter{
    constructor(props){

        // Establish all bindings

        // Set the default state
    }

    // The purpose of this function is to transcribe the file
    // from audio to text, if required, save the transcribed file,
    // and send an email with the transcribed file as the attachment
    performConversion(objJson){
        let newFileAndPath = "";
        let newFilename    = "";
        console.log("******************");
        console.log(objJson.file_name);
        console.log(objJson.file_description);
        console.log(objJson.file_email);
        console.log(objJson.file_path);
        console.log(objJson.file_transcribe);

        if(objJson.file_transcribe){
            console.log("Needs to be transcribed");
            objJson.file_path_trans = this.createTranscribedFilename(objJson.file_path);
            objJson.file_name_trans = this.createTranscribedFilename(objJson.file_name);
            this.performTranslation(objJson).catch(console.error);
        }else{
            console.log("Does not need to be transcribed");
            objJson.file_path_trans = this.createTranscribedFilename(objJson.file_path);
            objJson.file_name_trans = this.createTranscribedFilename(objJson.file_name);
            fs.copyFile(objJson.file_path, newFileAndPath, (err) => {
                if(err){
                    console.log("There was an error copying the file");
                }else{
                    console.log("File copy was successful");
                    this.sendEmail(objJson);
                }
            });
        }
        console.log("******************");

    }// End performConversion

    createTranscribedFilename(orgFilenameAndPath){
        let strReturn = "";
        
        let nPos = orgFilenameAndPath.lastIndexOf(".");
        if(nPos !== -1){
            strReturn = orgFilenameAndPath.substring(0, nPos) + "_trans.txt";
        }else{
            strReturn = orgFilenameAndPath + "_trans.txt";
        }

        return strReturn;
    }

    sendEmail(objJson){
        console.log("OcsaConverter.sendMail called for " + objJson.file_path_trans);
        
        const transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host:'smtp.gmail.com',
            port: 465,
            auth:{
                user:'tpartcal@gmail.com',
                pass:'TP2013bb!'
            }
        }));

        const mailOptions = {
            from: 'tpartcal@gmail.com',
            to: objJson.file_email,
            subject: 'Audio to Text Transformation Complete',
            text: objJson.file_description,
            attachments:[{
                filename:objJson.file_name_trans,
                path: objJson.file_path_trans
            }]
        }

        transporter.sendMail(mailOptions, function(err, info){
            if(err){
                console.log("mail was not sent " + err);
                //res.send("mail was not sent");
            }else{
                console.log("mail was sent");
                //res.send("MAIL WAS SENT!!!");
            }
        });
        
        console.log("OcsaConverter.sendEmail COMPLETE");
    }// End sendEmail

    async performTranslation(objJson){
        console.log("File to Transcribe = " + objJson.file_path);
        // Create a client
        const client = new speech.SpeechClient();

        // The name of the audio file to transcribe
        const fileName = objJson.file_path;

        // Read the local audio file and convert it to base64
        const file = fs.readFileSync(fileName);
        const audioBytes = file.toString('base64');
        //const audioBytes = 0;

        // Set the configuration        
        const audio = {
            content:audioBytes,
        };
        const config = {
            encoding:'LINEAR16',
            //sampleRateHertz:44100, // Let Google determine this value
            languageCode: 'en-US',
            model:'default'
        };
        const request = {
            audio:audio,
            config:config,
        };
        
        const strReturn = "OcsaConverter is processing file = " + objJson.file_path;
        console.log(strReturn);

        client.recognize(request)
            .then(data => {
                const response = data[0];
                const transcription = response.results
                    .map(result => result.alternatives[0].transcript)
                    .join('\n');
                    // Create a new file and write it to the server
                    let writeStream = fs.createWriteStream(objJson.file_path_trans);
                    writeStream.write(transcription);
                    writeStream.end();
                    //console.log(`Transcription: ${transcription}`);
                    this.sendEmail(objJson);
            })
            .catch(err => {
                console.error("ERROR:", err);
            });
    }// End performTranslation


};// End OcsaConverter

module.exports = OcsaConverter;
