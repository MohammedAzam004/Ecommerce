
const Loader = ({ text = "Loading..." }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-10">
            {/* Elegant Spinning Ring */}
            <div className="relative flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-[3px] border-slate-100 animate-spin border-t-slate-900" />
            </div>
            
            {/* Loading subtext */}
            <h3 className="mt-5 text-xs font-semibold tracking-wider uppercase text-slate-400 animate-pulse">
                {text}
            </h3>
        </div>
    );
};

export default Loader;