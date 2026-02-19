/**
 * 公共工具页面 JavaScript 模块
 */

/**
 * 初始化公共工具页面
 */
function initCommonToolsPage() {
    // 绑定工具卡片点击事件
    $('.tool-card').on('click', function() {
        const toolType = $(this).data('tool');
        openToolModal(toolType);
    });
    
    // 绑定工具执行按钮点击事件
    $('#tool-execute').on('click', function() {
        const toolType = $('#tool-modal').data('tool');
        executeTool(toolType);
    });
}

/**
 * 打开工具模态框
 * @param {string} toolType - 工具类型
 */
function openToolModal(toolType) {
    let title = '';
    let content = '';
    
    switch (toolType) {
        case 'timestamp':
            title = '时间戳转换';
            content = `
                <div class="form-group">
                    <label class="form-label">时间戳</label>
                    <input type="text" class="form-control" id="timestamp-input" placeholder="输入时间戳或留空获取当前时间戳">
                </div>
                <div class="form-group">
                    <label class="form-label">日期时间</label>
                    <input type="datetime-local" class="form-control" id="datetime-input">
                </div>
                <div class="result-container d-none" id="timestamp-result">
                    <div class="result-title">转换结果</div>
                    <div class="result-content" id="timestamp-result-content"></div>
                </div>
            `;
            break;
            
        case 'base64':
            title = 'Base64加密解密';
            content = `
                <div class="form-group">
                    <label class="form-label">操作类型</label>
                    <select class="form-control" id="base64-operation">
                        <option value="encode">加密 (Encode)</option>
                        <option value="decode">解密 (Decode)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">输入文本</label>
                    <textarea class="form-control" id="base64-input" rows="4" placeholder="输入要加密或解密的文本"></textarea>
                </div>
                <div class="result-container d-none" id="base64-result">
                    <div class="result-title">结果</div>
                    <div class="result-content" id="base64-result-content"></div>
                </div>
            `;
            break;
            
        case 'json':
            title = 'JSON格式化';
            content = `
                <div class="form-group">
                    <label class="form-label">操作类型</label>
                    <select class="form-control" id="json-operation">
                        <option value="beautify">美化</option>
                        <option value="minify">压缩</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">JSON文本</label>
                    <textarea class="form-control" id="json-input" rows="6" placeholder="输入JSON文本"></textarea>
                </div>
                <div class="result-container d-none" id="json-result">
                    <div class="result-title">结果</div>
                    <div class="result-content" id="json-result-content"></div>
                </div>
            `;
            break;
            
        case 'url':
            title = 'URL编码解码';
            content = `
                <div class="form-group">
                    <label class="form-label">操作类型</label>
                    <select class="form-control" id="url-operation">
                        <option value="encode">编码 (Encode)</option>
                        <option value="decode">解码 (Decode)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">输入文本</label>
                    <input type="text" class="form-control" id="url-input" placeholder="输入要编码或解码的URL">
                </div>
                <div class="result-container d-none" id="url-result">
                    <div class="result-title">结果</div>
                    <div class="result-content" id="url-result-content"></div>
                </div>
            `;
            break;
            
        case 'password':
            title = '随机密码生成';
            content = `
                <div class="form-group">
                    <label class="form-label">密码长度</label>
                    <input type="number" class="form-control" id="password-length" min="6" max="50" value="12">
                </div>
                <div class="form-group">
                    <label class="form-label">包含选项</label>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="include-uppercase" checked>
                        <label class="form-check-label" for="include-uppercase">包含大写字母</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="include-lowercase" checked>
                        <label class="form-check-label" for="include-lowercase">包含小写字母</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="include-numbers" checked>
                        <label class="form-check-label" for="include-numbers">包含数字</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="include-symbols" checked>
                        <label class="form-check-label" for="include-symbols">包含特殊字符</label>
                    </div>
                </div>
                <div class="result-container d-none" id="password-result">
                    <div class="result-title">生成的密码</div>
                    <div class="result-content" id="password-result-content"></div>
                </div>
            `;
            break;
            
        case 'hash':
            title = '文本哈希';
            content = `
                <div class="form-group">
                    <label class="form-label">哈希算法</label>
                    <select class="form-control" id="hash-algorithm">
                        <option value="md5">MD5</option>
                        <option value="sha1">SHA1</option>
                        <option value="sha256">SHA256</option>
                        <option value="sha512">SHA512</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">输入文本</label>
                    <input type="text" class="form-control" id="hash-input" placeholder="输入要计算哈希的文本">
                </div>
                <div class="result-container d-none" id="hash-result">
                    <div class="result-title">哈希值</div>
                    <div class="result-content" id="hash-result-content"></div>
                </div>
            `;
            break;
            
        case 'ip':
            title = 'IP地址工具';
            content = `
                <div class="form-group">
                    <label class="form-label">IP地址</label>
                    <input type="text" class="form-control" id="ip-input" placeholder="输入IP地址">
                </div>
                <div class="result-container d-none" id="ip-result">
                    <div class="result-title">IP信息</div>
                    <div class="result-content" id="ip-result-content"></div>
                </div>
            `;
            break;
            
        case 'color':
            title = '颜色转换';
            content = `
                <div class="form-group">
                    <label class="form-label">输入格式</label>
                    <select class="form-control" id="color-input-format">
                        <option value="hex">HEX (#RRGGBB)</option>
                        <option value="rgb">RGB (r, g, b)</option>
                        <option value="hsl">HSL (h, s, l)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">颜色值</label>
                    <input type="text" class="form-control" id="color-input" placeholder="输入颜色值">
                </div>
                <div class="result-container d-none" id="color-result">
                    <div class="result-title">转换结果</div>
                    <div class="result-content" id="color-result-content"></div>
                </div>
            `;
            break;
            
        case 'naming':
            title = '变量命名转换';
            content = `
                <div class="form-group">
                    <label class="form-label">输入文本</label>
                    <input type="text" class="form-control" id="naming-input" placeholder="输入要转换的变量名">
                </div>
                <div class="result-container d-none" id="naming-result">
                    <div class="result-title">转换结果</div>
                    <div class="result-content" id="naming-result-content"></div>
                </div>
            `;
            break;
    }
    
    // 设置模态框标题和内容
    $('#tool-modal-label').text(title);
    $('#tool-content').html(content);
    $('#tool-modal').data('tool', toolType);
    
    // 显示模态框
    const modal = new bootstrap.Modal(document.getElementById('tool-modal'));
    modal.show();
}

