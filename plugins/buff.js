"use strict";

// Main
class Self {
    info(){
        return {
            name: "Buff",
            flow: "jsconfuser + jsconfuser",
            encryptionLevel: "high",
            author: [
                "All0cation"
            ]
        }
    }

    obfuscate(code, dependencies){
        const jsConfuser = dependencies.jsConfuser

        return new Promise((resolve)=>{
            var obfuscatedCode = ""

            jsConfuser.obfuscate(code, { target: "node", preset: "high", stringEncoding: false, identifierGenerator: "zeroWidth" }).then((obfuscatedCode)=>{
                jsConfuser.obfuscate(obfuscatedCode, { target: "node", preset: "high", stringEncoding: false, identifierGenerator: "zeroWidth" }).then((obfuscatedCode)=>{
            
                    resolve(obfuscatedCode)
                }).catch(()=>{
                    return resolve(false)
                })
            }).catch(()=>{
                return resolve(false)
            })
        })
    }
}

module.exports = {
    self: Self
}