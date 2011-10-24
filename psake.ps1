#just an alias for invoking psake.
#type :
#	./psake - the default task is "debug" which launches the web browser and loads the app.
#	./psake build - minifies the css and javascript and combines the files.
#	./psake test - runs tests against the raw code.
#	./psake run - tests, builds, and opens the browser to the production release version.
#	./psake debug - opens the browser to the pre-build version.
#	./psake GetVendorFiles - downloads the vendor libraries necessary to build and run the app.
param(
  [Parameter(Position=0,Mandatory=0)]
  [string[]]$taskList = @(),
  [Parameter(Position=1,Mandatory=0)]
  [string]$framework = '3.5',
  [Parameter(Position=2,Mandatory=0)]
  [switch]$docs = $false,
  [Parameter(Position=3,Mandatory=0)]
  [System.Collections.Hashtable]$parameters = @{},
  [Parameter(Position=4, Mandatory=0)]
  [System.Collections.Hashtable]$properties = @{}
)

Import-Module .\build/psake.psm1

try {
    $buildFile = ".\build/default.ps1"
    Invoke-Psake $buildFile $taskList $framework $docs $parameters $properties

    exit $LastExitCode;
}
finally {
  remove-module psake -ea 'SilentlyContinue'
}