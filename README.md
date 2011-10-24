# BrowserApp #
This is a boilerplate project for starting a new browser-based application using a variety of tools including:

  * RequireJs / r.js
  * KnockoutJs
  * Socket.io
  * Jasmine
  * NodeJs
  * LessJs
  * JSLint
  * etc.
  
This repo uses Powershell and PSake as the build tool.


## Running the Project ##
To immediately run the project use the run command from the root of the site:

    > Run.cmd
    Note: This batch file launches a web server and browser.

Alternatively, if you want to run the packaged & optimized version, you can execute the *Psake* powershell
 script located in the */scripts* folder:

    > .\psake run


**TIP:** for these powershell examples, if you DO NOT have Psake setup in your powershell profile, you can
 replace the ".\\psake <task name>" syntax with this command syntax:

    > scripts\psake.cmd default.ps1 <task name>


## Building the Code ##
To build the code, you execute the *Psake* powershell script located in the */scripts* folder:

    > .\psake build

This will create a */dist* folder and copy all files from the */client* folder into the */dist/temp*
 folder.  Afterwards, it run all unit tests, transform all templates, and run code optimizers and stages
 the results to the */dist/staged* folder.

To generate a deployable *Package* you use the following *Psake* powershell command:

    > .\psake package

This command cleans and copies just the releasable bits to the */dist/output* folder.

To generate a compressed *Archive* file for the package, you use the following *Psake* powershell
 command:

    > .\psake archive

## Publishing the Code ##
To publish the release package, you use the following *Psake* powershell command:

    > .\psake push [targetpath]

This does a build and package then copies the results to the target path.  The *targetpath* parameter
 is used to pass the fully qualified path where you want the package copied.

## Developer Tips ##
If you are coding in this project, here are a few more commands that may be useful for you:

### JSLint ###
To check all js files within the /src/client folder for correctness, use the following command

    > .\psake JSLint

To run JSLint manually for 1 file, use the following command (for node.js):

    > .\vendor/node51.exe .\vendor/jslint/jslintnode.js {FilePath}
    note: {FilePath} is the fully qualified path to the tested file

### Less2Css ###
We use the LessCss tool to enable advanced CSS programming logic.  See http://lesscss.org/ for details.

We use this tool by composing our .less files and then transoforming them into .css files.   If you place your
.less files within a folder named //less// then you can use the following Psake commands to automate
compilation of these files.

Compile all .Less files into .Css:

    > .\psake Less2Css

Automatically watch for changes in .Less files and auto-compile them:

    > .\psake WatchLess

Stop watching changes in .Less files:

    > .\psake StopWatchLess

Note: This command assumes you did not close your command window after calling WatchLess.  Invoking StopWatchLess
 will not work if you change command windows or close the initial command window used with the WatchLess task.
