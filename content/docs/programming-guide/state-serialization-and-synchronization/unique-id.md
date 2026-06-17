---
title: "State serialization and synchronization: Unique ids"
---

# State serialization and synchronization: Unique ids

## Unique ids

To create **StateSave** and **StateSync** functionality, it is first required to be able to identify any component using a **unique identifier**. This unique identifier needs to be persistent across devices and sessions. This means that a component will have the same unique id on computer A and computer B in a multi-user session. It also means that the component will keep the same id in different runs of the program.

The reason to need a unique id is to be able to target a specific component when data needs to be loaded or saved. Since Unity doesn't have built-in capability to identify a runtime component or GameObject using a unique Id, this functionality needs to be provided somehow.

All UltimateXR components derive ultimately from `UxrComponent`, which implements among others the `IUxrUniqueId` interface. `IUxrUniqueId` provides access to the `UniqueId` property. `UniqueId` is a `Guid` (Globally Unique Identifier), which is a common way to to identify resources or entities uniquely in software development. It is a 128-bit integer value represented as a hexadecimal string, typically composed of 32 characters separated by hyphens, such as "550e8400-e29b-41d4-a716-446655440000".

Any component in UltimateXR has this unique identifier:
```c#
UxrAvatar avatar = UxrAvatar.LocalAvatar;
Debug.Log("The unique id of the local avatar component is " + avatar.UniqueId);
```
And any component can be retrieved from any point in the application knowing this unique id:
```c#
Guid guid = ...; // Any known component Guid.

if (UxrUniqueIdImplementer.TryGetComponentById(guid, out IUxrUniqueId unique))
{
	Debug.Log("Found component " + unique.Component.name);
}
else
{
	Debug.LogError("Component with id " + guid + " not found.");
}
```
Through the `IUxrUniqueId` interface we can access useful properties:

```c#
IUxrUniqueId unique = ...; // Any component with the IUxrUniqueId interface, such as UxrComponent.

// Access to the Unity component.
unique.Component;

// Access to other Unity properties:
unique.GameObject;
unique.Transform;
unique.UnityPrefabId;
```

In most cases, `Component` will be a component derived from `UxrComponent`, so it can be cast using `unique.Component as UxrComponent`. Users can also implement the `IUxrUniqueId` interface in their own classes if deriving from `UxrComponent` is not possible due to multiple inheritance. Consult the [Custom Parent Class guide](/docs/programming-guide/state-serialization-and-synchronization/custom-parent-class) for the implementation details.

From these properties it's interesting to mention `UnityPrefabId`. While Unity doesn't provide unique ids for component or object instances at runtime, it does so for assets, including prefabs. All Unity .meta files contain in fact, among other things, the unique identifier for the asset file. This is what helps Unity keep track of all assets within a project. It doesn't matter if an entire folder structure is moved within the Assets/ folder, because all assets are referenced internally by their id and not their path. Unity stores this id as a `Guid` string without hyphens. Opening any .meta file with a text editor will show the `guid` property.
The `UnityPrefabId` will give access to the id of the prefab asset if the component resides within a prefab. If the component is an instance within the scene, it will store the id of the prefab from which it was instantiated. If the component is not part of a prefab or prefab instance it will simply be null/empty.

The `UnityPrefabId` is used extensively by the framework. For instance, the `UxrInstanceManager` uses this id to help synchronize object instantiation. However, the prefab id can also be valuable for user-generated features. 

## How are unique ids generated?

Unique ids are generated completely transparent to the user. Whenever a component with the `IUxrUniqueId` interface is added to a prefab or to a scene, the framework will assign it a new unique id. In the case of prefabs, if this prefab is then added to the scene or if it's used to create a new prefab variant, it will make sure to reassign the new component a different id from the source component . All this ensures that no components will ever have the same id at edit-time (more on runtime instantiation ids later!).

There are two elements in UltimateXR that are responsible for generating unique ids:
- `OnValidate()`, which is a Unity method called to validate component changes. `UxrComponent` and custom user classes will use this callback to generate unique ids if necessary. This is why it's essential in `UxrComponent` derived classes that require `OnValidate` to override the method and call the base implementation using `base.OnValidate()`.
- `UxrComponentIntegrityChecker`, which is an editor class that monitors scene saving and will reassign new unique ids in components that have been duplicated. Component copies will share unique ids with their original objects and will be fixed before the scene is saved. This class will also fix any other potential inconsistencies.

