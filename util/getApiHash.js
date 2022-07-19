var crypto = require("crypto");

function getApiHash() {
    let ts = Date.now();
    let toHash = ts + process.env.PRIVATE_API_KEY + process.env.PUBLIC_API_KEY;
    let hashed = crypto.createHash("md5").update(toHash).digest("hex");
    return {
        hashed,
        ts,
    };
}

export default getApiHash;
