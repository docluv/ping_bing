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
            - https://www.bing.com/indexnow

  options = {
    apiKey: '[your api key],
    siteUrl: '[your site origin https://yoursite.tld]'
  }

  {
  "host": "www.example.org",
  "key": "key",
  "keyLocation": "https://www.example.org/key.txt",
  "urlList": [
      "https://www.example.org/url1",
      "https://www.example.org/folder/url2",
      "https://www.example.org/url3"
      ]
}

*/
exports.getQuota = function (options) {

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

exports.submitUrls = await function (options) {

  if (!options.key) {

    throw missingKey;

  }

  if (!options.host || !isURL(options.host)) {

    throw missingSiteURL;

  }

  if (!options.keyLocation || !isURL(options.keyLocation)) {

    throw "missing IndexNow Key";

  }

  if (
    (!options.urlList || !isURL(options.urlList)) &&
    !isValidUrlList(options.urlList)
  ) {

    throw "missing URL(s) to submit to Bing for Indexing";

  }

  if (!Array.isArray(options.urlList)) {

    options.urlList = [options.urlList];

  }

  let body = JSON.stringify(options);

  const config = {
    hostname: host,
    path: "/IndexNow",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": body.length
    }
  };

  return new Promise((resolve, reject) => {

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
