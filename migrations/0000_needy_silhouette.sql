CREATE TABLE `explanations` (
	`id` text PRIMARY KEY NOT NULL,
	`source_url` text NOT NULL,
	`problem_slug` text NOT NULL,
	`problem_title` text,
	`status` text DEFAULT 'generating' NOT NULL,
	`markdown` text,
	`error_message` text,
	`language` text DEFAULT 'typescript' NOT NULL,
	`learner_level` text DEFAULT 'novice-intermediate' NOT NULL,
	`model` text NOT NULL,
	`prompt_version` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`completed_at` text
);
--> statement-breakpoint
CREATE INDEX `explanations_problem_slug_idx` ON `explanations` (`problem_slug`);--> statement-breakpoint
CREATE INDEX `explanations_status_idx` ON `explanations` (`status`);--> statement-breakpoint
CREATE INDEX `explanations_created_at_idx` ON `explanations` (`created_at`);