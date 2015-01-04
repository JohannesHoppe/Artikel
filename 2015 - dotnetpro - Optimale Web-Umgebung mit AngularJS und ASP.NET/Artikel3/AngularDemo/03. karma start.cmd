@ECHO OFF

%~d0
CD "%~dp0"

SET PATH=%PATH%;%~dp0node_modules\.bin
SET PATH=%PATH%;%systemdrive%\chocolatey\bin
SET PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin
SET PATH=%PATH%;%programfiles%\nodejs

karma start