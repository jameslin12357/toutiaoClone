var express = require('express');
var router = express.Router();
var redis = require("redis");
const uuidv4 = require('uuid/v4');
var mysql      = require('mysql');
var moment = require('moment');

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

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
  console.log(req.cookies.sid);
  if (req.cookies.sid === undefined){
    var uuid = uuidv4();
    var isAuthenticated = false;
    var id = false;
    var email = false;
    var username = false;
    var src = false;
    var client = redis.createClient();
    client.HMSET(uuid, {
      "isAuthenticated": isAuthenticated,
      "id": id,
      "email": email,
      "username": username,
      "src": src,
      "sid": uuid,
      "videoCreated": false,
      "videoUpdated": false,
      "videoDeleted": false,
      "userCreated": false,
      "userUpdated": false,
    }, function(){
      client.quit();
      req.session = {
        "isAuthenticated": isAuthenticated,
        "id": id,
        "email": email,
        "username": username,
        "src": src,
        "sid": uuid,
        "videoCreated": false,
        "videoUpdated": false,
        "videoDeleted": false,
        "userCreated": false,
        "userUpdated": false,
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

router.get('/searchByIndex', sessionSetup, function(req, res, next) {
  queryDB(`select v.id as videoid, v.title, v.src as videosrc, v.created, u.id, u.username, u.src, count(body) as count from videos v inner join users u on v.userid = u.id left join comments c on v.id = c.videoid group by v.id order by v.created desc limit 10 offset ${req.query.offset};`,
      function(results){
        res.json(results);
  });
});

router.get('/searchByFiltered', sessionSetup, function(req, res, next) {
  queryDB(`select v.id as videoid, v.title, v.src as videosrc, v.created, u.id, u.username, u.src, count(body) as count from videos v inner join users u on v.userid = u.id left join comments c on v.id = c.videoid where v.title like '%${req.query.search}%' group by v.id order by v.created desc limit 10 offset ${req.query.offset};`,
      function(results){
        res.json(results);
      });
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

router.get('/videos/new', sessionSetup, function(req, res, next){
  if (req.session.isAuthenticated === "false"){
    res.redirect('/login');
  } else {
    res.render('videos/new', {
      title: '创建',
      req: req,
      moment: moment
    });
  }
});

router.post('/videos', sessionSetup, function(req, res, next){
  if (req.session.isAuthenticated === "false"){
    res.redirect('/login');
  } else {
    var title = req.body.title;
    var description = req.body.description;
    var errors = [];
    if (title.length === 0){
      errors.push(1);
    }
    if (description.length === 0){
      errors.push(2);
    }
    if (errors.length !== 0){
      res.render('videos/failed2',{
        title: '添加',
        req: req,
        inputs: {
          "title": title,
          "description": description
        },
        errors: errors,
      });
    } else {
      // clean data and insert into database and return login page with success popup
      title = title.trim();
      description = description.trim();
      queryDB(`insert into videos (title, description, src, userid, topicid) values ('${title}','${description}','/videos/default.mp4','1008','1')`,
          function(results){
            var client = redis.createClient();
            client.HMSET(req.cookies.sid, {
              "videoCreated": true
            }, function(){
              client.quit();
              res.redirect(`/users/${req.session.id}`);
            });
      });
    }
  }
});

router.get('/videos', sessionSetup, function(req, res, next) {
    queryDB(`select v.id as videoid, v.title, v.src as videosrc, v.created, u.id, u.username, u.src, count(body) as count from videos v inner join users u on v.userid = u.id left join comments c on v.id = c.videoid where v.topicid = ${req.query.topicid} group by v.id order by v.created desc limit 10 offset ${req.query.offset};`,
        function (results) {
            res.json(results);
        });
});

router.get('/videos2', sessionSetup, function(req, res, next) {
  queryDB(`select v.id as videoid, v.title, v.src as videosrc, v.created, u.id, u.username, u.src, count(body) as count from videos v inner join users u on v.userid = u.id left join comments c on v.id = c.videoid where v.userid = ${req.query.userid} group by v.id order by v.created desc limit 10 offset ${req.query.offset};`,
      function (results) {
        res.json(results);
      });
});

router.get('/topicfollowers', sessionSetup, function(req, res, next) {
  queryDB(`select u.id, u.username, u.src from users u inner join topicfollowing tf on u.id = tf.following where tf.followed = '${req.query.topicid}' order by tf.created desc limit 10 offset ${req.query.offset};`,
      function (results) {
        res.json(results);
      });
});

router.get('/users', sessionSetup, function(req, res, next) {
  queryDB(`select u.id, u.username, u.src from users u inner join userfollowing uf on uf.followed = u.id where uf.following = '${req.query.userid}' order by uf.created desc limit 10 offset ${req.query.offset};`,
      function (results) {
        res.json(results);
      });
});

router.get('/users2', sessionSetup, function(req, res, next) {
  queryDB(`select u.id, u.username, u.src from users u inner join userfollowing uf on uf.following = u.id where uf.followed = '${req.query.userid}' order by uf.created desc limit 10 offset ${req.query.offset};`,
      function (results) {
        res.json(results);
      });
});

router.get('/users3', sessionSetup, function(req, res, next) {
  queryDB(`select c.body, c.created from comments c where c.userid = '${req.query.userid}' order by c.created desc limit 10 offset ${req.query.offset};`,
      function (results) {
        res.json(results);
      });
});

router.get('/users4', sessionSetup, function(req, res, next) {
  queryDB(`select v.id as videoid, v.title, v.src as videosrc, v.created, u.id, u.username, u.src, count(body) as count from videos v inner join users u on v.userid = u.id left join comments c on v.id = c.videoid where v.id in (select videoid from likes where userid = '${req.query.userid}') group by v.id order by v.created desc limit 10 offset ${req.query.offset};`,
      function (results) {
        res.json(results);
      });
});

router.get('/comments', sessionSetup, function(req, res, next) {
  queryDB(`select c.body, c.created, u.id, u.username, u.src from comments c inner join users u on c.userid = u.id where videoid = '${req.query.videoid}' order by created desc limit 10 offset ${req.query.offset};`,
      function (results) {
        res.json(results);
      });
});

router.post('/comments', sessionSetup, function(req, res, next){
  if (req.session.isAuthenticated === "false"){
    res.redirect('/login');
  } else {
    queryDB(`insert into comments (body, userid, videoid) values ('${req.body.body}','${req.body.userid}', '${req.body.videoid}')`,
        function(results){
          queryDB(`select * from comments order by created desc limit 1`,
              function(results){
                res.json(results);
              });

        });
  }
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
  queryDBMulti( `select t.id, t.title, t.description, t.src from topics t where t.id = '${id}';select v.id as videoid, v.title, v.src as videosrc, v.created, u.id, u.username, u.src, count(body) as count from videos v inner join users u on v.userid = u.id left join comments c on v.id = c.videoid where v.topicid = '${id}' group by v.id order by v.created desc limit 10;select count(*) as videosCount from videos where topicid = '${id}';select count(*) as followersCount from topicfollowing where followed = '${id}';select * from topicfollowing where following = '${req.session.id}' and followed = '${id}';`,function (results) {
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
        console.log(results);
      res.render('topics/show', {
        title: '话题',
        req: req,
        results: results,
        moment: moment
      });
    }
  });
});

router.get('/topics/:id/followers', sessionSetup, function(req, res, next) {
  var id = req.params.id;
  queryDBMulti( `select t.id, t.title, t.description, t.src from topics t where t.id = '${id}';select u.id, u.username, u.src from users u inner join topicfollowing tf on u.id = tf.following where tf.followed = '${id}' order by tf.created desc limit 10;select count(*) as videosCount from videos where topicid = '${id}';select count(*) as followersCount from topicfollowing where followed = '${id}';`,function (results) {
    if (results[0].length === 0){
      res.redirect('/404');
    } else {
      console.log(results);
      res.render('topics/showFollowers', {
        title: '话题',
        req: req,
        results: results,
        moment: moment
      });
    }
  });
});

router.post('/topicfollowings', sessionSetup, function(req, res, next){
   if (req.session.isAuthenticated === "false"){
     res.redirect('/login');
   } else {
     queryDB(`insert into topicfollowing (following, followed) values ('${req.body.userid}','${req.body.topicid}')`,
         function(results){
           res.json(results);
     });
   }
});

router.post('/deletetopicfollowings', sessionSetup, function(req, res, next){
  if (req.session.isAuthenticated === "false"){
    res.redirect('/login');
  } else {
    queryDB(`delete from topicfollowing where following = '${req.body.userid}' and followed = '${req.body.topicid}'`,
        function(results){
          res.json(results);
        });
  }
});

router.post('/likes', sessionSetup, function(req, res, next){
    if (req.session.isAuthenticated === "false"){
        res.redirect('/login');
    } else {
        queryDB(`insert into likes (userid, videoid) values ('${req.body.userid}','${req.body.videoid}')`,
            function(results){
                res.json(results);
            });
    }
});

router.post('/deletelikes', sessionSetup, function(req, res, next){
    if (req.session.isAuthenticated === "false"){
        res.redirect('/login');
    } else {
        queryDB(`delete from likes where userid = '${req.body.userid}' and videoid = '${req.body.videoid}'`,
            function(results){
                res.json(results);
            });
    }
});

router.post('/userfollowings', sessionSetup, function(req, res, next){
  if (req.session.isAuthenticated === "false"){
    res.redirect('/login');
  } else {
    queryDB(`insert into userfollowing (following, followed) values ('${req.body.following}','${req.body.followed}')`,
        function(results){
          res.json(results);
        });
  }
});

router.post('/deleteuserfollowings', sessionSetup, function(req, res, next){
  if (req.session.isAuthenticated === "false"){
    res.redirect('/login');
  } else {
    queryDB(`delete from userfollowing where following = '${req.body.following}' and followed = '${req.body.followed}'`,
        function(results){
          res.json(results);
        });
  }
});

router.get('/users/:id', sessionSetup, function(req, res, next){
  var id = req.params.id;
  queryDBMulti( `select u.id, u.email, u.username, u.src, u.bio, u.created from users u where u.id = '${id}';select v.id as videoid, v.title, v.src as videosrc, v.created, u.id, u.username, u.src, count(body) as count from videos v inner join users u on v.userid = u.id left join comments c on v.id = c.videoid where v.userid = '${id}' group by v.id order by v.created desc limit 10;select count(*) as videosCount from videos where userid = '${id}';select count(*) as topicsCount from topicfollowing where following = '${id}';select count(*) as followingCount from userfollowing where following = '${id}';select count(*) as followersCount from userfollowing where followed = '${id}';select count(*) as commentsCount from comments where userid = '${id}';select count(*) as likesCount from likes where userid = '${id}';select * from userfollowing where following = '${req.session.id}' and followed = '${id}';`,function (results) {
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
      var userUpdated = req.session.userUpdated;
      var videoCreated = req.session.videoCreated;
      var videoDeleted = req.session.videoDeleted;
      if (userUpdated === "true"){
        var client = redis.createClient();
        client.HMSET(req.cookies.sid, {
          "userUpdated": false
        });
        client.quit();
      }
      if (videoCreated === "true"){
        var client = redis.createClient();
        client.HMSET(req.cookies.sid, {
          "videoCreated": false
        });
        client.quit();
      }
      if (videoDeleted === "true"){
        var client = redis.createClient();
        client.HMSET(req.cookies.sid, {
          "videoDeleted": false
        });
        client.quit();
      }
      res.render('users/show', {
        title: '用户',
        req: req,
        results: results,
        moment: moment,
        userUpdated: userUpdated,
        videoCreated: videoCreated,
        videoDeleted: videoDeleted
      });
      // client.hgetall(req.cookies.sid, function (err, obj) {
      //   console.log(obj);
      //   videoDeleted = obj["videoDeleted"];
      //   if (videoDeleted === "true"){
      //     client.HMSET(req.cookies.sid, {
      //       "videoDeleted": false
      //     });
      //   }
      //   client.quit();
      // });
    }
  });
});

router.get('/users/:id/edit', sessionSetup, function(req, res, next){
  var id = req.params.id;
  queryDBMulti( `select u.id, u.email, u.username, u.src, u.bio, u.created from users u where u.id = '${id}';`,function (results) {
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
      if (req.session.isAuthenticated === "false"){
        res.redirect('/login');
      }
      if (String(req.session.id) !== id){
        res.redirect('/403');
      }
      console.log(results);
      res.render('users/edit', {
        title: '用户',
        req: req,
        results: results,
        moment: moment
      });
    }
  });
});

router.post('/users/:id/edit', sessionSetup, function(req, res, next){
  var id = req.params.id;
  queryDBMulti( `select u.id, u.email, u.username, u.src, u.bio, u.created from users u where u.id = '${id}';`,function (results) {
    if (results[0].length === 0){
      res.redirect('/404');
    } else {
      if (req.session.isAuthenticated === "false"){
        res.redirect('/login');
      }
      if (String(req.session.id) !== id){
        res.redirect('/403');
      }
      var email = req.body.email;
      var password = req.body.password;
      var username = req.body.username;
      var bio = req.body.bio;
      var errors = [];
      if (email.length === 0){
        errors.push(1);
      }
      if (password.length === 0){
        errors.push(2);
      }
      if (username.length === 0){
        errors.push(3);
      }
      if(validateEmail(email) === false){
        errors.push(4);
      }
      if(password.length <= 8){
        errors.push(5);
      }
      if (bio.length === 0){
        errors.push(6);
      }
      if (errors.length !== 0){
        res.render('users/failed2',{
          title: '编辑',
          req: req,
          inputs: {
            "email": email,
            "username": username,
            "bio": bio
          },
          errors: errors,
          results: results
        });
      } else {
        // clean data and insert into database and return login page with success popup
        email = email.trim();
        password = password.trim();
        username = username.trim();
        bio = bio.trim();
        queryDB(`update users set email = '${email}', password = '${password}', username = '${username}', bio = '${bio}' where id = '${id}';`,
            function(results){
              var client = redis.createClient();
              client.HMSET(req.cookies.sid, {
                "userUpdated": true
              }, function(){
                client.quit();
                res.redirect(`/users/${req.session.id}`);
              });
              // queryDBMulti( `select u.id, u.email, u.username, u.src, u.bio, u.created from users u where u.id = '${id}';select v.id as videoid, v.title, v.src as videosrc, v.created, u.id, u.username, u.src, count(body) as count from videos v inner join users u on v.userid = u.id left join comments c on v.id = c.videoid where v.userid = '${id}' group by v.id order by v.created desc limit 10;select count(*) as videosCount from videos where userid = '${id}';select count(*) as topicsCount from topicfollowing where following = '${id}';select count(*) as followingCount from userfollowing where following = '${id}';select count(*) as followersCount from userfollowing where followed = '${id}';select count(*) as commentsCount from comments where userid = '${id}';select count(*) as likesCount from likes where userid = '${id}';select * from userfollowing where following = '${req.session.id}' and followed = '${id}';`,function (results) {
              //   if (results[0].length === 0){
              //     res.redirect('/404');
              //   } else {
              //     // if (req.session.isAuthenticated){
              //     //   queryDB(`select * from topicfollowing where following = '${req.session.id}' and followed = ${req.params.id};`,
              //     //       function(results){
              //     //         res.render('topics/show', {
              //     //           title: '话题',
              //     //           req: req,
              //     //           results: results,
              //     //           moment: moment
              //     //         });}
              //     //   );
              //     // }
              //     res.render('users/showEdited', {
              //       title: '用户',
              //       req: req,
              //       results: results,
              //       moment: moment
              //     });
              //   }
              // });
        });
      }
    }
  });
});

router.get('/search', sessionSetup, function(req, res, next){
  if (req.query.search === ""){
    queryDB(`select v.id as videoid, v.title, v.src as videosrc, v.created, u.id, u.username, u.src, count(body) as count from videos v inner join users u on v.userid = u.id left join comments c on v.id = c.videoid group by v.id order by v.created desc limit 10;`,
        function(results){
          res.render('search/index', {
            title: '搜索',
            req: req,
            results: results,
            moment: moment
          });});
  } else {
    queryDB(`select v.id as videoid, v.title, v.src as videosrc, v.created, u.id, u.username, u.src, count(body) as count from videos v inner join users u on v.userid = u.id left join comments c on v.id = c.videoid where v.title like '%${req.query.search}%' group by v.id order by v.created desc limit 10;`,
        function(results){
          res.render('search/filtered', {
            title: '搜索',
            req: req,
            results: results,
            moment: moment
          });});
  }
});

router.get('/users/delete/:id', sessionSetup, function(req, res, next){
  var id = req.params.id;
  queryDBMulti( `select u.id, u.email, u.username, u.src, u.bio, u.created from users u where u.id = '${id}';`,function (results) {
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
      if (req.session.isAuthenticated === "false"){
        res.redirect('/login');
      }
      if (String(req.session.id) !== id){
        res.redirect('/403');
      }
      queryDBMulti( `delete from users where id = '${id}'`,function (results) {
        var client = redis.createClient();
        client.del(req.cookies.sid);
        client.quit();
        req.session = {
          "isAuthenticated": false,
          "id": false,
          "email": false,
          "username": false
        };
        res.cookie('sid', "", { signed: false, maxAge: 0, httpOnly: true });
        res.render('errors/deletedProfile', {
          title: '前往',
          req: req,
          moment: moment
        });
      });
    }
  });
});

router.get('/videos/delete/:id', sessionSetup, function(req, res, next){
  var id = req.params.id;
  queryDBMulti( `select * from videos v where v.id = '${id}';`,function (results) {
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
      if (req.session.isAuthenticated === "false"){
        res.redirect('/login');
      }
      if (req.session.id !== String(results[0].userid)){
        res.redirect('/403');
      }
      queryDBMulti( `delete from videos where id = '${id}'`,function (results) {
        var client = redis.createClient();
        client.HMSET(req.cookies.sid, {
          "videoDeleted": true
        }, function(){
          client.quit();
          res.redirect(`/users/${req.session.id}`);
        });
      });
    }
  });
});

router.get('/logout', sessionSetup, function(req, res, next){
  if (req.session.isAuthenticated === "false"){
    res.redirect('/login');
  } else {
    var client = redis.createClient();
    client.del(req.cookies.sid);
    client.quit();
    req.session = {
      "isAuthenticated": false,
      "id": false,
      "email": false,
      "username": false
    };
    res.cookie('sid', "", { signed: false, maxAge: 0, httpOnly: true });
    res.render('errors/loggedout', {
      title: '前往',
      req: req,
      moment: moment
    });
  }
})

router.get('/users/:id/topics', sessionSetup, function(req, res, next){
  var id = req.params.id;
  queryDBMulti( `select u.id, u.email, u.username, u.src, u.bio, u.created from users u where u.id = '${id}';select t.id, t.title, t.description, t.src from topics t inner join topicfollowing tf on t.id = tf.followed where tf.following = '${id}' order by tf.created desc limit 10;select count(*) as videosCount from videos where userid = '${id}';select count(*) as topicsCount from topicfollowing where following = '${id}';select count(*) as followingCount from userfollowing where following = '${id}';select count(*) as followersCount from userfollowing where followed = '${id}';select count(*) as commentsCount from comments where userid = '${id}';select count(*) as likesCount from likes where userid = '${id}';`,function (results) {
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
      res.render('users/topics', {
        title: '用户',
        req: req,
        results: results,
        moment: moment
      });
    }
  });
});

