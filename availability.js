var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');
var cors = require('cors')
var express = require('express');
var app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'))


var PORT = process.env.PORT || 8089;

app.listen(PORT, function () {
console.log(`Server running, Express is listening on port ${PORT}...`);
});


app.get('/wittech', function (req, res) {
  var sql = `SELECT BIB_TEXT.TITLE, MFHD_MASTER.MFHD_ID, MFHD_ITEM.ITEM_ID, Count(CIRC_TRANSACTIONS.CIRC_TRANSACTION_ID) AS STATUS, CIRC_TRANSACTIONS.CURRENT_DUE_DATE
FROM ((((MFHD_ITEM INNER JOIN MFHD_MASTER ON MFHD_ITEM.MFHD_ID = MFHD_MASTER.MFHD_ID) LEFT JOIN CIRC_TRANSACTIONS ON MFHD_ITEM.ITEM_ID = CIRC_TRANSACTIONS.ITEM_ID) INNER JOIN LOCATION ON MFHD_MASTER.LOCATION_ID = LOCATION.LOCATION_ID) INNER JOIN BIB_MFHD ON MFHD_MASTER.MFHD_ID = BIB_MFHD.MFHD_ID) INNER JOIN BIB_TEXT ON BIB_MFHD.BIB_ID = BIB_TEXT.BIB_ID
WHERE (((LOCATION.LOCATION_CODE)='WITTECH'))
GROUP BY BIB_TEXT.TITLE, MFHD_MASTER.MFHD_ID, MFHD_ITEM.ITEM_ID, CIRC_TRANSACTIONS.CURRENT_DUE_DATE
ORDER BY BIB_TEXT.TITLE`;
getResults(req, res, sql);
})


//get item status from items in req.body.itemIDs
app.post('/item', function (req, res) {

  var itemIDs = req.body.itemIDs;


  var sql = `SELECT CIRC_TRANSACTIONS.ITEM_ID AS ITEM_ID, Count(CIRC_TRANSACTIONS.CIRC_TRANSACTION_ID) AS STATUS
FROM CIRC_TRANSACTIONS RIGHT JOIN ITEM ON CIRC_TRANSACTIONS.ITEM_ID = ITEM.ITEM_ID
WHERE ITEM.ITEM_ID In (${itemIDs})
GROUP BY CIRC_TRANSACTIONS.ITEM_ID`;

  getResults(req, res, sql);

// //setup database connection
//   oracledb.getConnection(
//   {
//     user          : dbConfig.user,
//     password      : dbConfig.password,
//     connectString : dbConfig.connectString
//   },
//   function(err, connection) {
//     if (err) {
//       console.log('Error in acquiring connection ...');
//       console.log('Error message '+err.message);
//       res.status(500).send(err.message)
//       doRelease(connection);
//       return;
//     }
//      console.log('connection successful')
//      //console.log(`executing ${selectStatement}`)
//     connection.execute(sql,
//        {},
//        {outFormat: oracledb.OBJECT},  // Return the result as Object
//        function (err, result) {
//         if (err) {
//           console.log('Error in execution of select statement'+err.message);
//           res.status(500).send(err.message)
//         } else {
//
//
//         res.json(result.rows);
//       }
//       doRelease(connection);
//     });
//
//
//   });


});

//return all items from all MFHDs in req.body.mfhdIDs
app.post('/mfhd', function (req, res) {

  var mfhdIDs = req.body.mfhdIDs;


  var sql = `SELECT MFHD_MASTER.MFHD_ID, MFHD_ITEM.ITEM_ID, Count(CIRC_TRANSACTIONS.CIRC_TRANSACTION_ID) AS STATUS
FROM (MFHD_ITEM INNER JOIN MFHD_MASTER ON MFHD_ITEM.MFHD_ID = MFHD_MASTER.MFHD_ID) LEFT JOIN CIRC_TRANSACTIONS ON MFHD_ITEM.ITEM_ID = CIRC_TRANSACTIONS.ITEM_ID
WHERE (((MFHD_MASTER.MFHD_ID) In (${mfhdIDs})))
GROUP BY MFHD_MASTER.MFHD_ID, MFHD_ITEM.ITEM_ID`;

getResults(req, res, sql);

// //setup database connection
//   oracledb.getConnection(
//   {
//     user          : dbConfig.user,
//     password      : dbConfig.password,
//     connectString : dbConfig.connectString
//   },
//   function(err, connection) {
//     if (err) {
//       console.log('Error in acquiring connection ...');
//       console.log('Error message '+err.message);
//       res.status(500).send(err.message)
//       doRelease(connection);
//       return;
//     }
//      console.log('connection successful')
//      //console.log(`executing ${selectStatement}`)
//     connection.execute(sql,
//        {},
//        {outFormat: oracledb.OBJECT},  // Return the result as Object
//        function (err, result) {
//         if (err) {
//           console.log('Error in execution of select statement'+err.message);
//           res.status(500).send(err.message)
//         } else {
//
//
//         res.json(result.rows);
//       }
//       doRelease(connection);
//     });
//
//
//   });
//

});

