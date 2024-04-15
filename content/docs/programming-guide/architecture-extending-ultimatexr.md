---
title: "Extending UltimateXR"
---

# Extending UltimateXR

UltimateXR was developed with extensibility as a core principle. By open-sourcing the framework, we invite developers from all backgrounds to contribute to the project.

Below, you will find some initial ideas for implementing new features. As a start, these sections provide a broad overview of how to add new functionalities. Soon we will provide complete guides detailing every step needed.

## New Device Support

Our aim is for UltimateXR to support all relevant headsets and controllers. Adding support for new devices means more users can use applications made with UltimateXR.

We suggest having a look at how other devices have been integrated. Then follow these high-level steps to add support for a new device:

1. **Create a new SDK locator if necessary**: Inherit from `UxrSdkLocator` in case the device uses a new SDK or package that isn't supported by UltimateXR. SDK Locators can work with both regular SDK installations in /Assets or packages from the Unity Package Manger. They are placed in /Editor/Sdks/InputTracking.
2. **Reference SDK Assembly if necessary**: When SDKs use their own assembly it needs to be referenced in the UltimateXR assembly file. When the SDK is a package it also requires to add a new Version Define entry for #if/#endif directives that will be used later in step 5.
3. **Derive Input Component**: Derive a new input component from `UxrControllerInput` under /Scripts/Devices/Integrations following the same folder structure. Check if a more specialized parent component class can be used:
    - `UxrSteamVRControllerInput` if it's a device using SteamVR. Check the `UxrHtcViveInput` component as a reference.
    - `UxrUnityXRControllerInput` if it uses the Unity XR framework for input. Check the `UxrMetaTouchQuest2Input` component as a reference.
	Take special care implementing the controller names. UltimateXR will use them to know which controllers are connected and whether the input component should be enabled.
4. **Derive Tracking Component**: Similarly, derive a new tracking component from `UxrControllerTracking` under /Scripts/Devices/Integrations following the same folder structure. Check if a more specialized parent component class can be used:
    - `UxrSteamVRControllerTracking` if it's device using SteamVR. Check the `UxrHtcViveTracking` component as a reference.
    - `UxrUnityXRControllerTracking` if it uses the Unity XR framework for tracking. Check the `UxrMetaTouchQuest2Tracking` component as a reference.
5. **Conditional Compilation**: Use `#if`/`#endif` directives to compile SDK-specific code only when the SDK is installed. The symbol that needs to be used is defined in the SDK locator class in case the SDK is within /Assets or in step 2 if the SDK is distributed through a package using the Unity Package Manger.
6. **Create Controller Prefabs**: Create left/right controller prefabs in the appropriate folder under /Prefabs/Devices. Add the `UxrController3DModel` component on the root and make sure to assign a child Forward transform that will determine the direction that points forward starting from the tip of the controller.
7. **Update HandsIntegration**: Add the controller components (input and tracking) and the controller prefabs to the BigHandsIntegration and SmallHandsIntegration prefabs found in /Prefabs/HandIntegrations. These prefabs are included in all avatars by UltimateXR to provide device support, updating them will automatically add support to all avatars. Follow these steps in the HandsIntegration prefabs:
    - Create SensorLeft and SensorRight empty GameObjects under the /LeftHand/SensorsLeft and /RightHand/SensorRight objects. These GameObjects will represent where each controller will be placed in the hand, and are used to know where the avatar hands should be positioned using the tracked controller position as a reference.
    - Add the input and tracking components under the /Components tree. Add the sensor references to the tracking component and the `UxrController3DModel` references from step 6 to the input component.
	
By now the new devices should be working. To help with the integration testing, the built-in prefabs can be used together with the DebugInputPanel prefab located at /Prefabs/UI/DebugInput.
  
## New Locomotion

Another option is to expand UltimateXR with new custom locomotion systems.

Locomotion is implemented in UltimateXR by creating a new component deriving from `UxrLocomotion`, and adding it to the avatar anywhere in the hierarchy.
Default locomotion components are already pre-instantiated on all avatars within the HandsIntegration prefab.

