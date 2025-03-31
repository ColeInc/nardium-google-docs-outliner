export function extractGoogleDocId() {
    console.log("cole extracting google doc id from url", window.location.href)
    const url = window.location.href;
    const match = url.match(/\/document\/d\/([a-zA-Z0-9-_]+)/);
    console.log("cole returning this google doc id from url", match ? match[1] : null)
    return match ? match[1] : null;
}