By default, UltimateXR hides the `UxrComponent` inspector properties for `UniqueId` and `UnityPrefabId` thanks to the `HideInNormalInspector` attribute:

```c#
[SerializeField] [HideInNormalInspector] private string _uxrUniqueId = string.Empty;  
[SerializeField] [HideInNormalInspector] private string __prefabGuid = string.Empty;
```

The `HideInNormalInspector` attribute, however, will make sure that these properties are visible in the Debug version of the inspector to help with debugging if necessary:

![](/media/docs/programming-guide/state-serialization-and-synchronization/unique-id/DebugMode.png)

![](/media/docs/programming-guide/state-serialization-and-synchronization/unique-id/DebugModeComponent.png)

## Unique ids for objects instantiated at runtime

**Spoiler alert**: UltimateXR solves unique ids for instantiated objects automatically. The process is described here so it can be useful to developers that want to do manual object instantiation or who simply want to know more about how it works. If you want to skip this part, just know that `UxrInstanceManager` automatically provides unique ids on instantiated object trees that will share the same unique id across all devices. Also that UltimateXR's multiplayer connectors do the same for the avatars or objects that are spawned in a networking environment. As long as you use these, you don't have to worry about anything. If you want to dig a little deeper, we recommend reading the documentation below.

One question still remains: What happens if I instantiate a prefab or duplicate an object at runtime? `OnValidate()` and the `UxrComponentIntegrityChecker` essentially work for correct unique id generation during edit-time. But when objects are duplicated or instantiated at runtime, there still will be collisions that need to be handled:
- When a prefab is instantiated, the instantiated components will share the same unique id as the original prefab. And what is worse, if the prefab is instantiated multiple times, all runtime copies will share the same id.
- If an object is duplicated, all copies will also share the same id.

This happens for the whole hierarchy, not just for a single object. An avatar has tens of components in the object hierarchy that will all share the same id with their respective copy.
With colliding ids all the functionality that was mentioned earlier (multiplayer, replays, state saving) will simply not be possible. How would you send an email to a person without a unique e-mail address? 

### Solution: `Guid` combination

Let's say a prefab has 2 components with the `IUxrUnique` interface: `componentA` and `componentB` both with their unique id. When this prefab gets instantiated, we need to make sure that both components get a different unique id than the prefab or any other copy. And not just any unique id, it needs to be the **same unique id** in any other computer if there is a multiuser session currently active. The solution then needs to ensure these 2 properties:

1) All components with `IUxrUniqueId` in the hierarchy need a new id.
2) This new id needs to be the same on all devices.

To help with this, UltimateXR provides a `Guid` extension `Guid Combine(Guid guid1, Guid guid2)` that creates a new `Guid` by combining the original `Guid` with another one.
To continue with the previous example, we can generate a random `Guid` called `combineGuid` that we will use to combine with each of the ids of `componentA` and `componentB`. The result will be two new unique ids that we can use for the components in the prefab instance.
If the prefab gets instantiated multiple times, each time a new single random `combineGuid` will be used to create ids for both components.
At this point we've almost solved our problem. We have property 1) by ensuring different ids for all components in the tree each time a prefab is instantiated. To solve property 2) we just need to ensure that we use the same `combineGuid` on all devices. This is easy! we can just share the `combineGuid` when we're instantiating a prefab and that's it!
The `UxrInstanceManager` will use StateSync functionality to instantiate a prefab and combine it recursively using the same random unique id on all devices. When using multiplayer functionality, a `Guid` combination is also automatically applied to any spawned player prefab or GameObject. Here the `combineGuid` can be derived from the unique id assigned by any of the multiplayer SDKs to the new networked instance.

A recursive combination simplifies this process by applying a Guid combination recursively to all components in the same GameObject and all its children. This method is available through the `IUxrUnique` interface itself:

```c#
// Any component with the IUxrUnique interface.
IUxrUnique component = ...;

// Create a random unique id.
Guid combineGuid = UxrUniqueIdImplementer.GetNewUniqueId();

// Combine with the random unique id. Will combine all components recursively by default.
component.CombineUniqueId(combineGuid);
```