// router.get('/users/:id/topics', sessionSetup, function(req, res, next){


router.get('/users/:id/following', sessionSetup, function(req, res, next){
  var id = req.params.id;
  queryDBMulti( `select u.id, u.email, u.username, u.src, u.bio, u.created from users u where u.id = '${id}';select u.id, u.username, u.src from users u inner join userfollowing uf on uf.followed = u.id where uf.following = '${id}' order by uf.created desc limit 10;select count(*) as videosCount from videos where userid = '${id}';select count(*) as topicsCount from topicfollowing where following = '${id}';select count(*) as followingCount from userfollowing where following = '${id}';select count(*) as followersCount from userfollowing where followed = '${id}';select count(*) as commentsCount from comments where userid = '${id}';select count(*) as likesCount from likes where userid = '${id}';`,function (results) {
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
      res.render('users/following', {
        title: '用户',
        req: req,
        results: results,
        moment: moment
      });
    }
  });
});

router.get('/users/:id/followers', sessionSetup, function(req, res, next){
  var id = req.params.id;
  queryDBMulti( `select u.id, u.email, u.username, u.src, u.bio, u.created from users u where u.id = '${id}';select u.id, u.username, u.src from users u inner join userfollowing uf on uf.following = u.id where uf.followed = '${id}' order by uf.created desc limit 10;select count(*) as videosCount from videos where userid = '${id}';select count(*) as topicsCount from topicfollowing where following = '${id}';select count(*) as followingCount from userfollowing where following = '${id}';select count(*) as followersCount from userfollowing where followed = '${id}';select count(*) as commentsCount from comments where userid = '${id}';select count(*) as likesCount from likes where userid = '${id}';`,function (results) {
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
      res.render('users/followers', {
        title: '用户',
        req: req,
        results: results,
        moment: moment
      });
    }
  });
});

