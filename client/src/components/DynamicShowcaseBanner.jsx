import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw } from "lucide-react";

const DynamicShowcaseBanner = ({ bannerData }) => {
    const [step, setStep] = useState(0); // 0 to 5 (0-4 are products, 5 is final model hero)
    const timerRef = useRef(null);

    // Sequenced animation timer
    const startSequence = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setStep(0);

        let currentStep = 0;
        timerRef.current = setInterval(() => {
            currentStep++;
            if (currentStep <= 5) {
                setStep(currentStep);
            } else {
                clearInterval(timerRef.current);
            }
        }, 1200); // Snatched and fast-moving 1.2s (1200ms) transition!
    };

    useEffect(() => {
        if (bannerData) {
            startSequence();
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [bannerData]);

    if (!bannerData) return null;

    // Collage Coordinates on the left for products after focus step (Spacious left-hand spread)
    const collageSettings = [
        { x: -160, y: -130, r: -12, scale: 0.6 },  // Product 1 (Top Left)
        { x: -60, y: -100, r: 8, scale: 0.6 },  // Product 2 (Top Right-Center)
        { x: -180, y: 20, r: -6, scale: 0.6 },  // Product 3 (Middle Left)
        { x: -70, y: 40, r: 10, scale: 0.6 },  // Product 4 (Middle Right-Center)
        { x: -120, y: 140, r: -8, scale: 0.6 }   // Product 5 (Bottom Center)
    ];

    const products = [
        bannerData.productImage1,
        bannerData.productImage2,
        bannerData.productImage3,
        bannerData.productImage4,
        bannerData.productImage5
    ];

    // Category-specific ambient glows
    let glowColor = "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(0,0,0,0) 70%)"; // default men blue
    if (bannerData.category === "women") {
        glowColor = "radial-gradient(circle, rgba(244,63,94,0.35) 0%, rgba(0,0,0,0) 70%)"; // rose-gold
    } else if (bannerData.category === "kids") {
        glowColor = "radial-gradient(circle, rgba(245,158,11,0.3) 0%, rgba(0,0,0,0) 70%)"; // sand-gold
    }

    return (
        <div className="w-full h-full max-w-[480px] sm:max-w-[550px] md:max-w-none aspect-[4/3] md:h-full relative flex items-center justify-center select-none overflow-visible">

            {/* Ambient category backglow glow */}
            <div
                className="absolute inset-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 inset-0 m-auto transition-all duration-1000"
                style={{ background: glowColor }}
            />

            {/* Left Collage Stack Container (Overlapping lookbook grid) - shifted left to make room */}
            <div className="absolute left-[10%] md:left-[16%] top-1/2 -translate-y-1/2 w-1 h-1 z-20 overflow-visible" style={{ perspective: "1000px" }}>
                <AnimatePresence>
                    {products.map((img, idx) => {
                        const settings = collageSettings[idx];
                        const isFocused = step === idx;
                        const isCollaged = step > idx;

                        let animateState = "hidden";
                        if (isFocused) animateState = "focus";
                        else if (isCollaged) animateState = "collage";

                        return (
                            <motion.div
                                key={idx}
                                initial="hidden"
                                animate={animateState}
                                variants={{
                                    hidden: { opacity: 0, x: 260, y: 0, scale: 0.8, rotate: 0, zIndex: 10 },
                                    focus: {
                                        opacity: 1,
                                        x: 180, // Enter and zoom in the right side area first!
                                        y: -20,
                                        scale: 1.2,
                                        rotate: 4,
                                        zIndex: 40,
                                        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
                                    },
                                    collage: {
                                        opacity: 0.85,
                                        x: settings.x, // Then glide left into settled safe collage positions!
                                        y: settings.y,
                                        scale: settings.scale,
                                        rotate: settings.r,
                                        zIndex: 20 + idx,
                                        transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] }
                                    }
                                }}
                                className="absolute -translate-x-1/2 -translate-y-1/2 w-[120px] sm:w-[150px] aspect-[3/4] overflow-visible pointer-events-none"
                                style={{
                                    filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.065)) drop-shadow(0 4px 6px rgba(0,0,0,0.03))"
                                }}
                            >
                                <div className="w-full h-full bg-white/70 backdrop-blur-md rounded-3xl p-2.5 border border-white/90 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={img}
                                        alt={`Product piece ${idx + 1}`}
                                        className="w-full h-full object-contain mix-blend-multiply"
                                        onError={(e) => { e.target.src = "https://placehold.co/100x133/ffffff/a1a1aa?text=Image"; }}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Right Side: Final Human Model Image - shifted to the far right and scaled significantly larger */}
            <div className="absolute right-0 sm:right-[3%] md:right-[5%] w-[240px] sm:w-[290px] md:w-[350px] h-[92%] flex items-center justify-center z-30 overflow-visible">
                <AnimatePresence>
                    {step === 5 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: 85, rotate: 2 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                x: 0,
                                rotate: 0,
                                y: [0, -6, 0] // Gentle infinite float wave
                            }}
                            transition={{
                                opacity: { duration: 0.8, ease: "easeOut" },
                                scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                                x: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                                rotate: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                                y: {
                                    repeat: Infinity,
                                    duration: 6,
                                    ease: "easeInOut",
                                    delay: 0.5
                                }
                            }}
                            className="w-full h-full rounded-[40px] overflow-hidden border border-white/80 relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.18)]"
                            style={{
                                filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.04))"
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 pointer-events-none z-10" />

                            <img
                                src={bannerData.modelImage}
                                alt="Final Campaign Model"
                                className="w-full h-full object-cover select-none"
                                onError={(e) => { e.target.src = "https://placehold.co/300x400/f8fafc/a1a1aa?text=Styled+Model"; }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Controls panel — placed bottom-left so they never overlap the model image */}
            <div className="absolute bottom-3 left-3 flex flex-row items-center gap-2 z-40">
                <div className="bg-white/50 backdrop-blur-md border border-slate-200/50 rounded-full px-3 py-1.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                    <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" />
                    <span>Dynamic Fitting Lab</span>
                </div>

                {step === 5 && (
                    <motion.button
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={startSequence}
                        className="bg-white/80 backdrop-blur-md hover:bg-white text-zinc-800 border border-slate-200/80 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer animate-fade-in"
                        title="Replay Fit Transition"
                    >
                        <RefreshCw className="h-3 w-3 text-slate-500 animate-spin-slow" />
                        <span>Replay Fit</span>
                    </motion.button>
                )}
            </div>
        </div>
    );
};

export default DynamicShowcaseBanner;
