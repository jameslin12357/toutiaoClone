var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'LYGUber445',
  database : 'toutiaoClone'
});
var faker = require('faker');
 
connection.connect();

// for(var i = 0; i < 1000; i++) {
//   var randomEmail = faker.internet.email();
//   var randomName = randomEmail.split('@')[0];
//   connection.query(`insert into users (email, username, password) values ('${randomEmail}','${randomName}','john123')`, function (error, results, fields) {
//     if (error) throw error;
//     console.log('The solution is: ', results);
//   });
// }

// for(var i = 0; i < 1000; i++) {
//   var randomTitle = faker.lorem.sentence();
//   var randomDescription = faker.lorem.sentence();
//   var randomUserId = Math.floor(Math.random() * 1000) + 1;
//   var randomTopicId = Math.floor(Math.random() * 10) + 1;
//   connection.query(`insert into videos (title, description, src, userid, topicid) values ('${randomTitle}','${randomDescription}','http://www.mazwai.com/#/grid/videos/148', '${randomUserId}', '${randomTopicId}')`, function (error, results, fields) {
//     if (error) throw error;
//     console.log('The solution is: ', results);
//   });
// }

for(var i = 0; i < 1000; i++) {
  var randomBody = faker.lorem.sentence();
  var randomUserId = Math.floor(Math.random() * 1000) + 1;
  var randomVideoId = Math.floor(Math.random() * 1000) + 1;
  connection.query(`insert into comments (body, userid, videoid) values ('${randomBody}','${randomUserId}', '${randomVideoId}')`, function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results);
  });
}



connection.end();

// users `insert into users (email, username, password) values ('john@yahoo.com','john','john123')`
// videos
// comments
// topics
// topicfollowing
// userfollowing
// likes