import mongoose from "mongoose";

const PremiumSettingsSchema = new mongoose.Schema({
  adaAddress: { type: String, default: "" },
  paypalEmail: { type: String, default: "" },
  updatedBy: { type: String, ref: 'User' },
}, { timestamps: true });

const PremiumSettings = mongoose.model('PremiumSettings', PremiumSettingsSchema);
export default PremiumSettings;


