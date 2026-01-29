
/**
 * Transforms a Supabase Storage URL into an optimized Render URL.
 * 
 * @param url The original image URL (e.g. from database)
 * @param width Target width in pixels
 * @param quality Quality (0-100), default 75
 * @returns The optimized URL
 */
export function getOptimizedImage(url: string | null | undefined, width: number = 800, quality: number = 75): string {
    if (!url) return "";

    // If it's not a Supabase storage URL, return as is
    // If it's not a Supabase storage URL, return as is
    // if (!url.includes("supabase.co/storage/v1/object/public")) {
    //     return url;
    // }

    // SUPABASE IMAGE TRANSFORMATION:
    // Bu özellik Supabase Pro planı veya eklentisi gerektirebilir.
    // Kullanıcıda çalışmadığı için şimdilik devre dışı bırakıyoruz (Pass-through).
    // let optimizedUrl = url.replace("/object/public", "/render/image/public");
    // const separator = optimizedUrl.includes("?") ? "&" : "?";
    // return `${optimizedUrl}${separator}width=${width}&quality=${quality}&resize=contain`;

    return url;
}