app.get('/mfhd/:id', function (req, res) {

  var mfhdID = req.params.id;


  var sql = `SELECT MFHD_MASTER.MFHD_ID, MFHD_ITEM.ITEM_ID, Count(CIRC_TRANSACTIONS.CIRC_TRANSACTION_ID) AS STATUS
FROM (MFHD_ITEM INNER JOIN MFHD_MASTER ON MFHD_ITEM.MFHD_ID = MFHD_MASTER.MFHD_ID) LEFT JOIN CIRC_TRANSACTIONS ON MFHD_ITEM.ITEM_ID = CIRC_TRANSACTIONS.ITEM_ID
WHERE MFHD_MASTER.MFHD_ID = ${mfhdID}
GROUP BY MFHD_MASTER.MFHD_ID, MFHD_ITEM.ITEM_ID`;

getResults(req, res, sql);
//setup database connection
//   oracledb.getConnection(
//   {
//     user          : dbConfig.user,
//     password      : dbConfig.password,
//     connectString : dbConfig.connectString
//   },
//   function(err, connection) {
//     if (err) {
//       console.log('Error in acquiring connection ...');
//       console.log('Error message '+err.message);
//       res.status(500).send(err.message)
//       doRelease(connection);
//       return;
//     }
//      console.log('connection successful')
//      //console.log(`executing ${selectStatement}`)
//     connection.execute(sql,
//        {},
//        {outFormat: oracledb.OBJECT},  // Return the result as Object
//        function (err, result) {
//         if (err) {
//           console.log('Error in execution of select statement'+err.message);
//           res.status(500).send(err.message)
//         } else {
//
//
//         res.json(result.rows);
//       }
//       doRelease(connection);
//     });
//
//
//   });
//
//
});



app.get('/item/:id', function (req, res) {

  var itemID = req.params.id;

  var sql = `SELECT COUNT(CIRC_TRANSACTION_ID) AS status
                        FROM CIRC_TRANSACTIONS
                        WHERE CIRC_TRANSACTIONS.ITEM_ID =` + itemID;

  getResults(req, res, sql);

//setup database connection
  // oracledb.getConnection(
  // {
  //   user          : dbConfig.user,
  //   password      : dbConfig.password,
  //   connectString : dbConfig.connectString
  // },
  // function(err, connection) {
  //   if (err) {
  //     console.log('Error in acquiring connection ...');
  //     console.log('Error message '+err.message);
  //     res.status(500).send(err.message)
  //     doRelease(connection);
  //     return;
  //   }
  //    console.log('connection successful')
  //    //console.log(`executing ${selectStatement}`)
  //   connection.execute(sql,
  //      {},
  //      {outFormat: oracledb.OBJECT},  // Return the result as Object
  //      function (err, result) {
  //       if (err) {
  //         console.log('Error in execution of select statement'+err.message);
  //         res.status(500).send(err.message)
  //       } else {
  //       //console.log('db response is ready '+result.rows);
  //
  //       res.json(result.rows);
  //     }
  //     doRelease(connection);
  //   });
  //
  //
  // });


});



function doRelease(connection) {
  connection.release(
  function(err) {
    if (err) {
    console.error(err.message);
    }
  });
}

function getResults(req, res, sql) {

  //setup database connection
    oracledb.getConnection(
    {
      user          : dbConfig.user,
      password      : dbConfig.password,
      connectString : dbConfig.connectString
    },
    function(err, connection) {
      if (err) {
        console.log('Error in acquiring connection ...');
        console.log('Error message '+err.message);
        res.status(500).send(err.message)
        doRelease(connection);
        return;
      }
       console.log('connection successful')
       //console.log(`executing ${selectStatement}`)
      connection.execute(sql,
         {},
         {outFormat: oracledb.OBJECT},  // Return the result as Object
         function (err, result) {
          if (err) {
            console.log('Error in execution of select statement', err.message);
            res.status(500).send(err.message)
          } else {
          //console.log('db response is ready '+result.rows);
          console.log(result.rows);
          res.send(result.rows);
        }
        doRelease(connection);
      });


    });


  };
