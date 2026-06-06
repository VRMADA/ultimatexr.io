---
title: "UxrManager"
---

# UxrManager

`UxrManager` is the main manager in the UltimateXR framework. As a `UxrSingleton`, it can be accessed from any point in the application using `UxrManager.Instance`. As with other singletons, it can be pre-instantiated in the scene in order to change default parameters through the inspector, but it's mostly never pre-instantiated. If no manager is in the scene when accessing `Instance`, it will create one.

## Overview

`UxrManager` is mainly responsible for performing the update loop ensuring that all components are updated in the correct order. It also provides events so that users can also update components at the correct stage when it is required.

In addition to managing the update loop and events, `UxrManager` provides the following features:
- Precaching data when a scene is loaded to prevent performance hiccups when specific prefabs are instantiated.
- Avatar movement/teleportation through various methods.
- Serialization of scene state into byte streams and subsequent deserialization.
- Broadcasting component changes and mirroring changes from other devices such as network clients.

## Precaching

{{% callout info %}}
Precaching helps reduce loading times and prevents stuttering at runtime by ensuring that assets are readily available when they are required.
{{% /callout %}}

When a prefab is first instantiated, Unity loads all its associated assets such as textures, models, and sounds. If these assets aren't already in memory and have to be loaded from disk, it can slow down the process. However, subsequent uses of the same prefab benefit from having these assets already in memory, resulting in reduced chances of hiccups.

With precaching, prefabs expected to be used during gameplay are loaded when the scene loads and shown in front of the camera to ensure the rendering. This happens over a set number of frames, usually 50 by default, while the screen stays black to hide the process. Once the precaching is done, the instances are removed, and the scene gradually fades in.
By doing this, the assets needed for these prefabs are more likely to be in memory, which helps prevent interruptions during gameplay.

### `IUxrPrecacheable`

When a new scene is loaded, the framework will look for all components with the `IUxrPrecacheable` interface. The property `PrecachedInstances` from this interface returns the list of prefabs that should be instantiated for precaching.

When users implement new components that instantiate prefabs at runtime, it should be considered whether to add the `IUxrPrecacheable` interface to benefit from the precaching functionality.

The following example defines a custom component that implements the `IUxrPrecacheable` interface and precaches two prefabs: `_prefab1` and `_prefab2`:

```c#
public class MyComponent : UxrComponent, IUxrPrecacheable
{
	[SerializeField] private GameObject _prefab1;
	[SerializeField] private GameObject _prefab2;
	
	public IEnumerable<GameObject> PrecachedInstances
	{
		get
		{
			yield return _prefab1;
			yield return _prefab2;
		}
	}
}
```

## Update Sequence

The `UxrManager` is updated in different stages. Updating in stages provides better control over how components are processed, improving scalability and making debugging easier. Events are available to let developers know when each stage begins or ends, allowing for customization and additional functionality as needed.

The different stages are defined by the `UxrUpdateStage` enum:
- `Update`: Gets new input and tracking values from the controllers. Updates the avatar position using the current locomotion.
- `AvatarUsingTracking`: Updates the avatar extremities using the new tracking values.
- `Manipulation`: Updates the manipulation system.
- `Animation`: Updates the hands based on the current hand poses or hand tracking values.
- `PostProcess`: Applies final processing like Inverse Kinematics.

The following diagram provides on the left a high level view of the stages involved in the update during a single frame. On the right it shows the events triggered before and after each stage.

![](/media/docs/programming-guide/architecture/uxrmanager/UxrManagerUpdateOrder.png)

The `Update` stage runs within the Unity `Update()` method of `UxrManager`. All the other stages, known collectively as **PostUpdate**, are normally executed within the `LateUpdate()` method of `UxrManager`. This behavior can be adjusted using the `PostUpdateMode` property or inspector variable. It can be set to either `Update`, for execution during `Update()`, or `LateUpdate`, for execution during `LateUpdate()`.

## Events

`UxrManager` exposes multiple events to facilitate the integration of new functionality:

