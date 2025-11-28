// utils/processImageLink.js
export const processImageLink = (url) => {
    if (!url) return "";

    // Google Drive share links
    if (url.includes("drive.google.com")) {
        // Pattern: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
        const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);

        if (match && match[1]) {
            return `https://lh3.googleusercontent.com/d/${match[1]}`;
        }
    }

    // Return original if not Google Drive
    return url;
};
