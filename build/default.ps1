properties {
	$version = "0.0.0.0"
	$base_dir  = resolve-path ..
	$templates_dir  = resolve-path .\templates
	$project_dir = "$base_dir\src"
	$tools_dir = "$base_dir\vendor"
	$build_dir = "$base_dir\dist"
	$build_tmp_dir = "$build_dir\temp"
	$build_staged_dir = "$build_dir\staged"
	$build_output_dir = "$build_dir\output"
	$release_dir = "$build_dir\release"
	$publish_path = "$release_dir\pub"
	$webserver_port = 34535
	$host_name = [System.Net.Dns]::GetHostEntry("").HostName
	$debug = "false"
	$path = "."
	$stoponerror = $true
}

task default -depends Debug 

task DisplayVersion -Description 'Displays the application version' { 
  Write-Host "version is " $version
}

task Run -depends DisplayVersion, Build -Description 'Starts a browser with the built version of the app' {
    pushd $base_dir/build
        exec {  .\run-server.ps1 }
    popd
    
	exec { start ../tools/node "../build/server.js $build_staged_dir $webserver_port" }
	
	$url = "http://" + $host_name + ":" + $webserver_port + "/index.html"
	Write-Host "Application is running at "
	Write-Host $url -foregroundcolor Blue
}

task Debug -depends DisplayVersion, GetVendorFiles, Less2Css, InitLocalSettings -Description 'Starts a browser with the unbuilt version of the app' {
    pushd $base_dir/build
        exec { .\run-server.ps1 }
    popd
    
	exec { start ../tools/node "../build/server.js $project_dir $webserver_port" }

	$url = "http://" + $host_name + ":" + $webserver_port + "/index.html"
	Write-Host  "Application is running at "
	Write-Host $url -foregroundcolor Blue
}

task Build -depends DisplayVersion, GetVendorFiles, ResetBuildFolder, InitLocalSettings, JsLint, Less2Css, InitBuildFolders, OptimizeJs, Test -Description 'Minifies and combines javascript and css' {
}


task Package -depends BuildAndTest -Description 'Consolidates releasable artifacts into common package folder' {
	Write-Host 'Version: Rename output file names with version number & update references'
	# TODO:

	Write-Host 'Source: ' $build_staged_dir
	Write-Host 'Package: ' $build_output_dir
	
	Copy-Item $build_staged_dir/* $build_output_dir -Recurse -Force
}

#zips up a package and names it accordingly.
task Archive -depends Package -desc 'Generates zip packages to the $release_dir with timestamped name formatting.'{
    pushd $base_dir
       exec { .\tools/7zip/7za.exe a $build_dir/Iwt_build.zip $build_output_dir/* }
    popd
	
	if(!(test-path $release_dir)){
		new-item $release_dir -type directory -f;    
	}
    
	pushd $build_dir
		$formattedDate = get-date -Format yyyyMMdd_HHmmss
		$buildName = "Iwt" + "_" + $formattedDate
		Move-Item .\Iwt_build.zip "$release_dir\$buildName.zip"
		
		#specially named copy of the build to help Mello's automation tools.
		$latestBuildName = "Iwt" + "_Latest" 
		Copy-Item "$release_dir\$buildName.zip" "$release_dir\$latestBuildName.zip" -Force
	popd
}

#copies a package to the specified staging folder
task Publish -depends Package{
	reset-folder $publish_path
	Copy-Item "$build_output_dir/*" $publish_path -recurse -Force
}

task TestPerf -depends DisplayVersion, GetVendorFiles, Build -Description 'Runs the various performance tests in test/performance folder' {
    echo 'Performance Tests Found'
    
    ls $build_staged_dir/apps/**/test/performance |
        foreach($_) {
            & "$($_.fullname)\runTests.ps1" $_
            get-content "$($_.fullname)\PerformanceResult.txt"
    }
}

task Test -depends DisplayVersion, GetVendorFiles -Description 'Runs the tests in the test/spec folder' {
	exec { ../tools/node51.exe ../tools/jessie/jessie.js ../tools/jessie/spec/ -f nested }
}

task TestStaged -depends DisplayVersion -Description 'Runs the tests in the build/staged folder' {
    Write-Host 'Executing Jessie Tests in ' + $build_staged_dir
    Get-ChildItem $build_staged_dir -include spec -recurse |
        foreach($_) {
            exec { ../tools/node ../tools/jessie/jessie.js $_.FullName + '/' -f nested }}
}

task BuildAndTest -depends Build, Test{
}

task GetVendorFiles -Description 'Downloads all the dependencies for building and testing' {
	Import-Module ./Get-WebFile.ps1
	# Create directory if does not exist
	if ((Test-Path ..\tools\ -pathType container) -ne $True)
	{
		New-Item ..\tools\ -type directory
		cd ..\tools
		Get-WebFile http://requirejs.org/docs/release/0.27.0/r.js ..\tools\
		Get-WebFile http://nodejs.org/dist/v0.5.8/node.exe ..\tools\
		cd ..\build
	}
}

