const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    product: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    totalRevenue: {
        type: Number,
        required: true
    }, 
}, {
    timestamps: true
});

module.exports = mongoose.model("Sale", saleSchema);

