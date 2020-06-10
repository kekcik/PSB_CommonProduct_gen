var ncp = require('ncp').ncp;
var replace = require('replace-in-file');
var readline = require('readline');
var mkdirp = require('mkdirp');
var fs = require('fs');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var moduleName = "SomeModuleName"
var userName = "Some_User_Name"

var getHeader = function() {
    return `\
//
//  ${moduleName}InteractorInput.swift
//  mobileRetail
//
//  Created by ${userName} on ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}.
//  Copyright © ${new Date().getFullYear()} psb. All rights reserved.
//

import Foundation`
}

rl.question("Имя разработчика (например, Vasya Vasechkin): ", function(answer) {
    userName = answer
    rl.question("Название модуля (например, SuperCard): ", function(answer) {
        moduleName = answer
        rl.close();
        mkdirp(`Result/`);
        ncp("Template/", `Result/${moduleName}/`, () => { runReplace(); })
    });
});

var runReplace = function() {
    const options = {
        files: [`Result/${moduleName}/**`],
        from: [/{{ header }}/g, /{{ ModuleName }}/g], 
        to: [getHeader(), moduleName]
    };

    replace(options)
    .then(changedFiles => {    
        let files = changedFiles.filter(el => el.hasChanged).map(el => el.file)
        runRename(files);
    })
    .catch(error => {
        console.log("Не удалось создать папку, возможно, такой модуль уже есть");
    });
}

var runRename = function(filePaths) {
    filePaths.forEach(path => {
        let parts = path.split("/");
        let newFileName = parts[parts.length - 1].replace(".raw", "");
        let newFilePath = parts.slice(0, -1).join("/") + "/" + moduleName + newFileName.charAt(0).toUpperCase() + newFileName.slice(1);
        fs.rename(path, newFilePath, function(err) {
            if ( err ) console.log('ERROR: ' + err);
        });
    })
    console.log(`Модуль ${moduleName} создан. Скопируй его из CPResult/${moduleName} в проект и добавь в два таргета`);
}