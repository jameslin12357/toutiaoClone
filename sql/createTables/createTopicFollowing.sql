create table topicfollowing (
    id INT NOT NULL AUTO_INCREMENT,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    edited TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    following INT NOT NULL,
    followed INT NOT NULL,
    FOREIGN KEY fk_topicfollowing_following(following) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY fk_topicfollowing_followed(followed) REFERENCES topics(id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (id));