### Stage Update Events

As shown in the [update sequence](#update-sequence) above, `UxrManager` provides two sets of update events:

- `AvatarsUpdating`: Triggered just before the update stages start.
- `AvatarsUpdated`: Triggered immediately after the last update stage, `PostProcess` was completed.

and

- `StageUpdating`: Triggered right before an update stage starts. The event parameter indicates the stage.
- `StageUpdated`: Triggered right after an update stage was completed. The event parameter indicates the stage.

{{% callout info %}}
Normally custom components use `AvatarsUpdated` event to make sure the code is executed after UltimateXR finished updating.
For components using grababble objects there are specific events detailed in the [manipulation guide](/docs/programming-guide/manipulation/events).
{{% /callout %}}

### Precaching Events

Similarly, there are pre and post events for the precaching process:
- `PrecachingStarted`: Triggered just before the precaching starts.
- `PrecachingFinished`: Triggered immediately after the precaching was completed.

### `ComponentStateChanged` Event

`UxrManager` provides the `ComponentStateChanged` event, which is triggered by specific changes to components like property changes and method calls.
It acts as a central point for capturing component changes, useful for synchronization across network clients, such as in a network setting.

The descriptor passed to the `ComponentStateChanged` event can be serialized into a byte stream and deserialized back, enabling the replication of the same changes they represent using the `ExecuteStateSyncEvent` method in `UxrManager`.

![](/media/docs/programming-guide/architecture/uxrmanager/StateSyncDiagram.png)

This feature plays a big role in the implementation of multiplayer and replays within UltimateXR.

For a full description of this method, consult the `UxrManager` [API reference](/api/T_UltimateXR_Core_UxrManager_ComponentStateChanged).

State synchronization is covered in detail in the [StateSync](/docs/programming-guide/state-serialization-and-synchronization/statesync) section of the [state serialization and synchronization](/docs/programming-guide/state-serialization-and-synchronization/introduction) guide.

## Teleporting

`UxrManager` offers robust functionality for teleporting or moving avatars. While moving an avatar by directly manipulating its GameObject is possible, we highly recommend using `UxrManager` for this task. This ensures that `AvatarMoved` events are triggered, which are utilized by various components in UltimateXR. For example, LOD components will appropriately adjust mesh visibility based on avatar movement.

`UxrManager` offers a range of teleportation methods, including snap turning, smooth turning, dashing, and fades. These methods come in variations suitable for use in coroutines or `async` methods.
Here is a list of available methods:

- `TranslateAvatar()`
- `MoveAvatarTo()`
- `RotateAvatar()`
- `TeleportLocalAvatar()`
- `TeleportLocalAvatarRelative()`
- `TeleportLocalAvatarAsync()`
- `TeleportLocalAvatarRelativeAsync()`
- `RotateLocalAvatar()`
- `RotateLocalAvatarAsync()`
- `TeleportLocalAvatarCoroutine()`
- `TeleportLocalAvatarRelativeCoroutine()`
- `RotateLocalAvatarCoroutine()`

For a full description of these methods, consult the `UxrManager` [API reference](/api/T_UltimateXR_Core_UxrManager#methods).

## State Serialization

One of the most powerful features of `UxrManager` and the UltimateXR framework is the ability to serialize the entire scene's state to a byte array and deserialize it back.

- `SaveStateChanges()` serializes the state changes to a byte[] array.
- `LoadStateChanges()` deserializes the state changes from a byte array.

The term *changes* is used because, depending on the parameters, these methods can serialize either the entire scene's state or only the modifications made since the scene was loaded or since the last serialization.

This functionality is crucial for multiplayer support, saving game states, and facilitating replays.

For a full description of these methods, consult the `UxrManager` [API reference](/api/T_UltimateXR_Core_UxrManager#methods).

State serialization is covered in detail in the [StateSave](/docs/programming-guide/state-serialization-and-synchronization/statesave) section of the [state serialization and synchronization](/docs/programming-guide/state-serialization-and-synchronization/introduction) guide.