@ECHO OFF

%~d0
CD "%~dp0"

@echo Downloading and installing latest Chocolatey
@powershell -NoProfile -ExecutionPolicy unrestricted -Command "iex ((new-object net.webclient).DownloadString('https://chocolatey.org/install.ps1'))"

SET PATH=%PATH%;%systemdrive%\chocolatey\bin
SET PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin

@echo Downloading and installing Node.js
CALL cinst nodejs.install -version 0.10.35

@echo Avoiding NodeJS for Windows installer bug
mkdir %AppData%\npm

pause