/**
 * 执行工具
 * @param {string} toolType - 工具类型
 */
function executeTool(toolType) {
    switch (toolType) {
        case 'timestamp':
            executeTimestampTool();
            break;
        case 'base64':
            executeBase64Tool();
            break;
        case 'json':
            executeJsonTool();
            break;
        case 'url':
            executeUrlTool();
            break;
        case 'password':
            executePasswordTool();
            break;
        case 'hash':
            executeHashTool();
            break;
        case 'ip':
            executeIpTool();
            break;
        case 'color':
            executeColorTool();
            break;
        case 'naming':
            executeNamingTool();
            break;
    }
}

/**
 * 执行时间戳转换工具
 */
function executeTimestampTool() {
    const timestampInput = $('#timestamp-input').val();
    const datetimeInput = $('#datetime-input').val();
    let result = '';
    
    if (timestampInput) {
        const timestamp = parseInt(timestampInput);
        const date = new Date(timestamp * 1000);
        result = `
时间戳: ${timestamp}
日期时间: ${date.toLocaleString()}
ISO格式: ${date.toISOString()}
UTC格式: ${date.toUTCString()}
        `.trim();
    } else if (datetimeInput) {
        const date = new Date(datetimeInput);
        const timestamp = Math.floor(date.getTime() / 1000);
        result = `
日期时间: ${date.toLocaleString()}
时间戳: ${timestamp}
毫秒时间戳: ${date.getTime()}
        `.trim();
    } else {
        const now = new Date();
        const timestamp = Math.floor(now.getTime() / 1000);
        result = `
当前时间: ${now.toLocaleString()}
当前时间戳: ${timestamp}
当前毫秒时间戳: ${now.getTime()}
        `.trim();
    }
    
    $('#timestamp-result-content').text(result);
    $('#timestamp-result').removeClass('d-none');
}

/**
 * 执行Base64加密解密工具
 */
function executeBase64Tool() {
    const operation = $('#base64-operation').val();
    const input = $('#base64-input').val();
    let result = '';
    
    try {
        if (operation === 'encode') {
            result = btoa(unescape(encodeURIComponent(input)));
        } else {
            result = decodeURIComponent(escape(atob(input)));
        }
        
        $('#base64-result-content').text(result);
        $('#base64-result').removeClass('d-none');
    } catch (error) {
        $('#base64-result-content').text(`错误: ${error.message}`);
        $('#base64-result').removeClass('d-none');
    }
}

/**
 * 执行JSON格式化工具
 */
