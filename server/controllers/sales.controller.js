const Sale = require("../models/sales.model");

exports.getSalesSummery = async (req, res) => {
    try {
        const { startDate, endDate} = req.query;

        const matchCondition = {};
        if (startDate && endDate) {
            matchCondition.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        const result = await Sale.aggregate([
            {$match: matchCondition},
            { $group: {
                _id: null,
                totalSales: {$sum: "$quantity"},
                totalRevenue: { $sum: "$totalRevenue"}
            }}
        ]);
        res.status(200).json(result[0] || {
            totalSales: 0,
            totalRevenue: 0
        });
    } catch (error) {
        res.status(500).send({message: error.message});
    }
};