router.get('/users/:id/comments', sessionSetup, function(req, res, next){
  var id = req.params.id;
  queryDBMulti( `select u.id, u.email, u.username, u.src, u.bio, u.created from users u where u.id = '${id}';select c.body, c.created from comments c where c.userid = '${id}' order by c.created desc limit 10;select count(*) as videosCount from videos where userid = '${id}';select count(*) as topicsCount from topicfollowing where following = '${id}';select count(*) as followingCount from userfollowing where following = '${id}';select count(*) as followersCount from userfollowing where followed = '${id}';select count(*) as commentsCount from comments where userid = '${id}';select count(*) as likesCount from likes where userid = '${id}';`,function (results) {
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
      res.render('users/comments', {
        title: '用户',
        req: req,
        results: results,
        moment: moment
      });
    }
  });
});

router.get('/users/:id/likes', sessionSetup, function(req, res, next){
  var id = req.params.id;
  queryDBMulti( `select u.id, u.email, u.username, u.src, u.bio, u.created from users u where u.id = '${id}';select v.id as videoid, v.title, v.src as videosrc, v.created, u.id, u.username, u.src, count(body) as count from videos v inner join users u on v.userid = u.id left join comments c on v.id = c.videoid where v.id in (select videoid from likes where userid = '${id}') group by v.id order by v.created desc limit 10;select count(*) as videosCount from videos where userid = '${id}';select count(*) as topicsCount from topicfollowing where following = '${id}';select count(*) as followingCount from userfollowing where following = '${id}';select count(*) as followersCount from userfollowing where followed = '${id}';select count(*) as commentsCount from comments where userid = '${id}';select count(*) as likesCount from likes where userid = '${id}';`,function (results) {
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
      res.render('users/likes', {
        title: '用户',
        req: req,
        results: results,
        moment: moment
      });
    }
  });
});

