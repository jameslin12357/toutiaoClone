var express = require('express');
var router = express.Router();
var redis = require("redis");
const uuidv4 = require('uuid/v4');
var mysql      = require('mysql');
var moment = require('moment');

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

function queryDBMulti(sqlString,f){
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'LYGUber445',
    database : 'toutiaoClone',
    multipleStatements: true
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
  queryDB("select v.id as videoid, v.title, v.src as videosrc, v.created, u.id, u.username, u.src, count(body) as count from videos v inner join users u on v.userid = u.id left join comments c on v.id = c.videoid where v.topicid = '1' group by v.id order by v.created desc limit 10;",
      function(results){
    res.render('home/index', {
      title: '首页',
      req: req,
      results: results,
      moment: moment
    });});
});

router.get('/videos/hot', sessionSetup, function(req, res, next) {
  queryDB("select v.id as videoid, v.title, v.src as videosrc, v.created, u.id, u.username, u.src, count(body) as count from videos v inner join users u on v.userid = u.id left join comments c on v.id = c.videoid where v.topicid = '2' group by v.id order by v.created desc limit 10;",
      function(results){
        res.render('home/hot', {
          title: '热点',
          req: req,
          results: results,
          moment: moment
        });});
});

router.get('/videos/live', sessionSetup, function(req, res, next) {
  queryDB("select v.id as videoid, v.title, v.src as videosrc, v.created, u.id, u.username, u.src, count(body) as count from videos v inner join users u on v.userid = u.id left join comments c on v.id = c.videoid where v.topicid = '3' group by v.id order by v.created desc limit 10;",
      function(results){
        res.render('home/live', {
          title: '直播',
          req: req,
          results: results,
          moment: moment
        });});
});

router.get('/videos/tech', sessionSetup, function(req, res, next) {
  queryDB("select v.id as videoid, v.title, v.src as videosrc, v.created, u.id, u.username, u.src, count(body) as count from videos v inner join users u on v.userid = u.id left join comments c on v.id = c.videoid where v.topicid = '4' group by v.id order by v.created desc limit 10;",
      function(results){
        res.render('home/tech', {
          title: '科技',
          req: req,
          results: results,
          moment: moment
        });});
});

router.get('/videos/ent', sessionSetup, function(req, res, next) {
  queryDB("select v.id as videoid, v.title, v.src as videosrc, v.created, u.id, u.username, u.src, count(body) as count from videos v inner join users u on v.userid = u.id left join comments c on v.id = c.videoid where v.topicid = '5' group by v.id order by v.created desc limit 10;",
      function(results){
        res.render('home/ent', {
          title: '娱乐',
          req: req,
          results: results,
          moment: moment
        });});
});

router.get('/videos/games', sessionSetup, function(req, res, next) {
  queryDB("select v.id as videoid, v.title, v.src as videosrc, v.created, u.id, u.username, u.src, count(body) as count from videos v inner join users u on v.userid = u.id left join comments c on v.id = c.videoid where v.topicid = '6' group by v.id order by v.created desc limit 10;",
      function(results){
        res.render('home/games', {
          title: '游戏',
          req: req,
          results: results,
          moment: moment
        });});
});

router.get('/videos/sports', sessionSetup, function(req, res, next) {
  queryDB("select v.id as videoid, v.title, v.src as videosrc, v.created, u.id, u.username, u.src, count(body) as count from videos v inner join users u on v.userid = u.id left join comments c on v.id = c.videoid where v.topicid = '7' group by v.id order by v.created desc limit 10;",
      function(results){
        res.render('home/sports', {
          title: '体育',
          req: req,
          results: results,
          moment: moment
        });});
});

router.get('/videos/cars', sessionSetup, function(req, res, next) {
  queryDB("select v.id as videoid, v.title, v.src as videosrc, v.created, u.id, u.username, u.src, count(body) as count from videos v inner join users u on v.userid = u.id left join comments c on v.id = c.videoid where v.topicid = '8' group by v.id order by v.created desc limit 10;",
      function(results){
        res.render('home/cars', {
          title: '汽车',
          req: req,
          results: results,
          moment: moment
        });});
});

