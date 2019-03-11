# OcsaPrac1/mern1_server

Project Overview:  
This is a practicum for the MERN stack, the goal is to build a full stack Javascript (MERN) application that allows users to upload/record speech/conversation of up to 60 minutes, translates the audio, and sends a text transcript to the user's email upon completion. This application will also allow a user to see archived text transcripts and includes frontend and backend test coverage.  

This application is composed of 2 main components: Front-end Web GUI (mern1_app) and Back-end Web Server (mern1_server). Communication between the front-end and back-end elements is structured and performed in a RESTful manner. The front-end will make requests to the back-end using http url command requests and json formatted parameters. The back-end will respond to these requests with json formatted data. Back-end serialization of data will be achieved using a NoSQL (MongoDB) database and local storage.  

Overview - mern1_server:  
This server application is based on the Express Web Framework for Node.js. All interaction with this server application are performed using RESTful transactions. This server application is not tied to any particular front-end GUI. This server application uses the MongoDB document database program for serialization of transcription requests. This server application also uses the system local storage for preservation of file downloads and uploads. 

This server application uses the Google "Cloud-to-Text" client library api for transcribing uploaded audio files to text. To access the Google client library a GCP Console project was required as well as establishing an environment variable (GOOGLE_APPLICATION_CREDENTIALS) that points to a JSON formatted file containing the service account key values for "OAuth 2.0" authorization.  
  
The nodemailer npm was chosen for the email portion of the requirements. This was selected due to its substantial level of support and longevity as a email transaction service. The Gmail SMTP service was used for the Email testing portion of this project.

Use Case 1 - Upload an audio/voice file:  
This use case starts when the System receives a "saveFile" http url request.  
The System will verify it has received a file and a JSON formatted request object.  
The system will store the received file to local storage.  
The System will store the request object to MongoDB.  
The System will construct a transcription request object.  
The System will trigger the file conversion process ("OcsaConverter.performConversion()").  
The System will return confirmation or rejection of the transcription request to the requestor.  
The System will verify the "file_transcribe" boolean to determine if transcription is required.
The System will create a transcription file name for storage of the transcribed results.  
The System will initialize the Google "Cloud-to-Text" client library.  
The System will upload the audio file for transcription to the Google "Cloud-to-Text" client library.  
The System will store to local storage the results from the transcription process.  
The System will send the transcribed results file as an attachment to the requesting email address.  
The System will write the results to the console.  
This use case ends when the system has written the results to console.  

Use Case 2 - Create a live audio/voice input:  
This use case starts when the System receives a "saveFile" http url request.  
The System will verify it has received a file and a JSON formatted request object.  
The system will store the received file to local storage.  
The System will store the request object to MongoDB.  
The System will construct a transcription request object.  
The System will trigger the file conversion process ("OcsaConverter.performConversion()").  
The System will return confirmation or rejection of the transcription request to the requestor.  
The System will verify the "file_transcribe" boolean to determine if transcription is required.  
The System will create a transcription file name for storage of the transcribed results.  
The System will store to local storage the results from the transcription process.  
The System will send the transcribed results file as an attachment to the requesting email address.  
The System will write the results to the console.  
This use case ends when the system has written the results to console.  

Use Case 3 - view previous transcriptions  
This use case starts when the System receives a "/search/:email" http url request.  
The System will perform a search of the MongoDB using the email address supplied.  
The System will return the results in JSON format to the requestor.  
This use case ends when the results are returned to the requestor.  

Use Case 4 - view a specific transaction  
This use case starts when the System receives a "/:id" http url request.  
The System will perform a search of the MongoDB using the id supplied.  
The System will use the file name in the returned results to access the transcribed results.  
The System will format the results in JSON.  
The System will return the results in JSON format to the requestor.  
This use case ends when the results are returned to the requestor.  

Testing:  
Postman was used as the url testing framework. Postman allows us to verify all links available in the application.  

Development Environment:  
Microsoft Windows 7 VM  
Chrome v 72  
Microsoft Visual Studio Code
MongoDB  
Express  
Mongoose  
Nodemailer  
React  
Node  

List of test tools:  
Jest  
Postman   
  
Information Links:  
W3C Web Speech API - https://w3c.github.io/speech-api/  
React - https://reactjs.org/  
Google Speech-to-Text - https://cloud.google.com/speech-to-text/  


