var mssql = require("mssql");
var dbConfig = {
    user: 'sa',
    password: 'xyz123#',
    server:'localhost',
    database: 'bloodbanklab',  //bloodbanklab
    drive: 'tedious',
    options:{
        instanceName: 'SQL',
    },

    // user: 'db_usertest',
    // password: 'IbkM2561#',
    // server:'5.189.154.54',
    // database: 'db_Labtest',  //bloodbanklab
    // drive: 'tedious',
    // options:{
    //     instanceName: 'SQL',
    // },



}
var connection = mssql.connect(dbConfig, function (err) {
    if (err)
        throw err;
});
var secret = "dsvweg23r23giyf23rhgjbhv";
module.exports = secret;
module.exports = connection;
