// inspired from karma chrome launcher
// https://github.com/karma-runner/karma-chrome-launcher/blob/5f70a76de87ecbb57f3f3cb556aa6a2a1a4f643f/index.js
var fs = require('fs');
var path = require('path');
var which = require('which');

function getChromeExe(chromeDirName) {
  // Only run these checks on win32
  if (process.platform !== "win32") {
    return null;
  }
  var windowsChromeDirectory, i, prefix;
  var suffix = "\\Google\\" + chromeDirName + "\\Application\\chrome.exe";
  var prefixes = [
    process.env.LOCALAPPDATA,
    process.env.PROGRAMFILES,
    process.env["PROGRAMFILES(X86)"],
  ];

  for (i = 0; i < prefixes.length; i++) {
    prefix = prefixes[i];
    try {
      windowsChromeDirectory = path.join(prefix, suffix);
      fs.accessSync(windowsChromeDirectory);
      return windowsChromeDirectory;
    } catch (e) {}
  }

  return windowsChromeDirectory;
}

function getBin(commands) {
  // Don't run these checks on win32
  if (process.platform !== "linux") {
    return null;
  }
  for (let i = 0; i < commands.length; i++) {
    if (which.sync(commands[i])) {
      return which.sync(commands[i], {nothrow: true})
    }
  }
}

function getChromeDarwin(defaultPath) {
  if (process.platform !== "darwin") {
    return null;
  }

  try {
    var homePath = path.join(process.env.HOME, defaultPath);
    fs.accessSync(homePath);
    return homePath;
  } catch (e) {
    return defaultPath;
  }
}

var paths = {
  linux: getBin(["google-chrome", "google-chrome-stable"]),
  darwin: getChromeDarwin(
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  ),
  win32: getChromeExe("Chrome"),
};

function getGoogleChromePath() { 
  return paths.linux || paths.darwin || paths.win32;
}

module.exports.getGoogleChromePath = getGoogleChromePath;
