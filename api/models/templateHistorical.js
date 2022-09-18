import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const templateHistoricalSchema = new Schema({
    userId: { type: String, required: [true] },
    name: { type: String, required: [true] },
    description: {type: String},
    createdTime: { type: Number, required: [true] },
    widgets: {type: Array, default: []}
});


// Schema to model.
const TemplateHistorical = mongoose.model('TemplateHistorical', templateHistoricalSchema);

export default TemplateHistorical;
