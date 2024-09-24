---
title: "WaveXR"
---

# WaveXR

## Installing and setting up WaveXR support

Switch to Android using File -> Buid Settings.

![](/docs/guides/media/supported-platforms/wavexr/WaveXR01Android.png)

Open the UltimateXR SDK Manager using the menu Tools -> UltimateXR -> SDKs -> SDK Manager. Click Get SDK under the Wave XR section. This will open the link to install WaveXR support.

![](/docs/guides/media/supported-platforms/wavexr/WaveXR02SDKManager.png)

The required step is adding a new scoped registry to get access to Vive packages. Go to Edit -> Project Settings and add the following scoped registry:

![](/docs/guides/media/supported-platforms/wavexr/WaveXR03ScopedRegistry.png)
 
If the information was added correctly, you should now be able to open the Package Manager using Window -> Package Manager. Select My Registries and under the HTC Corporation install the following packages:

- Vive Wave XR Plugin
- Vive Wave XR Plugin – Essence

Open Edit -> Project Settings and enable the Wave XR plugin in both Android and Desktop.

![](/docs/guides/media/supported-platforms/wavexr/WaveXR04Enable.png)

You should now be able to create Android builds targeting the WaveXR platform.

For more information on WaveXR development in Unity check https://developer.vive.com/resources/vive-wave/tutorials/