router.get('/videos/:id', sessionSetup, function(req, res, next){
  var id = req.params.id;
  queryDBMulti( `select v.id as videoid, v.description as videodescription, v.title as videotitle, v.src as videosrc, v.created, u.id as userid, u.username, u.src as usersrc, t.id as topicid, t.title, t.description, t.src from videos v inner join users u on v.userid = u.id inner join topics t on v.topicid = t.id where v.id = '${id}';select c.body, c.created, u.id, u.username, u.src from comments c inner join users u on c.userid = u.id where videoid = '${id}' order by created desc limit 10;select count(*) as commentsCount from comments where videoid = '${id}';select count(*) as likesCount from likes where videoid = '${id}';select * from likes where userid = '${req.session.id}' and videoid = '${id}';`,function (results) {
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
      var videoUpdated = req.session.videoUpdated;
      if (videoUpdated === "true"){
        var client = redis.createClient();
        client.HMSET(req.cookies.sid, {
          "videoUpdated": false
        });
        client.quit();
      }
      res.render('videos/show', {
        title: '视频',
        req: req,
        results: results,
        moment: moment,
        videoUpdated: videoUpdated
      });

      // var videoUpdated = "";
      // var client = redis.createClient();
      // client.hgetall(req.cookies.sid, function (err, obj) {
      //   videoUpdated = obj["videoUpdated"];
      //   if (videoUpdated === "true"){
      //     client.HMSET(req.cookies.sid, {
      //       "videoUpdated": false
      //     });
      //   }
      //   client.quit();
      //   res.render('videos/show', {
      //     title: '视频',
      //     req: req,
      //     results: results,
      //     moment: moment,
      //     videoUpdated: videoUpdated
      //   });
      // });


        // client.HGET(req.cookies.sid, {
      //   "videoupdated": true
      // }, function(){
      //   client.quit();
      //   res.redirect(`/videos/${id}`);
      // });


    }
  });
});

