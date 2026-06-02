require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Products");

// ─── Review Pool ───────────────────────────────────────────────────────────────
// 60 unique reviewer names
const NAMES = [
    "Arjun Mehta", "Priya Sharma", "Rahul Verma", "Sneha Patel", "Vikram Nair",
    "Ananya Reddy", "Rohan Gupta", "Pooja Iyer", "Karan Singh", "Deepika Rao",
    "Aarav Joshi", "Kavya Pillai", "Nikhil Desai", "Shruti Bose", "Aditya Kumar",
    "Meera Srinivasan", "Siddharth Shah", "Ritu Kapoor", "Manish Tiwari", "Divya Nath",
    "Harsh Vardhan", "Nidhi Agarwal", "Pranav Mishra", "Swati Pandey", "Yash Malhotra",
    "Tanvi Saxena", "Abhishek Dutta", "Shreya Banerjee", "Varun Chopra", "Pallavi Jain",
    "Mohit Chaturvedi", "Shweta Bhatia", "Gaurav Sinha", "Anjali More", "Rishabh Goel",
    "Neha Choudhary", "Sumit Rastogi", "Puja Trivedi", "Akash Bhatt", "Ritika Dwivedi",
    "Vikas Thakur", "Alka Rathore", "Sandeep Roy", "Mamta Shukla", "Lalit Pathak",
    "Riya Mitra", "Dinesh Yadav", "Khushi Bajaj", "Tarun Anand", "Sonal Wagh",
    "Amit Kulkarni", "Nisha Pawar", "Sachin Hegde", "Preeti Naidu", "Vishal Bhosle",
    "Kavita Murthy", "Rohit Kamath", "Ankita Ghosh", "Ashish Karmakar", "Smita Dalvi"
];

// Review comments categorised by rating band
const COMMENTS_5 = [
    "Absolutely love this! The quality is outstanding and it fits perfectly. Will definitely buy again.",
    "Exceeded my expectations. The fabric feels premium and the stitching is flawless. Highly recommend!",
    "Best purchase I've made this season. Looks exactly like the picture and arrived super fast.",
    "Perfect fit, great material, and the colour is even more vibrant in person. 10/10!",
    "I've bought several items from here and this one is my favourite. Top-notch quality.",
    "Wonderful product! Very comfortable to wear all day and washes really well too.",
    "Stunning piece! Got so many compliments the first time I wore it. Zero regrets.",
    "Exactly what I was looking for. True to size and the fabric feels luxurious.",
    "Great value for money. Premium finish, fast delivery, perfect packaging. Love it!",
    "Incredible quality. My whole family ordered one each. We're all very happy!",
];

const COMMENTS_4 = [
    "Really nice product overall. The quality is great, just slightly different shade than expected.",
    "Good purchase! Fits well and looks stylish. Delivery was quick too.",
    "Happy with this buy. Fabric is soft and durable. Slight delay in shipping but worth the wait.",
    "Solid product, great stitching and comfortable material. Would buy again.",
    "Pretty good quality for the price. Fits true to size. Minor packaging issue but product is fine.",
    "Nice and comfortable. Good colour accuracy. Will order more from this collection.",
    "Good product! Wore it to an event and got compliments. Slightly stiff at first but softens after wash.",
    "Looks classy. Delivery was on time. Overall a very satisfying shopping experience.",
    "Quite happy with this product. Good craftsmanship and comfortable fit. Minor colour difference.",
    "Four stars because it's great but delivery took a couple extra days. Product itself is superb.",
];

const COMMENTS_3 = [
    "Decent product but not exceptional. Fits okay and the fabric is average quality.",
    "It's alright. Matches description but I expected slightly better stitching for the price.",
    "Fair quality. Nothing special but nothing bad either. Neutral overall.",
    "Average experience. Product is usable but doesn't stand out. Delivery was fine.",
    "Okay product. The size runs a bit small so order one size up. Average material.",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Returns 3 distinct review objects.
 * We skew heavily towards 4–5 stars so the overall rating looks realistic.
 */
function generateThreeReviews(usedNames) {
    const usedInThisProduct = new Set();
    const reviews = [];

    // Rating distribution for the 3 reviews:
    //   We pick from: [5,5,4] | [5,4,4] | [5,5,5] | [5,4,3] with weighted probability
    const distributions = [
        [5, 5, 4],
        [5, 5, 5],
        [5, 4, 4],
        [5, 4, 3],
        [4, 4, 4],
        [5, 5, 3],
    ];
    const ratings = pickRandom(distributions);

    for (let i = 0; i < 3; i++) {
        // Pick a unique name not yet used globally for this product
        let name;
        let attempts = 0;
        do {
            name = pickRandom(NAMES);
            attempts++;
        } while (usedInThisProduct.has(name) && attempts < 30);
        usedInThisProduct.add(name);

        const rating = ratings[i];
        let comment;
        if (rating === 5) comment = pickRandom(COMMENTS_5);
        else if (rating === 4) comment = pickRandom(COMMENTS_4);
        else comment = pickRandom(COMMENTS_3);

        // Random date within last 90 days
        const daysAgo = randomInt(1, 90);
        const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

        reviews.push({ name, rating, comment, createdAt: date, updatedAt: date });
    }

    return reviews;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function seedReviews() {
    console.log("⚡ Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected.\n");

    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products.\n`);

    let seeded = 0;
    let skipped = 0;

    for (const product of products) {
        // Skip if already has 3 or more reviews
        if (product.reviews && product.reviews.length >= 3) {
            console.log(`  ⏭  Skipped (already has ${product.reviews.length} reviews): ${product.name}`);
            skipped++;
            continue;
        }

        const newReviews = generateThreeReviews();

        // Replace any partial reviews with a full set of 3
        product.reviews = newReviews;
        product.numReviews = 3;
        product.rating = parseFloat(
            (newReviews.reduce((sum, r) => sum + r.rating, 0) / 3).toFixed(1)
        );

        await product.save();
        console.log(
            `  ✅ Seeded: "${product.name}" — rating: ${product.rating}⭐ [${newReviews.map(r => r.rating).join(", ")}]`
        );
        seeded++;
    }

    console.log(`\n🎉 Done! Seeded: ${seeded} products | Skipped: ${skipped} products.`);
    await mongoose.disconnect();
    process.exit(0);
}

seedReviews().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});
