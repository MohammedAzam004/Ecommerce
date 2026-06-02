const Product = require("../models/Products");

/* ─── Smart Search Helpers ──────────────────────────────────────────── */
const STOP_WORDS = new Set([
    "for","and","the","in","of","to","a","an","with","at","by",
    "or","my","i","me","you","your","on","from","this","that",
    "is","are","was","be","it","its","do","get","have","has",
    "want","need","best","good","new","top","buy","shop","cheap",
    "price","sale","quality","latest","nice","great","size",
    "something","some","any","all","show","find","search",
    "looking","give","please","can","which","what","where",
    "how","product","item","things","thing","under","above","below"
]);

const SYNONYMS = {
    "tshirt":"t-shirt","tshirts":"t-shirt","t shirt":"t-shirt",
    "shirt":"shirt","shirts":"shirt",
    "trouser":"jean","trousers":"jean","pant":"jean","pants":"jean",
    "denim":"jean","jeans":"jean","jean":"jean",
    "top":"top","tops":"top",
    "dress":"dress","dresses":"dress",
    "jacket":"jacket","jackets":"jacket",
    "hoodie":"hoodie","hoodies":"hoodie",
    "sneaker":"footwear","sneakers":"footwear",
    "shoe":"footwear","shoes":"footwear",
    "sandal":"footwear","sandals":"footwear","footwear":"footwear",
    "ethnic":"ethnic","kurta":"ethnic","saree":"ethnic",
    "accessory":"accessories","accessories":"accessories",
    "watch":"accessories","watches":"accessories",
    "belt":"accessories","belts":"accessories",
    "wallet":"accessories","wallets":"accessories",
    "bag":"accessories","bags":"accessories",
    "men":"men","man":"men","male":"men","mens":"men",
    "women":"women","woman":"women","female":"women","womens":"women",
    "ladies":"women","girl":"women","girls":"women",
    "kids":"kids","kid":"kids","child":"kids","children":"kids",
    "boys":"kids","boy":"kids"
};

/**
 * Builds a smart MongoDB keyword filter.
 * - Tokenises query, strips stop words, expands synonyms.
 * - Each token must match in name OR description OR category.
 * - All tokens must match somewhere (AND across tokens).
 * Falls back to full-phrase search when no clean tokens remain.
 */
const buildKeywordFilter = (rawKeyword) => {
    if (!rawKeyword || !rawKeyword.trim()) return null;
    const phrase = rawKeyword.trim();
    const tokens = phrase
        .toLowerCase()
        .split(/[\s\-_,./\\]+/)
        .map((t) => t.replace(/[^a-z0-9']/g, "").trim())
        .filter((t) => t.length > 1 && !STOP_WORDS.has(t))
        .map((t) => SYNONYMS[t] || t)
        .filter((v, i, arr) => arr.indexOf(v) === i);

    if (tokens.length === 0) {
        return {
            $or: [
                { name:        { $regex: phrase, $options: "i" } },
                { description: { $regex: phrase, $options: "i" } },
                { category:    { $regex: phrase, $options: "i" } },
            ],
        };
    }

    const andClauses = tokens.map((token) => ({
        $or: [
            { name:        { $regex: token, $options: "i" } },
            { description: { $regex: token, $options: "i" } },
            { category:    { $regex: token, $options: "i" } },
        ],
    }));
    return andClauses.length === 1 ? andClauses[0] : { $and: andClauses };
};

const getProducts = async (req, res) => {
    try {
        const keywordFilter = buildKeywordFilter(req.query.keyword);

        const categoryParam = req.query.category || "";
        let category = {};
        if (categoryParam) {
            const cats = categoryParam.split(",").map((c) => c.trim()).filter(Boolean);
            if (cats.length === 1) {
                category = { category: cats[0] };
            } else if (cats.length > 1) {
                category = { category: { $in: cats } };
            }
        }
        const minPrice =
            req.query.minPrice
                ? Number(
                    req.query.minPrice
                )
                : 0;

        const maxPrice =
            req.query.maxPrice
                ? Number(
                    req.query.maxPrice
                )
                : Number.MAX_VALUE;
        const priceFilter = {
            price: {
                $gte: minPrice,
                $lte: maxPrice,
            },
        };
        
        // Build the final filter — combine keyword, category, price using $and when needed
        const buildFilter = (kwFilter, catFilter, priceFilter) => {
            const parts = [];
            if (kwFilter)  parts.push(kwFilter);
            if (catFilter) parts.push(catFilter);
            parts.push(priceFilter);
            return parts.length === 1 ? parts[0] : { $and: parts };
        };

        const isRandom = req.query.random === "true";
        if (isRandom) {
            const limit = Number(req.query.limit) || 8;
            const filter = buildFilter(keywordFilter, category.$and ? category : (Object.keys(category).length ? category : null), priceFilter);
            const allMatchingProducts = await Product.find(filter);
            const shuffled = allMatchingProducts.sort(() => Math.random() - 0.5);
            const products = shuffled.slice(0, limit);
            return res.json({ products, page: 1, pages: 1 });
        }

        const isAll = req.query.all === "true";
        const pageSize = isAll ? null : 8;
        const page = isAll ? 1 : (Number(req.query.pageNumber) || 1);

        const catArg = Object.keys(category).length ? category : null;
        const filter = buildFilter(keywordFilter, catArg, priceFilter);

        const count = await Product.countDocuments(filter);

        let query = Product.find(filter);
        if (pageSize) {
            query = query.limit(pageSize).skip(pageSize * (page - 1));
        }

        const products = await query;

        res.json({
            products,
            page,
            pages: pageSize ? Math.ceil(count / pageSize) : 1,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product Not Found",
            });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
        });
    }
};

const createProductReview =
    async (req, res) => {
        try {
            const {
                rating,
                comment,
            } = req.body;

            const product =
                await Product.findById(
                    req.params.id
                );

            if (product) {
                const alreadyReviewed = product.reviews.find(
                    (r) =>
                        (r.user && r.user.toString() === req.user._id.toString()) ||
                        (!r.user && r.name === req.user.name)
                );

                if (alreadyReviewed) {
                    return res.status(400).json({
                        message: "Already Reviewed",
                    });
                }

                const review = {
                    user: req.user._id,
                    name: req.user.name,
                    rating: Number(rating),
                    comment,
                };

                product.reviews.push(
                    review
                );

                product.numReviews =
                    product.reviews.length;

                product.rating =
                    product.reviews.reduce(
                        (
                            acc,
                            item
                        ) =>
                            item.rating +
                            acc,
                        0
                    ) /
                    product.reviews.length;

                await product.save();

                res.status(201).json({
                    message:
                        "Review Added",
                });
            } else {
                res.status(404).json({
                    message: "Product Not Found",
                });
            }
        } catch (error) {
            console.error("Error in createProductReview:", error);
            res.status(500).json({
                message: "Server Error",
            });
        }
    };

const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            image,
            rating,
            countInStock,
        } = req.body;

        const product = await Product.create({
            name,
            description,
            price,
            category,
            image,
            rating,
            countInStock,
        });

        res.status(201).json({
            message: "Product Created Successfully",
            product,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            image,
            rating,
            countInStock,
        } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.image = image || product.image;
            product.rating = rating || product.rating;
            product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({
                message: "Product Not Found",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product Not Found",
            });
        }

        res.status(200).json({
            message: "Product Removed",
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
        });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview
};