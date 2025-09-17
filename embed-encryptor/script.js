const caesarShift = function (str, amount) {
    if (amount < 0) {
        return caesarShift(str, amount + 26);
    }
    let output = "";
    for (let i = 0; i < str.length; i++) {
        let c = str[i];
        if (c.match(/[a-z]/i)) {
            let code = str.charCodeAt(i);
            if (code >= 65 && code <= 90) {
                c = String.fromCharCode(((code - 65 + amount) % 26) + 65);
            } else if (code >= 97 && code <= 122) {
                c = String.fromCharCode(((code - 97 + amount) % 26) + 97);
            }
        }
        output += c;
    }
    return output;
};

const Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) {
        var t = "";
        var n, r, i, s, o, u, a;
        var f = 0;
        e = Base64._utf8_encode(e);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) {
                u = a = 64
            } else if (isNaN(i)) {
                a = 64
            }
            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
        }
        return t
    }, decode: function (e) {
        var t = "";
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);
            if (u != 64) {
                t = t + String.fromCharCode(r)
            }
            if (a != 64) {
                t = t + String.fromCharCode(i)
            }
        }
        t = Base64._utf8_decode(t);
        return t
    }, _utf8_encode: function (e) {
        e = e.replace(/\r\n/g, "\n");
        var t = "";
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r)
            } else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128)
            } else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128)
            }
        }
        return t
    }, _utf8_decode: function (e) {
        var t = "";
        var n = 0;
        var r = c1 = c2 = 0;
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                n += 2
            } else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                n += 3
            }
        }
        return t
    }
}

const encrypt = (str, password) => {
    // szyfr cezara
    // return Base64.encode(caesarShift(str, +password));
    return Base64.encode(CryptoJS.AES.encrypt(str, password).toString());
}

const decrypt = (str, password) => {
    // return caesarShift(Base64.decode(str), -password);
    return CryptoJS.AES.decrypt(Base64.decode(str), password).toString(CryptoJS.enc.Utf8);
}

const copyToClipboard = (fieldId) => {
    let clipboardInput = document.getElementById(fieldId);
    clipboardInput.select();
    clipboardInput.setSelectionRange(0, 99999);
    document.execCommand("copy");
}

const toDataUrl = (url, callback) => {
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        let reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result, xhr.response.type);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

const downloadFile = (name, contents, mime_type) => {
    mime_type = mime_type || "text/plain";

    var blob = new Blob([contents], {type: mime_type});

    var dlink = document.createElement('a');
    dlink.download = name;
    dlink.href = window.URL.createObjectURL(blob);
    dlink.onclick = function(e) {
        // revokeObjectURL needs a delay to work properly
        var that = this;
        setTimeout(function() {
            window.URL.revokeObjectURL(that.href);
        }, 1500);
    };

    dlink.click();
    dlink.remove();
}

const loadFile = (file, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        callback(event.target.result);
    });
    reader.readAsText(file, 'UTF-8');
}

const getDateString = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day =`${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`
}

// --- functions ---

const convert = (mode, contentParam) => {
    let content = contentParam || document.getElementById(CONTENT_ID).value;
    let password = document.getElementById(PASSWORD_ID).value;
    if (!password || !password.length) {
        return 'password_required';
    }
    return mode[0] === 'e' ? encrypt(content, password) : decrypt(content, password);
}

const getCopyToClipboardPageContent = (textToCopy) => {
    return `
        <input type="button" value="copy to clipboard" onclick="copyToClipboard('target')"/>
        <input id="target" value="${textToCopy}"/>
    `;
}

const getConvertPageContent = (mode, targetValue) => {
    let encryptContent = getCopyToClipboardPageContent(targetValue);
    let decryptContent = `
        ${getCopyToClipboardPageContent(targetValue)}<br/>
        <p style="white-space: pre-wrap;">${targetValue.startsWith('http') ? '<a href="' + targetValue + '" target="_blank">' + targetValue + '</a>' : targetValue}</p>
    `;
    return mode[0] === 'e' ? encryptContent : decryptContent;
}

const getEmbedLinkPageContent = (content) => {
    let url = `${location.protocol}//${location.host}${location.pathname}?content=${content}`;
    return getCopyToClipboardPageContent(url);
}


// ---- main js

const EMBED_WIDTH = 320
const EMBED_HEIGHT = 240

const PAGE_ID = 'page';
const CONTENT_ID = 'content';
const PASSWORD_ID = 'password';
const RESULT_ID = 'result';

const VIDEO_TEMPLATE =
`<video width="${EMBED_WIDTH}" height="${EMBED_HEIGHT}" controls>
  <source src="movie.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
`;

const IFRAME_TEMPLATE =
`<iframe width="${EMBED_WIDTH}" height="${EMBED_HEIGHT}" 
    src="google.com">
</iframe>
`;

const TEMPLATES = {
    'img': '<img src="image.jpg"/>',
    'video': VIDEO_TEMPLATE,
    'iframe': IFRAME_TEMPLATE
}

const init = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    document.getElementById(CONTENT_ID).value = urlParams.get(CONTENT_ID)
    document.getElementById(PASSWORD_ID).value = urlParams.get(PASSWORD_ID)
}

const generateConvert = (mode) => {
    document.getElementById(PAGE_ID).innerHTML = getConvertPageContent(mode, convert(mode));
}

const edit = () => {
    document.getElementById(CONTENT_ID).value = convert('decrypt')
}

const generateEmbed = () => {
    document.getElementById(PAGE_ID).innerHTML = `<hr>${getEmbedLinkPageContent(convert('encrypt'))}`;
}

const putTemplate = (id) => {
    document.getElementById(CONTENT_ID).value = TEMPLATES[id];
}

const encryptImgUrlToFile = () => {
    toDataUrl(document.getElementById(CONTENT_ID).value, (base64Data, type) => {
        downloadFile(`embed_encryptor_${getDateString()}`, convert('encrypt', base64Data));
    });
}

const loadFromFile = (file) => {
    loadFile(file, (data) => {
        console.log(data);
        document.getElementById(PAGE_ID).innerHTML = `<img src="${convert('decrypt',data)}"/>`
    });
}

init();
