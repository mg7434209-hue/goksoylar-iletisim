CREATE TABLE `accessories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(128) NOT NULL,
	`name` varchar(256) NOT NULL,
	`category` varchar(64) NOT NULL,
	`price` int NOT NULL,
	`image` text NOT NULL,
	`brand` varchar(64) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `accessories_id` PRIMARY KEY(`id`),
	CONSTRAINT `accessories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `packages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(128) NOT NULL,
	`name` varchar(256) NOT NULL,
	`category` enum('faturali','faturasiz','genc') NOT NULL,
	`internet` varchar(32) NOT NULL,
	`minutes` varchar(32) NOT NULL,
	`sms` varchar(32) NOT NULL,
	`price` int NOT NULL,
	`popular` boolean NOT NULL DEFAULT false,
	`features` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `packages_id` PRIMARY KEY(`id`),
	CONSTRAINT `packages_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `phones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(128) NOT NULL,
	`name` varchar(256) NOT NULL,
	`brand` varchar(64) NOT NULL,
	`price` int NOT NULL,
	`oldPrice` int,
	`image` text NOT NULL,
	`storage` varchar(32) NOT NULL,
	`ram` varchar(32) NOT NULL,
	`screen` varchar(64) NOT NULL,
	`camera` varchar(128) NOT NULL,
	`battery` varchar(32) NOT NULL,
	`color` varchar(64) NOT NULL,
	`badge` varchar(32),
	`installment` varchar(32),
	`isActive` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `phones_id` PRIMARY KEY(`id`),
	CONSTRAINT `phones_slug_unique` UNIQUE(`slug`)
);
