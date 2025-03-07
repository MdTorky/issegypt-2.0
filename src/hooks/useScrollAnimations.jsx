import { useScroll, useTransform, useSpring } from "framer-motion";

export const useScrollAnimations = () => {
    const { scrollYProgress } = useScroll();
    const { scrollY } = useScroll()

    // Background

    const opacityDown = useTransform(scrollY, [0, 800], [1, 0.8]);
    const scaleBackground = useTransform(scrollY, [0, 500, 800], [1, 1.5, 1]);
    const translateY = useTransform(scrollY, [600, 650, 700, 800, 900], [0, -300, -600, -800, -1000])
    const widthDown = useTransform(scrollY, [500, 800, 900], ["100%", "85%", "100%"])
    const fixedScaleDown = useTransform(scrollY, [0, 900, 900],
        ["fixed", "fixed", "absolute"]
    );
    const imageTitleYDown = useTransform(scrollYProgress, [0, 0.5, 1], [0, 30, 60]);
    const imageDescriptionOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]);

    const scaleLogo = useTransform(scrollY, [0, 500, 800, 900], [1, 3, 4, 1]);
    const translateXLogo = useTransform(scrollY, [0, 50, 90, 200], [0, -450, 0, 0])

    const fixedScaleDownLogo = useTransform(scrollY, [0, 100, 900, 900],
        ["relative", "relative", "fixed", "relative"]
    );
    const widthDownLogo = useTransform(scrollY, [0, 100, 900],
        ["100%", "80%", "20%"]
    );


    const scaleDown = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
    const handTitleOpacity = useTransform(scrollY, [700, 800], [0, 1]);


    const y = useTransform(scrollYProgress, [0, 0.5, 1], [200, 0, 200]);
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

    const xRight = useTransform(scrollYProgress, [0, 1], [0, -100]);

    return {
        scrollYProgress,
        scaleDown,
        scaleBackground,
        translateY,
        opacityDown,
        fixedScaleDown,
        widthDown,
        imageTitleYDown,
        imageDescriptionOpacity,
        handTitleOpacity,
        y,
        opacity,
        xRight,
        scaleLogo,
        fixedScaleDownLogo,
        translateXLogo,
        widthDownLogo
    };
};
