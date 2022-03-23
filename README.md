# Lycan
Powerful Javascript obfuscator framework.

## Installation
```console
# clone the repository
$ git clone https://github.com/RealHatena/lycan

# change the working directory to lycan
$ cd lycan

# install the required packages
$ npm i javascript-obfuscator recursive-readdir-async readline-sync js-confuser columnify base-64 chalk fs
```

## Usage
```console
$ node index.js
```

## Walkthrough
Shows Lycan help menu and the list of the current obfuscators It has Including obfuscating the file **obfuscateMe.js** using the Simple obfuscator plugin(ID: 3).
```console
$ node index.js
lycan> help

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

lycan> obfuscators

ID | Name      | Flow                               | Encryption Level | Author
0  | Base64Obf | javascript-obfuscator + base64     | high             | All0cation
1  | Buff      | jsconfuser + jsconfuser            | high             | All0cation
2  | Confuse   | jsconfuser + javascript-obfuscator | medium           | All0cation
3  | Simple    | javascript-obfuscator              | medium           | All0cation

lycan> set obfuscateMe.js
[*] Target successfully set.
lycan > obfuscate 3
[*] Obfuscating the file, please wait.
[*] File successfully obfuscated.
lycan > exit
```

## License
MIT © Hatena