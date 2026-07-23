const {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} = require("drizzle-orm/pg-core");
const {
  appointmentStatusEnum,
  recoveryCampaignStatusEnum,
  messageChannelEnum,
  messageStatusEnum,
} = require("./enums");

const businesses = pgTable(
  "businesses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    phone: varchar("phone", { length: 50 }),
    timezone: varchar("timezone", { length: 100 })
      .notNull()
      .default("UTC"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("businesses_slug_unique_idx").on(table.slug),
  ],
);

const customers = pgTable(
  "customers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 320 }),
    phone: varchar("phone", { length: 50 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("customers_business_id_idx").on(table.businessId),
  ],
);

const appointments = pgTable(
  "appointments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id),
    externalAppointmentId: varchar("external_appointment_id", {
      length: 255,
    }),
    scheduledAt: timestamp("scheduled_at", {
      withTimezone: true,
    }).notNull(),
    status: appointmentStatusEnum("status").notNull(),
    source: varchar("source", { length: 100 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("appointments_business_id_idx").on(table.businessId),
    index("appointments_customer_id_idx").on(table.customerId),
    index("appointments_scheduled_at_idx").on(table.scheduledAt),
    index("appointments_status_idx").on(table.status),
  ],
);

const recoveryCampaigns = pgTable(
  "recovery_campaigns",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    appointmentId: uuid("appointment_id")
      .notNull()
      .references(() => appointments.id, {
        onDelete: "cascade",
      }),
    status: recoveryCampaignStatusEnum("status").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", {
      withTimezone: true,
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("recovery_campaigns_business_id_idx").on(
      table.businessId,
    ),
    index("recovery_campaigns_appointment_id_idx").on(
      table.appointmentId,
    ),
    index("recovery_campaigns_status_idx").on(table.status),
  ],
);

const recoveryMessages = pgTable(
  "recovery_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    recoveryCampaignId: uuid("recovery_campaign_id")
      .notNull()
      .references(() => recoveryCampaigns.id, {
        onDelete: "cascade",
      }),
    channel: messageChannelEnum("channel").notNull(),
    status: messageStatusEnum("status").notNull(),
    recipient: varchar("recipient", { length: 320 }).notNull(),
    subject: varchar("subject", { length: 255 }),
    messageBody: text("message_body").notNull(),
    providerMessageId: varchar("provider_message_id", {
      length: 255,
    }),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("recovery_messages_recovery_campaign_id_idx").on(
      table.recoveryCampaignId,
    ),
    index("recovery_messages_status_idx").on(table.status),
  ],
);

module.exports = {
  businesses,
  customers,
  appointments,
  recoveryCampaigns,
  recoveryMessages,
};
