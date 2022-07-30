const express = require("express");
const bodyPaser = require("body-parser");
const request = require("request");

const https = require("https");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyPaser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signUp.html");
});

app.post("/", (req, res) => {
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/cd55a8967b";

    const options = {
        method : "POST",
        auth: "tony14:df9b06f576d138ef02b7166fed6d4334-us14"
    }

    const request = https.request(url, options, (resp) => {
        if (resp.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }

        resp.on("data", (data) => {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
});

app.post("/failure", (req, res) => {
    res.redirect("/");
});

app.listen(process.env.PORT || port, () => {
    console.log("The app is running on port " + port);
});

// API Key
// df9b06f576d138ef02b7166fed6d4334-us14
// List id
// cd55a8967b