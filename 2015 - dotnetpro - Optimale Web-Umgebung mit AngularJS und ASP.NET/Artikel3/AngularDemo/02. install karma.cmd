@ECHO OFF

%~d0
CD "%~dp0"

SET PATH=%PATH%;%systemdrive%\chocolatey\bin
SET PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin
SET PATH=%PATH%;%programfiles%\nodejs

CALL npm install --save-dev

pause