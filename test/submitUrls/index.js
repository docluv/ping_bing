const indexNow = require("../../index"),
    apiKey = "[Your API Key Here]";

const options = {
    "host": "www.example.org",
    "key": apiKey,
    "keyLocation": "https://www.example.org/" + apiKey + ".txt",
    "urlList": [
        "https://www.example.org/url1",
        "https://www.example.org/folder/url2",
        "https://www.example.org/url3"
    ]
};

indexNow.submitUrls(options)
    .then(body => {
        console.log("success: ", body);
    })
    .catch(err => {
        console.log("error: ", err);
    });