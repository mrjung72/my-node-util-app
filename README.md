# my-node-util-app



CREATE TABLE telnet_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    server_ip VARCHAR(100),
    port INT,
    is_connected BOOLEAN,
    checked_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
