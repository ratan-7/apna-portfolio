
export function buildDownloadUrl(cloudinaryUrl, filename) {
    if (!cloudinaryUrl) return cloudinaryUrl;

    if (!cloudinaryUrl.includes("/upload/")) return cloudinaryUrl;

    const safeName = filename
        .replace(/[^a-zA-Z0-9-_]/g, "_")
        .replace(/_+/g, "_");

    return cloudinaryUrl.replace(
        "/upload/",
        `/upload/fl_attachment:${safeName}/`
    );
}