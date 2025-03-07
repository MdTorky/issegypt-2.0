const buttonVariant = {
    hidden: {
        y: 200,
        opacity: 0
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 1,
            type: "spring",
        },
    },
    hover: {
        scale: 1.1,
    },
    tap: {
        scale: 0.1
    },
    exit: {
        y: 20,
        opacity: 0
    }
};

export default buttonVariant;