function executeJsonTool() {
    const operation = $('#json-operation').val();
    const input = $('#json-input').val();
    let result = '';
    
    try {
        const json = JSON.parse(input);
        
        if (operation === 'beautify') {
            result = JSON.stringify(json, null, 2);
        } else {
            result = JSON.stringify(json);
        }
        
        $('#json-result-content').text(result);
        $('#json-result').removeClass('d-none');
    } catch (error) {
        $('#json-result-content').text(`错误: ${error.message}`);
        $('#json-result').removeClass('d-none');
    }
}

/**
 * 执行URL编码解码工具
 */
function executeUrlTool() {
    const operation = $('#url-operation').val();
    const input = $('#url-input').val();
    let result = '';
    
    try {
        if (operation === 'encode') {
            result = encodeURIComponent(input);
        } else {
            result = decodeURIComponent(input);
        }
        
        $('#url-result-content').text(result);
        $('#url-result').removeClass('d-none');
    } catch (error) {
        $('#url-result-content').text(`错误: ${error.message}`);
        $('#url-result').removeClass('d-none');
    }
}

/**
 * 执行随机密码生成工具
 */
function executePasswordTool() {
    const length = parseInt($('#password-length').val());
    const includeUppercase = $('#include-uppercase').is(':checked');
    const includeLowercase = $('#include-lowercase').is(':checked');
    const includeNumbers = $('#include-numbers').is(':checked');
    const includeSymbols = $('#include-symbols').is(':checked');
    
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    $('#password-result-content').text(password);
    $('#password-result').removeClass('d-none');
}

/**
 * 执行文本哈希工具
 */
function executeHashTool() {
    const algorithm = $('#hash-algorithm').val();
    const input = $('#hash-input').val();
    
    let result = '';
    
    if (algorithm === 'md5') {
        result = simpleHash(input, 32);
    } else if (algorithm === 'sha1') {
        result = simpleHash(input, 40);
    } else if (algorithm === 'sha256') {
        result = simpleHash(input, 64);
    } else if (algorithm === 'sha512') {
        result = simpleHash(input, 128);
    }
    
    $('#hash-result-content').text(result);
    $('#hash-result').removeClass('d-none');
}

/**
 * 简单哈希函数
 * @param {string} str - 输入字符串
 * @param {number} length - 输出长度
 * @returns {string} 哈希值
 */
function simpleHash(str, length) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    let hex = Math.abs(hash).toString(16);
    while (hex.length < length) {
        hex = '0' + hex;
    }
    return hex.substring(0, length);
}

/**
 * 执行IP地址工具
 */
function executeIpTool() {
    const ip = $('#ip-input').val();
    
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    if (ipRegex.test(ip)) {
        const result = `
IP地址: ${ip}
格式: IPv4
验证: 有效
        `.trim();
        $('#ip-result-content').text(result);
    } else {
        const result = `
IP地址: ${ip}
验证: 无效的IP地址格式
        `.trim();
        $('#ip-result-content').text(result);
    }
    
    $('#ip-result').removeClass('d-none');
}

/**
 * 执行颜色转换工具
 */
function executeColorTool() {
    const inputFormat = $('#color-input-format').val();
    const input = $('#color-input').val();
    
    let result = '';
    
    if (inputFormat === 'hex') {
        const hex = input.replace('#', '');
        if (hex.length === 6) {
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            
            result = `
HEX: #${hex}
RGB: rgb(${r}, ${g}, ${b})
HSL: hsl(${rgbToHsl(r, g, b).join(', ')})
            `.trim();
        } else {
            result = '错误: 无效的HEX格式';
        }
    } else if (inputFormat === 'rgb') {
        const rgbMatch = input.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch) {
            const r = parseInt(rgbMatch[1]);
            const g = parseInt(rgbMatch[2]);
            const b = parseInt(rgbMatch[3]);
            
            const hex = rgbToHex(r, g, b);
            
            result = `
RGB: rgb(${r}, ${g}, ${b})
HEX: #${hex}
HSL: hsl(${rgbToHsl(r, g, b).join(', ')})
            `.trim();
        } else {
            result = '错误: 无效的RGB格式';
        }
    } else if (inputFormat === 'hsl') {
        const hslMatch = input.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        if (hslMatch) {
            const h = parseInt(hslMatch[1]);
            const s = parseInt(hslMatch[2]);
            const l = parseInt(hslMatch[3]);
            
            const rgb = hslToRgb(h, s / 100, l / 100);
            const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
            
            result = `
HSL: hsl(${h}, ${s}%, ${l}%)
RGB: rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})
HEX: #${hex}
            `.trim();
        } else {
            result = '错误: 无效的HSL格式';
        }
    }
    
    $('#color-result-content').text(result);
    $('#color-result').removeClass('d-none');
}

