CREATE TABLE IF NOT EXISTS USER (
    ID INT NOT NULL AUTO_INCREMENT,
    GID VARCHAR(32) NOT NULL,
    NAME VARCHAR(50) NOT NULL,
    EMAIL VARCHAR(256),
    PICTURE VARCHAR(2048),

    PRIMARY KEY (ID),
    UNIQUE KEY GOOGLE_INDEX (GID)
);
CREATE TABLE IF NOT EXISTS LOBBY_CATEGORY (
    ID INT NOT NULL AUTO_INCREMENT,
    NAME VARCHAR(50) NOT NULL,

    PRIMARY KEY (ID)
);
CREATE TABLE IF NOT EXISTS LOBBY (
    ID INT NOT NULL AUTO_INCREMENT,
    NAME VARCHAR(100) NOT NULL,
    CATEGORY INT NOT NULL,
    CREATOR INT NOT NULL,
    CREATED_AT TIMESTAMP NOT NULL DEFAULT NOW(),
    DESCRIPTION TEXT,
    ICON MEDIUMBLOB,

    PRIMARY KEY (ID),
    FOREIGN KEY (CATEGORY) REFERENCES LOBBY_CATEGORY(ID),
    FOREIGN KEY (CREATOR) REFERENCES USER(ID)
);
CREATE TABLE IF NOT EXISTS LOBBY_MEMBER (
    ID INT NOT NULL AUTO_INCREMENT,
    MEMBER INT NOT NULL,
    LOBBY INT NOT NULL,

    PRIMARY KEY (ID),
    FOREIGN KEY (MEMBER) REFERENCES USER(ID),
    FOREIGN KEY (LOBBY) REFERENCES LOBBY(ID),
    UNIQUE KEY MEMBER_LOBBY (MEMBER, LOBBY)
);
CREATE TABLE IF NOT EXISTS LOBBY_CLASS (
    ID INT NOT NULL AUTO_INCREMENT,
    NAME VARCHAR(200) NOT NULL,
    DESCRIPTION TEXT NOT NULL,
    INSTRUCTOR INT NOT NULL,
    LOBBY INT NOT NULL,
    MEETING_LINK VARCHAR(2048),
    SCHEDULED_FOR TIMESTAMP NOT NULL,
    CREATED_AT TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY (ID),
    FOREIGN KEY (INSTRUCTOR) REFERENCES USER(ID),
    FOREIGN KEY (LOBBY) REFERENCES LOBBY(ID)
);
CREATE TABLE IF NOT EXISTS LOBBY_POST (
    ID INT NOT NULL AUTO_INCREMENT,
    AUTHOR INT NOT NULL,
    LOBBY INT NOT NULL,
    PARENT INT DEFAULT NULL,
    CLASS INT,
    CONTENT TEXT,
    CREATED_AT TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY (ID),
    FOREIGN KEY (AUTHOR) REFERENCES USER(ID),
    FOREIGN KEY (LOBBY) REFERENCES LOBBY(ID),
    FOREIGN KEY (PARENT) REFERENCES LOBBY_POST(ID),
    FOREIGN KEY (CLASS) REFERENCES LOBBY_CLASS(ID)
);
CREATE TABLE IF NOT EXISTS LOBBY_POST_LIKE (
    ID INT NOT NULL AUTO_INCREMENT,
    USER INT NOT NULL,
    POST INT NOT NULL,

    PRIMARY KEY (ID),
    FOREIGN KEY (USER) REFERENCES USER(ID),
    FOREIGN KEY (POST) REFERENCES LOBBY_POST(ID),
    UNIQUE KEY USER_POST (USER, POST)
);
CREATE TABLE IF NOT EXISTS CLASS_MEMBER (
    ID INT NOT NULL AUTO_INCREMENT,
    MEMBER INT NOT NULL,
    CLASS INT NOT NULL,
    JOINED_AT TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY (ID),
    FOREIGN KEY (MEMBER) REFERENCES USER(ID),
    FOREIGN KEY (CLASS) REFERENCES LOBBY_CLASS(ID),
    UNIQUE KEY MEMBER_CLASS (MEMBER, CLASS)
);
CREATE TABLE IF NOT EXISTS CLASS_RATING (
    ID INT NOT NULL AUTO_INCREMENT,
    USER INT NOT NULL,
    CLASS INT NOT NULL,
    RATING FLOAT NOT NULL,
    CREATED_AT TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY (ID),
    FOREIGN KEY (USER) REFERENCES USER(ID),
    FOREIGN KEY (CLASS) REFERENCES LOBBY_CLASS(ID),
    UNIQUE KEY USER_CLASS (USER, CLASS)
);
CREATE TABLE IF NOT EXISTS CLASS_MESSAGE (
    ID INT NOT NULL AUTO_INCREMENT,
    AUTHOR INT NOT NULL,
    CLASS INT NOT NULL,
    CONTENT TEXT NOT NULL,
    HIGHLIGHTED BOOLEAN NOT NULL DEFAULT FALSE,
    CREATED_AT TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY (ID),
    FOREIGN KEY (AUTHOR) REFERENCES USER(ID),
    FOREIGN KEY (CLASS) REFERENCES LOBBY_CLASS(ID)
);

INSERT INTO LOBBY_CATEGORY (NAME) VALUES ('Science');
INSERT INTO LOBBY_CATEGORY (NAME) VALUES ('Math');
INSERT INTO LOBBY_CATEGORY (NAME) VALUES ('History');
INSERT INTO LOBBY_CATEGORY (NAME) VALUES ('English');
INSERT INTO LOBBY_CATEGORY (NAME) VALUES ('Foreign Language');
INSERT INTO LOBBY_CATEGORY (NAME) VALUES ('Education');
INSERT INTO LOBBY_CATEGORY (NAME) VALUES ('Practical Skills');
