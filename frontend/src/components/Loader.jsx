const Loader = ({ size = 'medium' }) => {
    const sizeClasses = {
        small: 'h-8 w-8 border-2',
        medium: 'h-16 w-16 border-4',
        large: 'h-24 w-24 border-4',
    };

    return (
        <div className="flex items-center justify-center">
            <div
                className={`${sizeClasses[size]} animate-spin rounded-full border-t-primary-600 border-b-primary-600 border-l-transparent border-r-transparent`}
            ></div>
        </div>
    );
};

export default Loader;
