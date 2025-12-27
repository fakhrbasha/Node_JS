/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function (strs) {
    if (strs.length === 0) return ""
    let prfx = ""
    for (let i = 0; i < strs[0].length; i++) {
        let c = strs[0][i]
        for (let j = 1; j < strs.length; j++) {
            if (i >= strs[j].length || strs[j][i] !== c) {
                return prfx
            }
        }
        prfx += c
    }
    return prfx
};