import axios from "axios";

/**
 * Handles sending the file and target folder ID to the backend server.
 * Your backend MUST implement the Google Drive API logic for upload and setting permissions.
 *
 * @param {File} file - The image file selected by the user.
 * @param {string} driveFolderId - The target Google Drive Folder ID.
 * @param {string} apiBaseUrl - The base URL of your API (e.g., 'http://localhost:4000').
 * @param {string} token - The user authentication token (if needed for secured endpoints).
 * @returns {Promise<string>} The public URL of the uploaded image file.
 */
const uploadFileToBackend = async (file, driveFolderId, apiBaseUrl, token) => {
    // --- IMPORTANT: This endpoint MUST be implemented on your Express server ---
    const endpoint = `${apiBaseUrl}/api/gallery/upload-to-drive`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderId', driveFolderId);
    // You might also need to send the file type or other metadata

    try {
        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await axios.post(endpoint, formData, {
            headers: {
                // Axios will set 'Content-Type' to 'multipart/form-data' automatically
                ...headers,
            },
        });

        // The backend should return the public URL of the uploaded image
        const { publicImageUrl } = response.data;
        if (!publicImageUrl) {
            throw new Error("Backend did not return a public image URL.");
        }

        return publicImageUrl;

    } catch (error) {
        // Axios error handling
        const errorMessage = error.response?.data?.error || error.message || 'Server failed to upload file.';
        console.error("Upload failed in client function:", error);
        throw new Error(errorMessage);
    }
};

export default uploadFileToBackend;