var express = require('express');
var router = express.Router();
var redis = require("redis");
const uuidv4 = require('uuid/v4');
var mysql      = require('mysql');

function queryDB(sqlString,f){
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'LYGUber445',
    database : 'toutiaoClone'
  });
  connection.connect();
  connection.query(sqlString, function (error, results, fields) {
    if (error) throw error;
    //console.log('The solution is: ', results);
    f(results);
    return results;
  });
  connection.end();
}


// if there is no session setup session (generate values and
// insert into redis and request object ) and proceed to controllers
// else query redis to get session values and insert into request
// object and proceed to controllers
function sessionSetup(req, res, next){
  if (req.cookies.sid === undefined){
    var uuid = uuidv4();
    var isAuthenticated = false;
    var id = false;
    var email = false;
    var username = false;
    var client = redis.createClient();
    client.HMSET(uuid, {
      "isAuthenticated": isAuthenticated,
      "id": id,
      "email": email,
      "username": username
    }, function(){
      client.quit();
      req.session = {
        "isAuthenticated": isAuthenticated,
        "id": id,
        "email": email,
        "username": username
      }
      res.cookie('sid', uuid, { signed: false, maxAge: 60 * 1000, httpOnly: true });
      next();
    });
  } else {
    var client = redis.createClient();
    client.hgetall(req.cookies.sid, function (err, obj) {
      req.session = obj;
      client.quit();
      next();
    });


  }
}

function formatDate(date) {
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
}
/* GET home page. */
// if user is logged in or not get recommended videos
// and paginate them and display on page
// display search bar and navigation bar
// if user is logged in display profile page
// else display login and register links

// for scroll behavior, by default get 10 records
// when user scrolls to bottom send ajax get
// request to route with current num of records
// and offset database by such number
// if count of returned values is zero
// render popup message indicating end of data
// else render data dynamically into html page
router.get('/', sessionSetup, function(req, res, next) {
  // console.log(typeof req.session.isAuthenticated);
  // if (req.session.isAuthenticated === true){
  //   console.log(req.session.isAuthenticated);
  // }
  queryDB("select v.id as videoid, v.title, v.src, v.created, u.id, u.username from videos v inner join users u on v.userid = u.id where v.topicid = '1' order by v.created desc limit 10;",
      function(results){

    console.log(results);
    res.render('index', {
      title: 'Home',
      req: req,
      results: results
    });});

});

router.get('/videos', function(req, res, next){

})


module.exports = router;
