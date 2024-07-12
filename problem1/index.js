const express = require("express");
const app = express();
const port = 9876;
const path = require("path");
const mongoose = require("mongoose");
const axios = require("axios");
const Calculator = require("./model/collection");

const WINDOW_SIZE = 10;

main().then(() => { console.log("Connection successful") })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/assessment");
}

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    let i = 5;
    while (i * i <= num) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
        i += 6;
    }
    return true;
}

function generateFibonacci(count) {
    const fib = [0, 1];
    for (let i = 2; i < count; i++) {
        fib[i] = fib[i - 1] + fib[i - 2];
    }
    return fib;
}

function generateRandomNumbers(min, max, count) {
    const randomNumbers = [];
    for (let i = 0; i < count; i++) {
        randomNumbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return randomNumbers;
}

app.get("/numbers/even", async (req, res) => {
    const evenNumbers = Array.from({ length: WINDOW_SIZE }, (_, i) => (i + 1) * 2);
    handleRequest(evenNumbers, "Even", res);
});

app.get("/numbers/primes", async (req, res) => {
    const primeNumbers = [];
    let num = 2;
    while (primeNumbers.length < WINDOW_SIZE) {
        if (isPrime(num)) {
            primeNumbers.push(num);
        }
        num++;
    }
    handleRequest(primeNumbers, "Prime", res);
});

app.get("/numbers/fibo", async (req, res) => {
    const fibonacciNumbers = generateFibonacci(WINDOW_SIZE);
    handleRequest(fibonacciNumbers, "Fibonacci", res);
});

app.get("/numbers/rand", async (req, res) => {
    const randomNumbers = generateRandomNumbers(100, 1000, WINDOW_SIZE);
    handleRequest(randomNumbers, "Random", res);
});

async function handleRequest(numbers, type, res) {
    try {
        const prevState = await Calculator.findOne().sort({ _id: -1 });
        const prevWindow = prevState ? prevState.windowCurrState : [];
        const prevNumbers = prevState ? prevState.numbers : [];

        let combinedNumbers = [...prevNumbers, ...numbers];
        if (combinedNumbers.length > WINDOW_SIZE) {
            combinedNumbers = combinedNumbers.slice(combinedNumbers.length - WINDOW_SIZE);
        }

        const avg = combinedNumbers.reduce((a, b) => a + b, 0) / combinedNumbers.length;

        const calculator = new Calculator({
            windowPrevState: prevWindow,
            windowCurrState: numbers,
            numbers: combinedNumbers,
            avg: avg
        });

        await calculator.save();

        const response = {
            windowPrevState: prevWindow,
            windowCurrState: numbers,
            numbers: combinedNumbers,
            avg: avg.toFixed(2),
            type: type
        };

        console.log(`Response for ${type}:`, response);
        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while fetching numbers");
    }
}

app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`);
});

// run this file using npx nodemon index.js