router.get('/videos/:id/edit', sessionSetup, function(req, res, next){
  var id = req.params.id;
  queryDBMulti( `select v.id, v.title, v.description, v.userid from videos v where v.id = '${id}';`,function (results) {
    if (results[0].length === 0){
      console.log(results);
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
      if (req.session.isAuthenticated === "false"){
        res.redirect('/login');
      }
      if (req.session.id !== String(results[0].userid)){
        res.redirect('/403');
      }
      console.log(results);
      res.render('videos/edit', {
        title: '视频',
        req: req,
        results: results,
        moment: moment
      });
    }
  });
});

router.post('/videos/:id/edit', sessionSetup, function(req, res, next){
  var id = req.params.id;
  queryDBMulti( `select v.id, v.title, v.description, v.userid from videos v where v.id = '${id}';`,function (results) {
    if (results[0].length === 0){
      res.redirect('/404');
    } else {
      if (req.session.isAuthenticated === "false"){
        res.redirect('/login');
      }
      if (req.session.id !== String(results[0].userid)){
        res.redirect('/403');
      }
      var title = req.body.title;
      var description = req.body.description;
      var errors = [];
      if (title.length === 0){
        errors.push(1);
      }
      if (description.length === 0){
        errors.push(2);
      }
      if (errors.length !== 0){
        res.render('videos/failed',{
          title: '编辑',
          req: req,
          inputs: {
            "title": title,
            "description": description
          },
          errors: errors,
          results: results
        });
      } else {
        // clean data and insert into database and return login page with success popup
        title = title.trim();
        description = description.trim();
        queryDB(`update videos set title = '${title}', description = '${description}' where id = '${id}';`,
            function(results){
              var client = redis.createClient();
              client.HMSET(req.cookies.sid, {
                "videoUpdated": true
              }, function(){
                client.quit();
                res.redirect(`/videos/${id}`);
              });
              // queryDBMulti( `select v.id as videoid, v.description as videodescription, v.title as videotitle, v.src as videosrc, v.created, u.id as userid, u.username, u.src as usersrc, t.id as topicid, t.title, t.description, t.src from videos v inner join users u on v.userid = u.id inner join topics t on v.topicid = t.id where v.id = '${id}';select c.body, c.created, u.id, u.username, u.src from comments c inner join users u on c.userid = u.id where videoid = '${id}' order by created desc limit 10;select count(*) as commentsCount from comments where videoid = '${id}';select count(*) as likesCount from likes where videoid = '${id}';`,function (results) {
              //   if (results[0].length === 0){
              //     res.redirect('/404');
              //   } else {
              //     // if (req.session.isAuthenticated){
              //     //   queryDB(`select * from topicfollowing where following = '${req.session.id}' and followed = ${req.params.id};`,
              //     //       function(results){
              //     //         res.render('topics/show', {
              //     //           title: '话题',
              //     //           req: req,
              //     //           results: results,
              //     //           moment: moment
              //     //         });}
              //     //   );
              //     // }
              //     res.render('videos/showEdited', {
              //       title: '用户',
              //       req: req,
              //       results: results,
              //       moment: moment
              //     });
              //   }
              // });
            });
      }
    }
  });
});



