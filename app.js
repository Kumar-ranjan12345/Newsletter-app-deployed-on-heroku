const express =require("express") ;
const bodyParser = require("body-parser") ;
const request = require("request") ;
const https = require("https") ;
const { parse } = require("path");

const app = express() ;

app.use(express.static("public")) ; // we need this because when we start our server , our server cant access the css and images file(static files) located in our computer
app.use(bodyParser.urlencoded({extended: true})) ;

app.get("/" , function(req , res){
  res.sendFile(__dirname + "/signup.html") ; //this indicates when we request the home route fom our server , this should deliver the signup.html file to user 
})

app.post("/" , function(req , res) { // we needed this to parse input to the text boxes and to make a post request 
  const firstName = req.body.fName ;
  const lastName = req.body.lName ;
  const email = req.body.email ;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed" ,
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName 
        }
      }
    ]
  };


  const jsonData = JSON.stringify(data) ;
  const url = "https://us7.api.mailchimp.com/3.0/lists/98f0c1f819" ;
  const options = {
    method: "POST" ,
    auth: "kumar:dee6ca7730d737115c8746c6585ca9ca-us7"
  }

  const request = https.request(url , options , function(response){

    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html") ;
    }
    else{
      res.sendFile(__dirname + "/failure.html") ;
    }

    response.on("data" , function(data){
      console.log(JSON.parse(data)) ;
    })
  })

  request.write(jsonData) ;
  request.end() ;
})

app.post("/failure" , function(req , res){
  res.redirect("/") ;
})

app.listen(process.env.PORT || 3000 , function(){ //process.env.port allows us to use any port after deploying our app in internet
  console.log("server is running at port 3000") ;
}) ;

//dee6ca7730d737115c8746c6585ca9ca-us7
// 98f0c1f819 list id/audience id