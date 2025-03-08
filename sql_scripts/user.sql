CREATE TABLE spl2.user (
    user_id VARCHAR(30) PRIMARY KEY,
    is_student BIT NOT NULL,
    email VARCHAR(50) UNIQUE,
    full_name VARCHAR(30) NOT NULL,
    department VARCHAR(30),
    passwords VARCHAR(200),
    citation_count INT(5),
    h_index INT(5),
    points VARCHAR(6),
    badge VARCHAR(10),
    degree VARCHAR(50),
	introduction VARCHAR(1000),
	disciplines VARCHAR(1000),
	skillsExpertise VARCHAR(1000),
	languages VARCHAR(100),
	twitter VARCHAR(100),
    status ENUM('active', 'inactive') DEFAULT 'active'
);