router.get('/register', sessionSetup, function(req, res, next){
  if (req.session.isAuthenticated === "true"){
    res.redirect('/');
  } else {
    res.render('users/new', {
      title: '注册',
      req: req,
      moment: moment
    });
  }
});

// if user logged in pass else
// check if all fields are filled out
// if email follows right format,
// if password contains at least one letter, one number, and more than eight characters long
// if validation fails return form with errors and inputs
// else save data into DB and return login page with success message
router.post('/register', sessionSetup, function(req, res, next){
  if (req.session.isAuthenticated === "true"){
    res.redirect('/');
  } else {
    var email = req.body.email;
    var password = req.body.password;
    var username = req.body.username;
    var errors = [];
    if (email.length === 0){
      errors.push(1);
    }
    if (password.length === 0){
      errors.push(2);
    }
    if (username.length === 0){
      errors.push(3);
    }
    if(validateEmail(email) === false){
      errors.push(4);
    }
    if(password.length <= 8){
      errors.push(5);
    }
    if (errors.length !== 0){
      res.render('users/failed',{
        title: '注册',
        req: req,
        inputs: {
          "email": email,
          "password": password,
          "username": username
        },
        errors: errors,
      });
    } else {
      // clean data and insert into database and return login page with success popup
      email = email.trim();
      password = password.trim();
      username = username.trim();
      queryDB(`insert into users (email, password, username) values ('${email}','${password}','${username}')`,
          function(results){
            var client = redis.createClient();
            client.HMSET(req.cookies.sid, {
              "userCreated": true
            }, function() {
              client.quit();
              res.redirect(`/login`);
            });});}}});

