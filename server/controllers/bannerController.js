const Banner = require("../models/Banner");

// @desc    Get all active banner configurations
// @route   GET /api/banner
// @access  Public
const getActiveBanner = async (req, res) => {
    try {
        let banners = await Banner.find({});
        
        // If we don't have all three categories seeded, seed them automatically!
        if (!banners || banners.length < 3) {
            // Delete any partial setup to ensure clean seed
            await Banner.deleteMany({});
            
            const seedBanners = [
                {
                    category: "men",
                    title: "Elevate Your Style",
                    subtitle: "🔥 New Arrivals Collection",
                    description: "Premium shirts, denim, shoes & designer accessories — crafted for the modern man.",
                    productImage1: "https://images.unsplash.com/photo-1588359348347-9bc6cbaa689f?q=80&w=400&auto=format&fit=crop", // Denim Shirt
                    productImage2: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=400&auto=format&fit=crop", // Jeans
                    productImage3: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=400&auto=format&fit=crop", // Sneakers
                    productImage4: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=400&auto=format&fit=crop", // Blazer
                    productImage5: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=400&auto=format&fit=crop", // Accessories / Belt
                    modelImage: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop", // Model
                    buttonText: "Shop Men's Fashion",
                    buttonLink: "/shop/men",
                    isActive: true
                },
                {
                    category: "women",
                    title: "Trending Silhouettes",
                    subtitle: "✨ Curated Women's Looks",
                    description: "High-fashion knitwear, coordinates, boots, and suede designer shoulder bags.",
                    productImage1: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=400&auto=format&fit=crop", // Knitwear / Dress
                    productImage2: "https://images.unsplash.com/photo-1609505848912-b7e3b8b4beda?q=80&w=400&auto=format&fit=crop", // Trousers
                    productImage3: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=400&auto=format&fit=crop", // Leather Boots
                    productImage4: "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=400&auto=format&fit=crop", // Outer Coat
                    productImage5: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&auto=format&fit=crop", // Handbag
                    modelImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop", // Model
                    buttonText: "Shop Women's Collection",
                    buttonLink: "/shop/women",
                    isActive: true
                },
                {
                    category: "kids",
                    title: "Playful Playgrounds",
                    subtitle: "🎓 Student Active Styles",
                    description: "Bright comfortable layering jackets, stretch joggers, sports sneakers, and caps.",
                    productImage1: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=400&auto=format&fit=crop", // Jacket
                    productImage2: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=400&auto=format&fit=crop", // Joggers
                    productImage3: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?q=80&w=400&auto=format&fit=crop", // Kid Sneakers
                    productImage4: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=400&auto=format&fit=crop", // Kid Knit
                    productImage5: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=400&auto=format&fit=crop", // Cap / Backpack
                    modelImage: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=800&auto=format&fit=crop", // Kids model
                    buttonText: "Shop Kids' Collection",
                    buttonLink: "/shop/kids",
                    isActive: true
                }
            ];

            banners = await Banner.create(seedBanners);
            console.log("⚡ Auto-seeded all 3 dynamic showcase banners successfully!");
        }

        res.status(200).json(banners);
    } catch (error) {
        console.error("Error in getActiveBanner:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Save banner configuration (Create or Update by Category)
// @route   POST /api/banner
// @access  Private/Admin
const saveBanner = async (req, res) => {
    try {
        const {
            category,
            title,
            subtitle,
            description,
            productImage1,
            productImage2,
            productImage3,
            productImage4,
            productImage5,
            modelImage,
            buttonText,
            buttonLink,
            isActive
        } = req.body;

        if (!category || !["men", "women", "kids"].includes(category)) {
            return res.status(400).json({ message: "Valid category (men, women, kids) is required." });
        }

        // Query by category and update or create
        let banner = await Banner.findOne({ category });

        if (banner) {
            banner.title = title !== undefined ? title : banner.title;
            banner.subtitle = subtitle !== undefined ? subtitle : banner.subtitle;
            banner.description = description !== undefined ? description : banner.description;
            banner.productImage1 = productImage1 !== undefined ? productImage1 : banner.productImage1;
            banner.productImage2 = productImage2 !== undefined ? productImage2 : banner.productImage2;
            banner.productImage3 = productImage3 !== undefined ? productImage3 : banner.productImage3;
            banner.productImage4 = productImage4 !== undefined ? productImage4 : banner.productImage4;
            banner.productImage5 = productImage5 !== undefined ? productImage5 : banner.productImage5;
            banner.modelImage = modelImage !== undefined ? modelImage : banner.modelImage;
            banner.buttonText = buttonText !== undefined ? buttonText : banner.buttonText;
            banner.buttonLink = buttonLink !== undefined ? buttonLink : banner.buttonLink;
            banner.isActive = isActive !== undefined ? isActive : banner.isActive;
            
            await banner.save();
        } else {
            banner = await Banner.create({
                category,
                title,
                subtitle,
                description,
                productImage1,
                productImage2,
                productImage3,
                productImage4,
                productImage5,
                modelImage,
                buttonText,
                buttonLink,
                isActive
            });
        }

        res.status(200).json({
            message: `${category.toUpperCase()} Banner Configuration Saved Successfully`,
            banner
        });
    } catch (error) {
        console.error("Error in saveBanner:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Upload a showcase image for a specific category and field
// @route   POST /api/banner/upload
// @access  Private/Admin
const uploadBannerImage = async (req, res) => {
    try {
        const { category, fieldName, image } = req.body;

        if (!category || !["men", "women", "kids"].includes(category)) {
            return res.status(400).json({ message: "Valid category (men, women, kids) is required." });
        }
        if (!fieldName || (!fieldName.startsWith("productImage") && fieldName !== "modelImage")) {
            return res.status(400).json({ message: "Valid image field is required." });
        }
        if (!image) {
            return res.status(400).json({ message: "Image base64 data is required." });
        }

        // Decode base64 and extract file info
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const matchMime = image.match(/[^:]\w+\/[\w-+\d.]+(?=\;)/);
        const mimeType = matchMime ? matchMime[0] : "image/png";
        const extension = mimeType.split("/")[1] || "png";

        const fs = require("fs");
        const path = require("path");

        // Ensure server/uploads directory exists
        const uploadDir = path.join(__dirname, "../uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const fileName = `banner_${category}_${fieldName}_${Date.now()}.${extension}`;
        const filePath = path.join(uploadDir, fileName);

        fs.writeFileSync(filePath, base64Data, { encoding: "base64" });
        const publicUrl = `/uploads/${fileName}`;

        // Update MongoDB record
        let banner = await Banner.findOne({ category });
        if (banner) {
            // Delete previous local uploaded file if it exists to prevent disk clutter
            const oldUrl = banner[fieldName];
            if (oldUrl && oldUrl.startsWith("/uploads/")) {
                const oldFilename = oldUrl.split("/").pop();
                const oldFilePath = path.join(uploadDir, oldFilename);
                if (fs.existsSync(oldFilePath)) {
                    try {
                        fs.unlinkSync(oldFilePath);
                        console.log(`⚡ Removed previous local image: ${oldFilePath}`);
                    } catch (err) {
                        console.error("❌ Failed to delete previous file:", err);
                    }
                }
            }
            banner[fieldName] = publicUrl;
            await banner.save();
        } else {
            // Seed a default config if it doesn't exist
            const newBannerData = {
                category,
                title: `${category.charAt(0).toUpperCase() + category.slice(1)} Collection`,
                subtitle: "🔥 New Arrivals Collection",
                description: "Dynamic designer layouts updated via the Admin Showcase Visual Lab.",
                productImage1: "",
                productImage2: "",
                productImage3: "",
                productImage4: "",
                productImage5: "",
                modelImage: "",
                buttonText: "Shop Collection",
                buttonLink: `/shop/${category}`,
                isActive: true
            };
            newBannerData[fieldName] = publicUrl;
            banner = await Banner.create(newBannerData);
        }

        res.status(200).json({
            message: "Image uploaded and published successfully",
            url: publicUrl,
            banner
        });
    } catch (error) {
        console.error("Error in uploadBannerImage:", error);
        res.status(500).json({ message: "Server Error during image upload" });
    }
};

// @desc    Remove an image from a banner category and field, unlinking from local disk
// @route   POST /api/banner/remove-image
// @access  Private/Admin
const removeBannerImage = async (req, res) => {
    try {
        const { category, fieldName } = req.body;

        if (!category || !["men", "women", "kids"].includes(category)) {
            return res.status(400).json({ message: "Valid category (men, women, kids) is required." });
        }
        if (!fieldName || (!fieldName.startsWith("productImage") && fieldName !== "modelImage")) {
            return res.status(400).json({ message: "Valid image field is required." });
        }

        let banner = await Banner.findOne({ category });
        if (banner) {
            const oldUrl = banner[fieldName];
            
            // Delete previous local uploaded file if it exists
            if (oldUrl && oldUrl.startsWith("/uploads/")) {
                const fs = require("fs");
                const path = require("path");
                const uploadDir = path.join(__dirname, "../uploads");
                const oldFilename = oldUrl.split("/").pop();
                const oldFilePath = path.join(uploadDir, oldFilename);
                if (fs.existsSync(oldFilePath)) {
                    try {
                        fs.unlinkSync(oldFilePath);
                        console.log(`⚡ Removed local image from disk: ${oldFilePath}`);
                    } catch (err) {
                        console.error("❌ Failed to delete file:", err);
                    }
                }
            }

            banner[fieldName] = "";
            await banner.save();
        }

        res.status(200).json({
            message: "Image cleared successfully from banner configuration",
            banner
        });
    } catch (error) {
        console.error("Error in removeBannerImage:", error);
        res.status(500).json({ message: "Server Error during image removal" });
    }
};

module.exports = {
    getActiveBanner,
    saveBanner,
    uploadBannerImage,
    removeBannerImage
};
