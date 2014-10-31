Mobile application for Online store
=============================

This repository is the sample mobile application for EPiServer Commerce, to demonstrate the Service API.

Installation
------------

Clone the repository to C:\Projects\EPiMobileStore for example.

1.  Download and install [Node.js](http://nodejs.org/).
2.  Download and install [Git client](http://git-scm.com/) if you don't have one.
3.	Download and install [Android SDK](https://developer.android.com/sdk/index.html?hl=i).
4.  Install [Cordova](http://cordova.apache.org) by running this command:
	> npm install -g cordova
5.  In Windows's Command Prompt, navigate to the repository:
	> cd C:\Projects\EPiMobileStore
6.  Execute this command to build App for all selected platform:
	> cordova build
7.  Output bundle file will be deployed to the specific platform folder. For example, for android: platforms\android\ant-build\EPiTechDay-debug-unaligned.apk
8.	Execute this command to start the Android emulator, as well as deploy the application to the emulator, so we can test the app:
	> cordova emulate