/**
 * RGB转HEX
 * @param {number} r - 红色通道
 * @param {number} g - 绿色通道
 * @param {number} b - 蓝色通道
 * @returns {string} HEX颜色值
 */
function rgbToHex(r, g, b) {
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * RGB转HSL
 * @param {number} r - 红色通道
 * @param {number} g - 绿色通道
 * @param {number} b - 蓝色通道
 * @returns {Array} HSL数组
 */
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

/**
 * HSL转RGB
 * @param {number} h - 色相
 * @param {number} s - 饱和度
 * @param {number} l - 亮度
 * @returns {Array} RGB数组
 */
function hslToRgb(h, s, l) {
    let r, g, b;
    
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * 执行变量命名转换工具
 */
function executeNamingTool() {
    const input = $('#naming-input').val();
    
    if (!input) {
        $('#naming-result-content').text('请输入要转换的变量名');
        $('#naming-result').removeClass('d-none');
        return;
    }
    
    const words = parseToWords(input);
    
    const camelCase = toCamelCase(words);
    const pascalCase = toPascalCase(words);
    const snakeCase = toSnakeCase(words);
    const snakeCaseUpper = toSnakeCaseUpper(words);
    const packageName = toPackageName(words);
    const kebabCase = toKebabCase(words);
    
    const result = `
驼峰命名法 (camelCase): ${camelCase}
帕斯卡命名法 (PascalCase): ${pascalCase}
下划线+小写 (snake_case): ${snakeCase}
下划线+大写 (SNAKE_CASE): ${snakeCaseUpper}
包名格式 (package.name): ${packageName}
中横线+小写 (kebab-case): ${kebabCase}
    `.trim();
    
    $('#naming-result-content').text(result);
    $('#naming-result').removeClass('d-none');
}

/**
 * 解析字符串为单词数组
 * @param {string} str - 输入字符串
 * @returns {Array} 单词数组
 */
function parseToWords(str) {
    let words = [];
    let currentWord = '';
    
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        
        if (char === '_' || char === '-' || char === '.' || char === ' ') {
            if (currentWord) {
                words.push(currentWord);
                currentWord = '';
            }
        } else if (char >= 'A' && char <= 'Z') {
            if (currentWord && !(i > 0 && str[i - 1] >= 'A' && str[i - 1] <= 'Z')) {
                words.push(currentWord);
                currentWord = '';
            }
            currentWord += char.toLowerCase();
        } else {
            currentWord += char.toLowerCase();
        }
    }
    
    if (currentWord) {
        words.push(currentWord);
    }
    
    return words.filter(word => word.length > 0);
}

/**
 * 转换为驼峰命名法
 * @param {Array} words - 单词数组
 * @returns {string} 驼峰命名法字符串
 */
function toCamelCase(words) {
    if (words.length === 0) return '';
    let result = words[0].toLowerCase();
    for (let i = 1; i < words.length; i++) {
        result += words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
    }
    return result;
}

/**
 * 转换为帕斯卡命名法
 * @param {Array} words - 单词数组
 * @returns {string} 帕斯卡命名法字符串
 */
function toPascalCase(words) {
    if (words.length === 0) return '';
    let result = '';
    for (let i = 0; i < words.length; i++) {
        result += words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
    }
    return result;
}

/**
 * 转换为下划线小写命名法
 * @param {Array} words - 单词数组
 * @returns {string} 下划线小写命名法字符串
 */
function toSnakeCase(words) {
    return words.map(word => word.toLowerCase()).join('_');
}

/**
 * 转换为下划线大写命名法
 * @param {Array} words - 单词数组
 * @returns {string} 下划线大写命名法字符串
 */
function toSnakeCaseUpper(words) {
    return words.map(word => word.toUpperCase()).join('_');
}

/**
 * 转换为包名格式
 * @param {Array} words - 单词数组
 * @returns {string} 包名格式字符串
 */
function toPackageName(words) {
    return words.map(word => word.toLowerCase()).join('.');
}

/**
 * 转换为中横线小写命名法
 * @param {Array} words - 单词数组
 * @returns {string} 中横线小写命名法字符串
 */
function toKebabCase(words) {
    return words.map(word => word.toLowerCase()).join('-');
}