task JsLint -Description 'Run JSLint over all .js files except for the /lib/ folder' {

    $jsLintError = $false

    pushd $base_dir
        Write-Host 'jsLint: Checking Code Correctness'
		Get-ChildItem $project_dir -include *.js -recurse |
		    where {($_ -notmatch 'lib') -and (!$_.PSIsContainer)} |
		        foreach($_) {
		            .\tools/node51.exe .\tools/jslint/jslintnode.js $_.FullName .\tools/jslint/jslintconfig.json
		            $jsLintError = $jsLintError -or ($LastExitCode -ne 0)
		            }
    popd

    if ($jsLintError -eq $true) {
        Write-Host 'jsLint errors discovered!'
        
        if($stoponerror -eq $true) {
            throw "jsLint encountered 1 or more errors"
        }
    } else {
        Write-Host 'No jsLint errors discovered!'
    }
}

task OptimizeJs -Description 'Optimize all files within the /src folder' {
    pushd $base_dir
		Write-Host 'Optimize:  Combining and Uglifying scripts'
		exec {  .\tools/node51 --debug .\tools/r.js -o .\build/app.build.js }
    popd
}

task Less2Css -Description 'Convert all .less files to .css if they are located within a /less/ folders' {
    Get-ChildItem $project_dir -include "*.less" -recurse |
		Where-Object {$_.FullName -like "*\less\*" } |
			foreach($_) {
			    exec { ../tools/node ../tools/less/lessc.js $_.FullName $_.FullName.Replace(".less", ".css")}}
}

task WatchLess -Description 'Add a File-System Watcher to all .less files and call Less2Css when changes occur' {

    $action = {
        $now =[datetime]::now
        Write-Host "$now $($eventArgs.ChangeType) file $($eventArgs.Name) "
        Invoke-psake .\build/default.ps1 Less2Css
    }

    watch "$project_dir" "*.less" $action
}

task StopWatchLess -Description 'Stop the File-System Watcher for .less files' {
    if($watcher) { $watcher.EnableRaisingEvents = false; }
}

task RunSpecs -depends Build -Description 'Run all jasmine specs within the /src folder' {
	pushd $base_dir

	# 3.
		Write-Host 'Jessie: Testing all specs in ' + $build_staged_dir
		Get-ChildItem $build_staged_dir -include spec -recurse |
		    foreach($_) {
		        exec { ./tools/node ./tools/jessie/jessie.js $_.FullName + '/' -f nested } }

	popd
}

task InitLocalSettings -Description 'Copy a blank settings.local.js into the project if it doesnt exist.' {
    try-copytemplate "settings.local.js" "$project_dir/settings.local.js"
}

task ResetBuildFolder {
	if ((Test-Path $build_dir -pathType container) -ne $True) {
		New-Item $build_dir -type directory
	}

    reset-folder $build_tmp_dir
	reset-folder $build_staged_dir
    reset-folder $build_output_dir
}

task InitBuildFolders -Description 'Initializes or Reinitializes build folers' {
	# Init:
    Write-Host 'Prep Build Folders'

	if ((Test-Path $build_tmp_dir -pathType container) -ne $True) {
		New-Item $build_tmp_dir -type directory
	}
	if ((Test-Path $build_staged_dir -pathType container) -ne $True) {
		New-Item $build_staged_dir -type directory
	}
	if ((Test-Path $build_output_dir -pathType container) -ne $True) {
		New-Item $build_output_dir -type directory
	}

	Copy-Item $project_dir\* -destination $build_tmp_dir -recurse
}

task ? -Description 'Helper to display task info' {
	Write-Documentation
}
task help -depends ? -Description 'alias to the ? task' { }


###################################################################################
## Helper Functions
###################################################################################

task ErrorTest {
    pushd $base_dir
        exec { .\tools/node -e "process.exit(1);" }
        Assert ($LastExitCode -eq 1) "LastExitCode should be 1, but is $LastExitCode"
        echo ( "This line should not be run")
    popd
}


function watch($path, $filter, $action)
{
    if($watcher -ne $NULL) { $watcher.EnableRaisingEvents = false; }

    if($action -eq $NULL) {
        $action = {
            $now =[datetime]::now
            Write-Host "$now $($eventArgs.ChangeType) file $($eventArgs.Name) "
        }
    }

    $w = New-Object System.IO.FileSystemWatcher
    Set-Variable -Name watcher -Value $w -Scope "global"
    $w.Path = "$path\"
    $w.Filter = "$filter"
    $w.IncludeSubdirectories = $true
    $w.EnableRaisingEvents = $true
    $w.NotifyFilter =
        [System.IO.NotifyFilters]::LastAccess -bor
        [System.IO.NotifyFilters]::LastWrite -bor
        [System.IO.NotifyFilters]::FileName

    Register-ObjectEvent $w "Changed" -Action  $action
    Register-ObjectEvent $w "Created" -Action $action
    Register-ObjectEvent $w "Deleted" -Action  $action
    Register-ObjectEvent $w "Renamed" -Action  $action
}



function try-copytemplate($templatename, $targetfile) {
    $templatePath = "$templates_dir/$templatename"
    if((Test-Path $targetfile) -eq $FALSE) {
        Write-Host "copying template from $templatePath to $targetfile"
        Copy-Item $templatePath $targetfile
    }
    else {
        Write-Host "File exists: $targetfile "
    }
}

function reset-folder($path){
	Write-Host  $path
	Write-Host  $build_dir

	if(!$path.Contains($build_dir)){
		throw "reset-folder will only work for children of the build folder. (just to make sure this script doesn't accidently start deleting the entire drive ;-))"
	}
	
	if(test-path $path){
		Remove-Item $path -Force -Recurse
	}
	
	New-Item $path -type directory
}