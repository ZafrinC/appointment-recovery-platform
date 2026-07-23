const { pgEnum } = require("drizzle-orm/pg-core");

const appointmentStatusEnum = pgEnum("appointment_status", [
  "scheduled",
  "confirmed",
  "cancelled",
  "completed",
  "no_show",
]);

const recoveryCampaignStatusEnum = pgEnum(
  "recovery_campaign_status",
  ["pending", "active", "recovered", "failed", "cancelled"],
);

const messageChannelEnum = pgEnum("message_channel", [
  "email",
  "sms",
]);

const messageStatusEnum = pgEnum("message_status", [
  "queued",
  "sent",
  "delivered",
  "failed",
]);

module.exports = {
  appointmentStatusEnum,
  recoveryCampaignStatusEnum,
  messageChannelEnum,
  messageStatusEnum,
};
