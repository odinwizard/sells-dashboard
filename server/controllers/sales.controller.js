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

//filter sales data
exports.getFilteredSales = async (req, res) => {
    try {
        const {startDate, endDate, product, category, region} = req.query;
        const filter = {};
        if (startDate && endDate) {
            filter.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        if (product) filter.product = product;
        if (category) filter.category = category;
        if (region) filter.region = region;
        const sales = await Sale.find(filter).sort({date: 1 });
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
};

//sales trend data
exports.getSalesTrend = async (req, res) => {
    try {
        const { period, startDate, endDate} = req.query;
        let groupBy, dateFormat;
        switch (period) {
            case 'daily':
                dateFormat = {$dateToString: { format: "%Y-%m-%d" , date: "$date"}};
                groupBy = "$date";
                break;
            case 'weekly' : 
                dateFormat = { $dateToString: {format: "%Y-%U", date: "$date"}};
                groupBy = "$week";
                break;
            case 'monthly' : 
                dateFormat = { $dateToString: {format: "%Y-%m-%d", date: "$date"}};
                groupBy = "$date";  
            default:
                break;
        }
        const matchCondition = {};
        if (startDate && endDate) {
            matchCondition.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        const trendData = await Sale.aggregate([
            { $match: matchCondition },
            { $group: {
                _id: dateFormat,
                totalSales: { $sum: "$quantity" },
                totalRevenue: { $sum: "$totalRevenue"}
            }},
            { $sort: { _id: 1 }}
        ]);
        const formattedData = trendData.map(item => ({
            [period === 'daily' ? 'date' : period === 'weekly' ? 'week' : 'month'] : item._id,
            totalSales: item.totalSales,
            totalRevenue: item.totalRevenue
        }));
        res.status(200).json(formattedData);
    } catch (error) {
        res.status(500).send({ message: error.message});
    }
};

//product wise sales distruction

exports.getProductDistribution = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const matchCondition = {};
        if (startDate && endDate) {
            matchCondition.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        const productData = await Sale.aggregate([
            {$match: matchCondition},
            { $group: {
                _id: "$product",
                totalSales: { $sum: "$totalRevenue"}
            }},
            { $sort: { totalRevenue: -1}}
        ]);
        const formattedData = productData.map(item => ({
            product: item._id,
            totalSales: item.totalSales,
            totalRevenue: item.totalRevenue
        }));
        res.status(200).json(formattedData);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
};

//Get region-wise revenue distruction

exports.getRegionDistribution = async (req, res) => {
    try {
        const {startDate, endDate} = req.query;
        const matchCondition = {};
        if (startDate && endDate) {
            matchCondition.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        const regionData = await Sale.aggregate([
            {$match: matchCondition},
            {$group: {
                _id: "$region",
                totalRevenue: {$sum: "$totalRevenue"}
            }}
        ]);
        const formattedData = regionData.map(item => ({
            region: item._id,
            totalRevenue: item.totalRevenue
        }));
        res.status(200).json(formattedData);
    } catch (error) {
        res.status(500).send({ message: error.message})
    }
};

