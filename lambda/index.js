exports.handler = async (event) => {

    "use strict";

    const https = require("https"),
        host = "www.bing.com",
        url = require("url"),
        missingKey = "missing Bing API Key - https://docs.microsoft.com/en-us/bingwebmaster/getting-access",
        missingSiteURL = "missing site URL that is verified in the Bing Webmaster Tools";


    function isURL(src) {

        try {

            let result = url.parse(src);

            return !!result;

        } catch (error) {

            console.error(error);

            return false;
        }

    }

    function isValidUrlList(urlList) {

        if (!urlList || !urlList.length || urlList.length < 1) {
            return false;
        }

        let isValid = true;

        for (let index = 0; index < urlList.length; index++) {

            if (!isURL(urlList[index])) {

                isValid = false;
                index = urlList.length;

            }

        }

        return isValid;

    }

    function cleanURL(src) {

        return src.replace(/\//g, "/");

    }

    function submitURLs(options) {

        return new Promise((resolve, reject) => {

            if (!options.key) {

                resolve({
                    statusCode: 500,
                    body: JSON.stringify(missingKey),
                });

            }

            if (!options.host || !isURL(options.host)) {

                resolve({
                    statusCode: 500,
                    body: JSON.stringify(missingSiteURL),
                });

            }

            if (!options.keyLocation || !isURL(options.keyLocation)) {

                resolve( {
                    statusCode: 500,
                    body: JSON.stringify("missing IndexNow Key"),
                });

            }

            if (!options.urlList || !isValidUrlList(options.urlList)) {

                resolve( {
                    statusCode: 500,
                    body: JSON.stringify("missing URL(s) to submit to Bing for Indexing"),
                });

            }

            if (!Array.isArray(options.urlList)) {

                options.urlList = [options.urlList];

            }

            let body = JSON.stringify(options);

            const config = {
                hostname: host,
                path: "/indexnow",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": body.length
                },
                body: body
            };

            console.log("about to make the request");

            const req = https.request(config, res => {

                let data = "";

                if(res.statusCode === 200){


                }

                switch (res.statusCode) {

                    case 400:

                        resolve({
                            statusCode: 400,
                            body: JSON.stringify("Invalid format")
                        });

                        break;

                    case 403:

                        resolve({
                            statusCode: 403,
                            body: JSON.stringify("In case of key not valid (e.g. key not found, file found but key not in the file)")
                        });

                        break;

                    case 422:

                        resolve({
                            statusCode: 422,
                            body: JSON.stringify("In case of URLs don’t belong to the host or the key is not matching the schema in the protocol")
                        });

                        break;


                    case 429:

                        resolve({
                            statusCode: 429,
                            body: JSON.stringify("Too Many Requests (potential Spam)")
                        });

                        break;

                    default:

                        resolve({
                            statusCode: 200,
                            body: JSON.stringify("Success")
                        });

                        break;
                }


               // console.log('headers:', res.headers);

                // res.on("data", chunk => {
                //     data += chunk;
                // });

                // res.on("end", () => {

                //     console.log("finished");

                //     console.log(data);

                //     resolve(data);

                // });

            })
                .on("error", err => {

                    console.error("got an error");
                    console.error(err);

                    reject(err.message);
                });

            req.write(body);
            req.end();

        });

    }

    if (event.requestContext.http.method === "POST") {

        console.log(event.body);

        try {

            let body = await submitURLs(JSON.parse(event.body));

            return {
                statusCode: 200,
                body: JSON.stringify(body)
            };

        } catch (error) {

            return {
                statusCode: 500,
                body: JSON.stringify(error),
            };

        }

    } else {

        console.log("invalid method");

        return {
            statusCode: 500,
            body: JSON.stringify("Only POST allowed"),
        };

    }

};