As already mentioned, this will all happen transparently using `UxrInstanceManager` or the multiplayer SDKs connectors. When custom object instantiation is required, it is important to use the `CombineUniqueId` on any of the root components to maintain all StateSync/StateSave functionality in the instances.

## Unique ids and `UxrInstanceManager`

The instance manager in UltimateXR is the `UxrInstanceManager` singleton. Without it, any dynamically instantiated GameObject will not be synchronized. This means that it will not be instantiated in other clients during a networking session, nor will it be registered in a save-to-file, nor will it be visible in a replay. The role of the `UxrInstanceManager` is, therefore, to ensure that any runtime object instantiation is synchronized and correctly registered across all systems where the instantiation should occur **keeping the same unique ids in all replications**.

Instantiating a prefab in UltimateXR using the `UxrInstanceManager` is pretty straightforward:
```c#
// prefab is a GameObject, parent is a Transform, pos is a Vector3 and rot is a Quaternion.
GameObject instance = UxrInstanceManager.Instance.InstantiatePrefab(prefab, parent, pos, rot);
```

Instantiable prefabs need to be registered in the `UxrInstanceManager`. They can be assigned in the inspector using prefab lists:

![](/media/docs/programming-guide/state-serialization-and-synchronization/unique-id/UxrInstanceManager.png)

Prefabs can also be registered at runtime using `RegisterPrefab()`, `RegisterPrefabList()` or `RegisterPrefabLists()`.

{{% callout caution %}}
When registering prefabs from code, remember to unregister them using the `Unregister` methods in `UxrInstanceManager`.
{{% /callout %}}

For scene-specific prefab lists, you can also add a `UxrScenePrefabLists` component to the scene. It will register its `UxrPrefabList` entries when the scene is loaded and unregister them when it is destroyed. Prefabs are loaded when they are instantiated in a scene or referenced by a component, so each scene loads only the prefabs it actually uses. This helps keep memory usage to a minimum.

{{% callout caution %}}
Avoid putting all the prefab lists in your startup scene. This would load all prefabs at startup, even if they are only used by specific scenes.
{{% /callout %}}

Registered prefabs require at least one component implementing `IUxrUniqueId` on the root GameObject, such as any `UxrComponent` or a `UxrSyncObject`.

The `UxrInstanceManager` can be added to a GameObject in the startup/main scene. In applications with multiplayer support, the `UxrNetworkManager` will take care of adding the `UxrInstanceManager` if it's not present.
More in-depth information about the `UxrInstanceManager` can be found in the guide and API section of the documentation.

How does the `UxrInstanceManager` register the instantiation across all systems so that the instantiation can occur in multiplayer, replays or saved in a save game? The answer is it uses both StateSave and StateSync functionality.
- **StateSave**: Saving which prefabs have been instantiated and which instances have been destroyed since the scene was loaded. The instance manager will take care of creating or destroying the appropriate objects when a new state is loaded.
- **StateSync**: Replicating the instantiation event on all clients ensuring that all components in the instantiated objects share the same unique ids.

## Unique ids in multiplayer

Unique ids are automatically handled by the UltimateXR networking system. Whenever a new user/player is spawned, the networking system will recursively assign new unique ids all `IUxrUniqueId` components in the avatar tree. These unique ids will be the result of combining the ids stored in the prefab with the user unique id. The user unique id is provided by the active networking SDK and is normally is called the player id or net id.
By combining all component ids with the player id we ensure that all different avatars will have unique ids and that they will be the same  on all devices.

## The unique id checker tool

Unique ids were first introduced in UltimateXR version 1.0.0 preview. Older versions of UltimateXR didn't store any unique id information.
To help port older projects we provide a tool that can check for components that are missing unique ids. This tool can also help verify correct unique id information in new projects.
The tool can be opened using the menu Tools->UltimateXR->Networking->Check Unique IDs.

![](/media/docs/programming-guide/state-serialization-and-synchronization/unique-id/UniqueIdTool.png)

{{% callout tip %}}
The "Only Log, Don't Modify" option will execute a dry run that will log the changes that would be made to the console, without actually making the changes.
{{% /callout %}}
