@echo off
for /F "tokens=1,2 delims==" %%i in (food_dev_variables.txt) do @set %%i=%%j
if not "%1"=="setup" goto usage
:setup
@echo on
node server/setup.js -y
:usage
@echo on
node server/index.js