Unlike controller input components, which operate individually, locomotion components can work simultaneously. Enabled locomotion components within the avatar will be processed and updated. This flexibility allows locomotion components to:
- Serve as a standalone component, providing a complete locomotion system. In this scenario, all other components should be either removed or disabled.
- Act as a supplemental component, enhancing the functionality of existing components, such as enabling climbing capabilities.

Be sure to use `UxrManager` methods for avatar movement to ensure that position and rotation changes are registered by the system.
When implementing new locomotion components and features, it's recommended to review the existing locomotion components located at /Scripts/Locomotion for reference.

## New UxrGrabPointShape

Grab points within grabbable objects are designated locations from which objects can be grasped.
Grab point shapes enable a single grab point to be expanded into a shape that conforms to the contours of the object, providing more flexibility to the grabbing process.

Grab point shapes are implemented deriving from `UxrGrabPointShape` and overriding the following methods:

```c#
public abstract float GetDistanceFromGrabber(UxrGrabber grabber, Transform snapTransform, Transform objectDistanceTransform, Transform grabberDistanceTransform);
public abstract void GetClosestSnap(UxrGrabber grabber, Transform snapTransform, Transform distanceTransform, Transform grabberDistanceTransform, out Vector3 position, out Quaternion rotation);
```

`GetDistanceFromGrabber()` returns the distance from a grabber to the shape:
  - `grabber` is the `UxrGrabber` component to compute the distance from.
  - `snapTransform` is the original grab point `Transform` on the grabbable object to snap the grabber to.
  - `objectDistanceTransform` is the `Transform` on the grabbable object that is used to compute the distance from the grabber to the grab point.
  - `grabberDistanceTransform` is the `Transform` on the grabber that is used to compute the distance to the `UxrGrabbableObject`. It normally is the grabber itself, placed on the palm, but additional points can be defined to specify distances from other parts in the hand such as the finger tips.
  
  `GetClosestSnap()` returns the most suitable snap position and rotation for a given grabber:
  - `grabber`, `snapTransform`, `distanceTransform` and `grabberDistanceTransform` are the same parameters as `GetDistanceFromGrabber()`.
  - `position` (`out`) will return the snap position.
  - `rotation` (`out`) will return the snap rotation.
  
When implementing a new grab point shape, it's recommended to review the existing components located at /Scripts/Manipulation for reference.

## New Multiplayer SDK

UltimateXR has an extensible multiplayer design, with the goal to make it easy to add new SDKs and platforms.
Multiplayer has two distinct phases where new platforms are required to provide support.
- Edit time: Developers implement a derived class from `UxrNetworkImplementation`. This class handles the creation of platform-specific components and provides additional functionality for runtime operations.
- Runtime: Developers create a new network avatar component that implements the `IUxrNetworkAvatar` interface. This component primarily handles RPC synchronization support during runtime.

### Edit Time

Through the `UxrNetworkManager` inspector, the framework automates the creation and setup of platform-specific components. Users will not be required to manually add components such as NetworkObject, NetworkTransform, NetworkRigidbody or similar.

Switching between platforms is seamless, `UxrNetworkManager` will keep track of the components that need to be created and destroyed. It identifies which components, instances or prefabs need setup.

Behind the scenes, the network manager relies on different implementations of `UxrNetworkImplementation`, such as `UxrUnityNetCodeNetwork`, `UxrFishNetNetwork` or `UxrPhotonFusionNetwork`. These implementations provide simple methods that add platform-specific components to an object.

### Runtime

At runtime, the avatar component that implements `IUxrNetworkAvatar` is responsible for providing the connection support and RPC synchronization messages.

### Voice Over Network

Voice over network implementations only require to implement a new `UxrNetworkVoiceImplementation` class.

We recommend reviewing the existing multiplayer implementations which can be found in the /Scripts/Networking/Integrations.

## New UxrAvatarController
