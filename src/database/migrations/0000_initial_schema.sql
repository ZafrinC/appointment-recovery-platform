CREATE TYPE "public"."appointment_status" AS ENUM('scheduled', 'confirmed', 'cancelled', 'completed', 'no_show');--> statement-breakpoint
CREATE TYPE "public"."recovery_campaign_status" AS ENUM('pending', 'active', 'recovered', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."message_channel" AS ENUM('email', 'sms');--> statement-breakpoint
CREATE TYPE "public"."message_status" AS ENUM('queued', 'sent', 'delivered', 'failed');--> statement-breakpoint
CREATE TABLE "businesses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"email" varchar(320) NOT NULL,
	"phone" varchar(50),
	"timezone" varchar(100) DEFAULT 'UTC' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"email" varchar(320),
	"phone" varchar(50),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"external_appointment_id" varchar(255),
	"scheduled_at" timestamp with time zone NOT NULL,
	"status" "appointment_status" NOT NULL,
	"source" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recovery_campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"appointment_id" uuid NOT NULL,
	"status" "recovery_campaign_status" NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recovery_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recovery_campaign_id" uuid NOT NULL,
	"channel" "message_channel" NOT NULL,
	"status" "message_status" NOT NULL,
	"recipient" varchar(320) NOT NULL,
	"subject" varchar(255),
	"message_body" text NOT NULL,
	"provider_message_id" varchar(255),
	"sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recovery_campaigns" ADD CONSTRAINT "recovery_campaigns_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recovery_campaigns" ADD CONSTRAINT "recovery_campaigns_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recovery_messages" ADD CONSTRAINT "recovery_messages_recovery_campaign_id_recovery_campaigns_id_fk" FOREIGN KEY ("recovery_campaign_id") REFERENCES "public"."recovery_campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "businesses_slug_unique_idx" ON "businesses" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "customers_business_id_idx" ON "customers" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "appointments_business_id_idx" ON "appointments" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "appointments_customer_id_idx" ON "appointments" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "appointments_scheduled_at_idx" ON "appointments" USING btree ("scheduled_at");--> statement-breakpoint
CREATE INDEX "appointments_status_idx" ON "appointments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "recovery_campaigns_business_id_idx" ON "recovery_campaigns" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "recovery_campaigns_appointment_id_idx" ON "recovery_campaigns" USING btree ("appointment_id");--> statement-breakpoint
CREATE INDEX "recovery_campaigns_status_idx" ON "recovery_campaigns" USING btree ("status");--> statement-breakpoint
CREATE INDEX "recovery_messages_recovery_campaign_id_idx" ON "recovery_messages" USING btree ("recovery_campaign_id");--> statement-breakpoint
CREATE INDEX "recovery_messages_status_idx" ON "recovery_messages" USING btree ("status");