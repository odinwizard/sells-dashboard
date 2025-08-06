const Sale = require("../models/sales.model");
const csv = require("csv-parser");
const fs = require("fs");
const xlsx = require("xlsx");


const uploadFile = async (req, res) => {
    try {
        if(!req.file){
            return res.status(400).send("No file uploaded");
        }
        const filePath = req.file.path;
        const salesData = [];

        if (filePath.endsWith('.csv')) {
            fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                salesData.push({
                    date: new Date(row.date),
                    product: row.product,
                    category: row.category,
                    region: row.region,
                    quantity: parseInt(row.quantity),
                    unitPrice: parseFloat(row.unitPrice),
                    totalRevenue: parseFloat(row.totalRevenue)
                });
            })
            .on('end', async () => {
                try {
                    await Sale.insertMany(salesData);
                    fs.unlinkSync(filePath);
                    res.status(200).send({message: "File uploaded successfully!"});
                } catch (error) {
                    res.status(500).send({message: error.message});
                }
            });
        } else if (filePath.endsWith('.xlsx') || filePath.endsWith('.xls')){
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = xlsx.utils.sheet_to_json(worksheet);

            const formattedData = jsonData.map(row => ({
                date: new Date(row.date),
                product: row.product,
                category: row.category,
                region: row.region,
                quantity: parseInt(row.quantity),
                unitPrice: parseFloat(row.unitPrice),
                totalRevenue: parseFloat(row.totalRevenue)
                }));
                try {
                    await Sale.insertMany(formattedData);
                    fs.unlinkSync(filePath);
                    res.status(200).send({message: "File uploaded successfully!"});
                } catch (error) {
                    res.status(500).send({message: error.message});
                } 
        } else {
            res.status(400).send({message: "Invalid file format. Only CSV or Excel files are allowed."});
        }
    } catch (error) {
        res.status(500).send({message: error.message});
    }
};
module.exports = {uploadFile};
