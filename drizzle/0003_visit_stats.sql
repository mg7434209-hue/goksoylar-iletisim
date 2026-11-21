CREATE TABLE IF NOT EXISTS `visit_stats` (
	`day` varchar(10) NOT NULL,
	`pageViews` int NOT NULL DEFAULT 0,
	`visitors` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `visit_stats_day` PRIMARY KEY(`day`)
);