// if user is logged out return login page else redirect to /
router.get('/login', sessionSetup, function(req, res, next){
  if (req.session.isAuthenticated === "true"){
    res.redirect('/');
  } else {
    var userCreated = req.session.userCreated;
    if (userCreated === "true"){
      var client = redis.createClient();
      client.HMSET(req.cookies.sid, {
        "userCreated": false
      });
      client.quit();
    }
    res.render('login/new', {
      title: '登陆',
      req: req,
      moment: moment,
      userCreated: userCreated
    });
  }
});

router.post('/login', sessionSetup, function(req, res, next){
  if (req.session.isAuthenticated === "true"){
    res.redirect('/');
  } else {
    var email = req.body.email;
    var password = req.body.password;
    queryDB(`select * from users where email = '${email}'`,
        function(results){
          if (results.length === 0 || results[0]["password"] !== password){
            res.render('login/failed',{
              title: '登陆',
              req: req
            });
          } else {
            var client = redis.createClient();
            client.HMSET(req.cookies.sid, {
              "isAuthenticated": true,
              "id": results[0]["id"],
              "email": results[0]["email"],
              "username": results[0]["username"],
              "src": results[0]["src"]
            }, function(){
              client.quit();
              res.redirect("/");
            });
          }
    });
  }
});


router.get('/404', sessionSetup, function(req,res,next){
  res.render('errors/404');
});

router.get('/403', sessionSetup, function(req,res,next){
  res.render('errors/403');
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
