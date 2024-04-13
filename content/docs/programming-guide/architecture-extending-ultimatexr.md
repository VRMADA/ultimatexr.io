---
title: "Extending UltimateXR"
---

# Extending UltimateXR

UltimateXR was developed with extensibility as a core principle right from the start. By open-sourcing the framework, we invite developers from all backgrounds to contribute to the project.

Below, you will find some initial ideas for implementing new features. These sections provide a broad overview of how to add new functionalities. Soon, we will provide complete guides detailing every step needed.

## New Device Support

Our aim is for UltimateXR to support all relevant headsets and controllers. Adding support for new devices means more users can use applications made with UltimateXR.

To implement new support we suggest first having a look at how other devices have been integrated. Then proceed with this high-level steps required to add support for a new device:

1. **Create a new SDK locator if necessary**: Inherit from UxrSdkLocator in case the device uses a new SDK or package that isn't supported by UltimateXR. SDK Locators can work with both regular SDK installations in /Assets or packages from the Unity Package Manger. They are located under /Editor/Sdks/InputTracking.
2. **Reference SDK Assembly if necessary**: When SDKs use their own assembly it needs to be referenced in the UltimateXR assembly file. When the SDK is a package it also requires to add a new Version Define entry for #if/#endif directives that will be used later in step 5.
3. **Derive Input Component**: Derive a new input component from `UxrControllerInput` under /Scripts/Devices/Integrations following the same folder structure. Check if a more specialized parent component class can be used:
  - `UxrSteamVRControllerInput` if it's a device using SteamVR. Check the `UxrHtcViveInput` component as a reference.
  - `UxrUnityXRControllerInput` if it uses the Unity XR framework for input. Check the `UxrMetaTouchQuest2Input` component as a reference.
4. **Derive Tracking Component**: Similarly, derive a new tracking component from `UxrControllerTracking` under /Scripts/Devices/Integrations following the same folder structure. Check if a more specialized parent component class can be used:
  - `UxrSteamVRControllerTracking` if it's device using SteamVR. Check the `UxrHtcViveTracking` component as a reference.
  - `UxrUnityXRControllerTracking` if it uses the Unity XR framework for tracking. Check the `UxrMetaTouchQuest2Tracking` component as a reference.
5. **Conditional Compilation**: Use #if/#endif directives to compile SDK-specific code only when the SDK is installed. The symbol that needs to be used is defined in the SDK locator class in case the SDK is within /Assets or in step 2 if the SDK is distributed through a package using the Unity Package Manger.
6. **Create Controller Prefabs**: Create left/right controller prefabs in the appropriate folder under /Prefabs/Devices. Add the `UxrController3DModel` component on the root and make sure to assign a child Forward transform that will determine the direction that points forward starting from the tip of the controller.
7. **Integrate in HandsIntegration**_: Add the controller components (input and tracking) and the controller prefabs to the BigHandsIntegration and SmallHandsIntegration prefabs located at /Prefabs/HandIntegrations. These prefabs are included in all avatars by UltimateXR to provide device support, updating them will automatically add support to all avatars. Follow these steps in the HandsIntegration prefabs:
  - Create SensorLeft and SensorRight empty GameObjects under the /LeftHand/SensorsLeft and /RightHand/SensorRight objects. These GameObjects will represent where each controller will be placed in the hand, and are used to know where the avatar hands should be positioned using the tracked controller position as a reference.
  - Add the input and tracking components under the /Components tree. Add the sensor references to the tracking component and the `UxrController3DModel` references from step 6 to the input component.
  
By now the new devices should be working. To help with the integration testing, the built-in prefabs can be used together with the DebugInputPanel prefab located at /Prefabs/UI/DebugInput.
  
## New Locomotion

## New UxrGrabPointShape

## New Multiplayer SDK

## New UxrAvatarController
