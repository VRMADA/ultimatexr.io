---
title: "Meta Quest"
---

# Meta Quest

## Installing and setting up Meta Quest support

Open the UltimateXR SDK Manager using the menu Tools -> UltimateXR -> SDKs -> SDK Manager. 

Click Get SDK under the Meta section. This will open the link to add the Meta XR Core SDK to your assets:

![](/content/docs/guides/media/supported-platforms/Meta01AssetStore.png)
 
Now go back to Unity and open the Package Manager using the menu Window -> Package Manager.

Select “My Assets” from the top drop-down window:

![](/content/docs/guides/media/supported-platforms/Oculus02MyAssets.png)
 
Now navigate to the Meta XR Core SDK asset and select Install. After installing, import the Meta XR Core SDK package.

![](/content/docs/guides/media/supported-platforms/Meta03PackageManager.png)
 
Now go to Edit -> Project Settings and enable Oculus support in the desktop platform. Also check Oculus support in the Android tab if you plan to create builds for Quest:

![](/content/docs/guides/media/supported-platforms/Oculus04Management1.png)
 
## Creating a build for Meta Quest

Switch your platform to Android using File -> Build Settings.

![](/content/docs/guides/media/supported-platforms/Oculus05Android.png)
 
Create a compatible Manifest file using the Oculus menu on top.

![](/content/docs/guides/media/supported-platforms/Meta06Manifest.png)

Now create the .apk file for Android using File -> Build Settings -> Build

Note: Build and run may give shader errors on some configurations. If this is the case, use Build instead and use adb -install file.apk to install it on your device.

For detailed help regarding building and running Oculus apps using Unity please check https://developer.oculus.com/documentation/unity/unity-build/
