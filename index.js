"use strict";

// Dependencies
const javascriptObfuscator = require("javascript-obfuscator")
const recursiveRD = require("recursive-readdir-async")
const readLine = require("readline-sync")
const jsConfuser = require("js-confuser")
const Columnify = require("columnify")
const Base64 = require("base-64")
const Chalk = require("chalk")
const Fs = require("fs")

// Variables
var Lycan = {
    obfuscators: [],
    toObfuscate: null
}

// Functions
function log(type, message){
    if(type === "i"){
        console.log(`[${Chalk.blueBright("*")}] ${message}`)
    }else if(type === "e"){
        console.log(`[${Chalk.red("*")}] ${message}`)
    }
}

Lycan.navigation = async function(){
    const command = readLine.question(`${Chalk.red("lycan>")} `)
    const commandArgs = command.split(" ")

    if(command === "help"){
        console.log(`
General commands
================

    Command         Description
    -------         -----------
    help            Show this.
    obfuscate       Obfuscate the target.
    set             Set a file or directory(Recursive files) to obfuscate.
    config          Show your configuration.
    obfuscators     Show all the loaded obfuscators.
    exit            Exit Lycan.
    `)
    }else if(commandArgs[0] === "obfuscate"){
        if(!Lycan.toObfuscate){
            log("e", "The toObfuscator config is empty, please set a file or directory to obfuscate using the set command.")
            return Lycan.navigation()
        }

        if(!commandArgs[1]){
            log("i", "Usage: obfuscate <obfuscators to use ID(Multiple ids should be split by ,)>")
            return Lycan.navigation()
        }

        const obfuscators = []

        for( const id of commandArgs[1].split(",") ){
            for( const obfuscator of Lycan.obfuscators ){
                if(obfuscator.id == id){
                    obfuscators.push(obfuscator)
                }
            }
        }

        if(!obfuscators.length){
            log("e", "Invalid obfuscators id detected.")
            return Lycan.navigation()
        }

        const dependencies = { javascriptObfuscator: javascriptObfuscator, Base64: Base64, jsConfuser: jsConfuser }
        var obfuscatedIndex = 0
        
        function obfuscateFile(filePath){
            var obfuscatedCode = Fs.readFileSync(filePath, "utf8")

            return new Promise((resolve)=>{
                async function obfuscate(){
                    if(obfuscatedIndex === obfuscators.length){
                        Fs.writeFileSync(filePath, obfuscatedCode, "utf8")
                        return resolve(obfuscatedCode)
                    }

                    var { self } = require(obfuscators[obfuscatedIndex].path)
                    self = new self()
                    obfuscatedCode = await self.obfuscate(obfuscatedCode, dependencies)
    
                    obfuscatedIndex++
                    obfuscate()
                }

                obfuscate()
            })
        }

        async function obfuscateDirectoryFiles(){
            const javascriptFiles = await recursiveRD.list(Lycan.toObfuscate, { recursive: true, extensions: true, realPath: true, normalizePath: true }, function(obj, index, total){
                if(obj.extension !== ".js"){
                    return true
                }
            })

            var fileIndex = 0

            async function obfuscateFiles(){
                if(fileIndex === javascriptFiles.length){
                    log("i", "Directory Javascript files successfully obfuscated.")
                    return Lycan.navigation()
                }

                log("i", `Obfuscating => ${javascriptFiles[fileIndex].fullname}`)
                await obfuscateFile(javascriptFiles[fileIndex].fullname)
                log("i", `Successfully obfuscated => ${javascriptFiles[fileIndex].fullname}`)

                fileIndex++
                obfuscateFiles()
            }

            obfuscateFiles()
        }

        const toObfuscateStat = Fs.statSync(Lycan.toObfuscate)

        if(toObfuscateStat.isFile()){
            log("i", "Obfuscating the file, please wait.")
            await obfuscateFile(Lycan.toObfuscate)

            log("i", "File successfully obfuscated.")
            return Lycan.navigation()
        }else{
            log("i", "Obfuscating the directory Javascript files.")
            return obfuscateDirectoryFiles()
        }
    }else if(commandArgs[0] === "set"){
        if(!commandArgs[1]){
            log("i", "Usage: set <target>")
            return Lycan.navigation()
        }

        if(!Fs.existsSync(commandArgs[1])){
            log("e", "The target argument path does not exists.")
            return Lycan.navigation()
        }

        Lycan.toObfuscate = commandArgs[1]

        log("i", "Target successfully set.")
    }else if(command === "config"){
        log("i", `toObfuscate => ${Lycan.toObfuscate}`)
    }else if(command === "obfuscators"){
        console.log()
        console.log(Columnify(Lycan.obfuscators, {
            columns: ["id", "name", "flow", "encryptionLevel", "author"],
            columnSplitter: " | ",
            config: {
                id: {
                    headingTransform: function(){
                        return "ID"
                    }
                },
                name: {
                    headingTransform: function(){
                        return "Name"
                    }
                },
                flow: {
                    headingTransform: function(){
                        return "Flow"
                    }
                },
                encryptionLevel: {
                    headingTransform: function(){
                        return "Encryption Level"
                    }
                },
                author: {
                    dataTransform: function(author){
                        return author.replace(",", ", ")
                    },
                    headingTransform: function(){
                        return "Author"
                    }
                }
            }
        }, ))
        console.log()
    }else if(command === "exit"){
        process.exit()
    }else{
        log("e", "Command is unrecognized.")
    }

    Lycan.navigation()
}

// Main
log("i", "Loading the plugins, please wait.")
const plugins = Fs.readdirSync("./plugins").map((file)=> `./plugins/${file}`)

for( const plugin in plugins ){
    var { self } = require(plugins[plugin])
    self = new self().info()
    self.path = plugins[plugin]
    self.id = plugin

    Lycan.obfuscators.push(self)
}
console.clear()

console.log(Chalk.redBright(`
               .-'''''-.
             .'         '.
            :             :
           :               :
           :      _/|      :
            :   =/_/      :     Lycan - Powerful Javascript obfuscator framework.
            '._/ |     .'       ${Lycan.obfuscators.length} obfuscators loaded.
          (   /  ,|...-'
           \\_/^\\/||__
        _/~  '""~'"' \\_
     __/  -'/  '-._ '\\_\\__
   /jgs  /-''  '\\   \\  \\-.\\
`))

Lycan.navigation()