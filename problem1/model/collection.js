const mongoose = require("mongoose");

const CalculatorSchema = new mongoose.Schema({
    windowPrevState: { type: [Number], default: [] },
    windowCurrState: { type: [Number], default: [] },
    numbers: { type: [Number], default: [] },
    avg: { type: Number, default: 0 }
});

const Calculator = mongoose.model('Calculator', CalculatorSchema);

module.exports = Calculator;