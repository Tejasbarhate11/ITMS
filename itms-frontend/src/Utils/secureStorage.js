import SecureStorage from 'secure-web-storage';
var CryptoJS = require("crypto-js")

const secureStorage = new SecureStorage(sessionStorage, {
    hash: (key) => {
        key = CryptoJS.SHA256(key, process.env.REACT_APP_SECRET_KEY)
        return key.toString()
    },
    encrypt: (data) => {
        data = CryptoJS.AES.encrypt(data, process.env.REACT_APP_SECRET_KEY)
        data = data.toString()
        return data
    },
    decrypt: (data) => {
        data = CryptoJS.AES.decrypt(data, process.env.REACT_APP_SECRET_KEY)
        data = data.toString(CryptoJS.enc.Utf8)
        return data
    }
})

export default secureStorage