router.get('/videos/finance', sessionSetup, function(req, res, next) {
  queryDB("select v.id as videoid, v.title, v.src as videosrc, v.created, u.id, u.username, u.src, count(body) as count from videos v inner join users u on v.userid = u.id left join comments c on v.id = c.videoid where v.topicid = '9' group by v.id order by v.created desc limit 10;",
      function(results){
        res.render('home/finance', {
          title: '财经',
          req: req,
          results: results,
          moment: moment
        });});
});

router.get('/videos/funny', sessionSetup, function(req, res, next) {
  queryDB("select v.id as videoid, v.title, v.src as videosrc, v.created, u.id, u.username, u.src, count(body) as count from videos v inner join users u on v.userid = u.id left join comments c on v.id = c.videoid where v.topicid = '10' group by v.id order by v.created desc limit 10;",
      function(results){
        res.render('home/funny', {
          title: '搞笑',
          req: req,
          results: results,
          moment: moment
        });});
});

router.get('/videos', function(req, res, next) {
    queryDB(`select v.id as videoid, v.title, v.src as videosrc, v.created, u.id, u.username, u.src, count(body) as count from videos v inner join users u on v.userid = u.id left join comments c on v.id = c.videoid where v.topicid = ${req.query.topicid} group by v.id order by v.created desc limit 10 offset ${req.query.offset};`,
        function (results) {
            res.json(results);
        });
});

// whether user is logged in or not display
// all topics as a board
router.get('/topics', sessionSetup, function(req, res, next) {
  queryDB("select * from topics;",
      function(results){
        res.render('topics/index', {
          title: '话题',
          req: req,
          results: results,
          moment: moment
        });});
});



// whether user is logged in or not display
// topic detail page which by default includes
// 10 videos of this topic and ajax scroll effect
// when user scrolls to bottom gets more videos
// if user clicks on followers tab then opens
// a new page and by default gets 10 followers
// and when user scrolls to bottom gets more followers
// or clears current data, switches tab, gets
// data and update DOM and binds events
router.get('/topics/:id', sessionSetup, function(req, res, next) {
  var id = req.params.id;
  queryDBMulti( `select t.id, t.title, t.description, t.src from topics t where t.id = '${id}';select v.id as videoid, v.title, v.src as videosrc, v.created, u.id, u.username, u.src, count(body) as count from videos v inner join users u on v.userid = u.id left join comments c on v.id = c.videoid where v.topicid = '${id}' group by v.id order by v.created desc limit 10;select count(*) as followersCount from topicfollowing where followed = '${id}';select * from topicfollowing where following = '${req.session.id}' and followed = '${id}';`,function (results) {
    if (results[0].length === 0){
      res.redirect('/404');
    } else {
      // if (req.session.isAuthenticated){
      //   queryDB(`select * from topicfollowing where following = '${req.session.id}' and followed = ${req.params.id};`,
      //       function(results){
      //         res.render('topics/show', {
      //           title: '话题',
      //           req: req,
      //           results: results,
      //           moment: moment
      //         });}
      //   );
      // }
      res.render('topics/show', {
        title: '话题',
        req: req,
        results: results,
        moment: moment
      });
    }
  });
});

router.get('/404',function(req,res,next){
  res.render('errors/404');
});
  // queryDB(`select t.id, t.title, t.description, t.src, 1,2,3,4,5 from topics t where t.id = '${req.params.id}' union select v.id as videoid, v.title, v.src as videosrc, v.created, u.id, u.username, u.src, count(body) as count, count(*) as videoCount from videos v inner join users u on v.userid = u.id left join comments c on v.id = c.videoid where v.topicid = '${req.params.id}' group by v.id order by v.created desc limit 10 union select count(*) as followersCount,1,2,3,4,5,6,7,8 from topicfollowing where followed = '${req.params.id}'`,
  //     function (results) {
  //     if (results.length === 0){
  //       res.redirect('/404');
  //     } else {
  //       res.json(results);
  //     }
  //     });



module.exports = router;
