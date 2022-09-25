CREATE TABLE CUSTOMERS (
    id int NOT NULL AUTO_INCREMENT,
    the_address VARCHAR(1000),
    code VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255),
    gender VARCHAR(100),
    the_name VARCHAR(255) NOT NULL,
    phone VARCHAR(255),
    PRIMARY KEY (id)
);