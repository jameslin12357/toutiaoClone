create table comments (
	id INT NOT NULL AUTO_INCREMENT,
    	body VARCHAR(200) NOT NULL,
   	created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    	edited TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	userid INT NOT NULL,
	videoid INT NOT NULL,
	FOREIGN KEY fk_comments_userid(userid) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY fk_comments_videoid(videoid) REFERENCES videos(id) ON UPDATE CASCADE ON DELETE CASCADE,
	PRIMARY KEY (id)
);
