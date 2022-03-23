"use strict";

// Main
class Self {
    info(){
        return {
            name: "Simple",
            flow: "javascript-obfuscator",
            encryptionLevel: "medium",
            author: [
                "All0cation"
            ]
        }
    }

    obfuscate(code, dependencies){
        const javascriptObfuscator = dependencies.javascriptObfuscator

        return new Promise((resolve)=>{
            var obfuscatedCode = ""

            obfuscatedCode = javascriptObfuscator.obfuscate(code, { target: "node", stringArrayEncoding: [ "rc4", "base64" ], identifierNamesGenerator: "dictionary", identifiersDictionary: [ "lllllLycanSObfuscatorlllll", "llllLycanSObfuscatorlllI", "llllLycanSObfuscatorllII", "llllLycanSObfuscatorlIII", "llllLycanSObfuscatorIIII", "lllILycanSObfuscatorIIII", "llIILycanSObfuscatorIIII", "lIIILycanSObfuscatorIIII", "IIIILycanSObfuscatorIIII" ], compact: true, simplify: true, ignoreImports: true, stringArray: true, stringArrayRotate: true, stringArrayIndexShift: true, splitStrings: true, splitStringsChunkLength: 100, stringArrayThreshold: 1, numbersToExpressions: true, controlFlowFlattening: true })

            resolve(obfuscatedCode.getObfuscatedCode())
        })
    }
}

module.exports = {
    self: Self
}