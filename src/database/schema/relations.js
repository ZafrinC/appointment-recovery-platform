const { relations } = require("drizzle-orm");
const {
  businesses,
  customers,
  appointments,
  recoveryCampaigns,
  recoveryMessages,
} = require("./tables");

const businessesRelations = relations(businesses, ({ many }) => ({
  customers: many(customers),
  appointments: many(appointments),
  recoveryCampaigns: many(recoveryCampaigns),
}));

const customersRelations = relations(
  customers,
  ({ one, many }) => ({
    business: one(businesses, {
      fields: [customers.businessId],
      references: [businesses.id],
    }),
    appointments: many(appointments),
  }),
);

const appointmentsRelations = relations(
  appointments,
  ({ one, many }) => ({
    business: one(businesses, {
      fields: [appointments.businessId],
      references: [businesses.id],
    }),
    customer: one(customers, {
      fields: [appointments.customerId],
      references: [customers.id],
    }),
    recoveryCampaigns: many(recoveryCampaigns),
  }),
);

const recoveryCampaignsRelations = relations(
  recoveryCampaigns,
  ({ one, many }) => ({
    business: one(businesses, {
      fields: [recoveryCampaigns.businessId],
      references: [businesses.id],
    }),
    appointment: one(appointments, {
      fields: [recoveryCampaigns.appointmentId],
      references: [appointments.id],
    }),
    recoveryMessages: many(recoveryMessages),
  }),
);

const recoveryMessagesRelations = relations(
  recoveryMessages,
  ({ one }) => ({
    recoveryCampaign: one(recoveryCampaigns, {
      fields: [recoveryMessages.recoveryCampaignId],
      references: [recoveryCampaigns.id],
    }),
  }),
);

module.exports = {
  businessesRelations,
  customersRelations,
  appointmentsRelations,
  recoveryCampaignsRelations,
  recoveryMessagesRelations,
};
