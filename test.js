const pingBing = require( "./" ),
    apiKey = "[Your API Key Here]",
    siteUrl = "[Your Bing Verified Site URL (domain)]";


const singleURL = {
    apiKey: apiKey,
    siteUrl: siteUrl,
    url: "[url to submit]"
};

const batchURLs = {
    apiKey: apiKey,
    siteUrl: siteUrl,
    urlList: [ "[url to submit]", "[url to submit]", "[url to submit]" ]
};

pingBing.pingBing( singleURL )
    .then( body => {
        console.log( "success: ", body );
    } )
    .catch( err => {
        console.log( "error: ", err );
    } );

pingBing.pingBing( batchURLs )
    .then( body => {
        console.log( "success: ", body );
    } )
    .catch( err => {
        console.log( "error: ", err );
    } );