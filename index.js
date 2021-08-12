"use strict";

const https = require("https"),
  host = "ssl.bing.com",
  url = require("url"),
  missingKey = "missing Bing API Key - https://docs.microsoft.com/en-us/bingwebmaster/getting-access",
  missingSiteURL = "missing site URL that is verified in the Bing Webmaster Tools";

function isURL(src) {
  try {
    let result = url.parse(src);

    return !!result;
  } catch (error) {
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

function cleanUrlList(urlList) {
  for (let index = 0; index < urlList.length; index++) {
    urlList[index] = cleanURL(urlList[index]);
  }

  return urlList;
}


/*
  reference - https://docs.microsoft.com/en-us/dotnet/api/microsoft.bing.webmaster.api.interfaces.iwebmasterapi.geturlsubmissionquota?view=bing-webmaster-dotnet

  options = {
    apiKey: '[your api key],
    siteUrl: '[your site origin https://yoursite.tld]'
  }


*/
exports.getQuota = function(options){

 return new Promise((resolve, reject) => {

    if (!options.apiKey) {

      reject(missingKey);

      return;
    }

    if (!options.siteUrl || !isURL(options.siteUrl)) {
      reject(missingSiteURL);

      return;
    }

    let bingURL = "/webmaster/api.svc/json/GetUrlSubmissionQuota?siteUrl=" + options.siteUrl + "&apikey=" + options.apiKey;

    const config = {
      hostname: host,
      path: bingURL,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": 100
      }
    };

    const req = https.request(config, res => {

        let data = "";

        res.on("data", chunk => {
          data += chunk;
        });

        res.on("end", () => {
          resolve(data);
        });

      })
      .on("error", err => {
        reject(err.message);
      });

    req.write(body);
    req.end();

  });

};

exports.pingBing = function(options) {

  return new Promise((resolve, reject) => {
    
    if (!options.apiKey) {
      reject(missingKey);

      return;
    }

    if (!options.siteUrl || !isURL(options.siteUrl)) {
      reject(missingSiteURL);

      return;
    }

    if (
      (!options.url || !isURL(options.url)) &&
      !isValidUrlList(options.urlList)
    ) {
      reject("missing URL(s) to submit to Bing for Indexing");

      return;
    }

    let payload = {},
      bingURL;

    if (options.url) {
      bingURL = "/webmaster/api.svc/json/SubmitUrl?apikey=" + options.apiKey;

      payload = {
        siteUrl: cleanURL(options.siteUrl),
        url: cleanURL(options.url)
      };
    } else {
      bingURL =
        "/webmaster/api.svc/json/SubmitUrlbatch?apikey=" + options.apiKey;

      payload = {
        siteUrl: cleanURL(options.siteUrl),
        urlList: cleanUrlList(options.urlList)
      };
    }

    let body = JSON.stringify(payload);

    const config = {
      hostname: host,
      path: bingURL,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": body.length
      }
    };

    const req = https.request(config, res => {

        let data = "";

        res.on("data", chunk => {
          data += chunk;
        });

        res.on("end", () => {
          resolve(data);
        });

      })
      .on("error", err => {
        reject(err.message);
      });

    req.write(body);
    req.end();

  });
  
};
