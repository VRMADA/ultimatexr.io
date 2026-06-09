---
title: "Multiplayer Programming"
---

# Multiplayer Programming

Multiplayer programming ensures that data in a game or application is synchronized across different devices, allowing multiple users to interact with each other in real time within the same virtual environment.

Without it, actions like a player jumping or shooting on one computer wouldn't be visible to others. Every relevant action a user takes must be sent to other devices, while also receiving updates from the rest, so everyone shares the same experience.

## Multiplayer programming in UltimateXR

UltimateXR’s core functionality has multiplayer support. All key components such as avatars, grabbing and manipulation come with built-in state synchronization, allowing multiple users to join a session and interact seamlessly. While UltimateXR handles the synchronization logic, the actual data transfer is managed by the networking system being used, like NetCode or Photon.

However, when developers introduce new custom functionality in their application, additional multiplayer programming will be required to enable that functionality in a multiplayer environment.

In these cases, UltimateXR developers can choose how to to implement new multiplayer functionality:

1) Using the **UltimateXR Sync API**: A simple yet powerful, platform-agnostic API that not only facilitates multiplayer functionality but also enables automatic support for replays and game saves.
2) Using the **native networking API**: Implements the new multiplayer functionality using the chosen networking system (Mirror, FishNet, NetCode, Photon, etc.).

### Pros of using the UltimateXR Sync API:
  - **Clean and Simple**: It keeps your codebase clean by avoiding platform-specific networking code.
  - **Cross-Networking Support**: Works seamlessly across all supported networking systems without requiring code changes.
  - **Enhanced Functionality**: Enables additional features like replays and game saves with no extra effort.

### Cons of using the UltimateXR Sync API:
  - **Familiarity with Native APIs**: Developers may be more familiar with the networking API of their chosen system.
  - **No Built-in Anti-Cheating Support Yet**: The current version does not include built-in anti-cheating mechanisms. This feature is planned for future releases. For sensitive or competitive applications, **use the encryption and security** features provided by your networking system to protect transmitted data and reduce the risk of tampering.

### Additional Notes:
Certain aspects of network programming, such as lobbies, match-making, and connections, have intentionally been left to the native networking system. These parts are highly specific to each application and are currently beyond the scope of UltimateXR. However, during development, the Prototyping UI provided by UltimateXR for each supported networking module offers a quick solution for testing multiplayer features.

## UltimateXR Sync API

In UltimateXR, multiplayer functionality can be implemented using the Sync API and has two key features:
- [**StateSave**](/docs/programming-guide/state-serialization-and-synchronization/statesave): This serializes the states of components, enabling the server to send the current scene state to new clients upon joining.
- [**StateSync**](/docs/programming-guide/state-serialization-and-synchronization/statesync): This synchronizes state changes in components, ensuring that changes are properly shared across clients.

Other functionality, such as Transform synchronization, is provided through native networking components that are automatically added to selected objects, such as avatars.

## Example

Here's an example that implements **StateSave** and **StateSync** functionality in a simple `Player` component, inheriting from `UxrComponent`.

- **StateSave**: By overriding the `SerializeState()` method, which can be used for both loading and for saving.
- **StateSync**: The player's `IsInvincible` property is synchronized across clients. Additionally, the `Shoot()` method is called on all other clients whenever it's invoked by the local player.

```c#
public Player : UxrComponent
{
    // IsInvincible property has setter with StateSync support.
    // Whenever it changes, it will be changed in the same instance on all other clients too.
    public bool IsInvincible
    {
        get => _isInvincible;
        set
        {
            // Notify of new property value.
            BeginSync();
            _isInvincible = value;
            EndSyncProperty(value);
        }
    }

    // Shoot() method has StateSync support. Whenever it's called,
    // it will be called on the same instance on all other clients too.
    public void Shoot(Vector3 pos, Vector3 dir)
    {
        BeginSync();
        // Perform shooting logic here.
        // Notify of a method call with parameters.
        EndSyncMethod(SyncParams(pos, dir));
    }

    // SerializeState() is used for StateSave support. It is used for both
    // serialization and deserialization to avoid requiring separate read and write methods.
    protected override void SerializeState(bool isReading, UxrStateSaveLevel level, UxrStateSaveOptions options)
    {
        // Always call base implementation first using the same parameters
        base.SerializeState(isReading, level, options);
		
		// Serialize the version first
		SerializeStateVersion(level, options, StateSerializationVersion, out int effectiveVersion);
    
        // We only have our _isInvincible variable to serialize/deserialize.
        SerializeStateValue(level, options, nameof(_isInvincible), ref _isInvincible);
    }
	
	private const int StateSerializationVersion = 0;

    private bool _isInvincible;
}

```

This `Player` component demonstrates how StateSave and StateSync can quickly add multiplayer functionality to a component. The use of the sync API avoids cluttering the code with SDK-specific networking logic, making it easier to maintain and adapt to different networking systems.

## Next Steps

Head over to the [State Serialization and Synchronization](/docs/programming-guide/state-serialization-and-synchronization/introduction) section of the Programming Guide for a complete guide on **StateSave** and **StateSync** functionality.

Check the [Basic Multiplayer Tutorial](/docs/tutorials/multiplayer/basic-multiplayer) in the Tutorials section for an example showcasing how to add multiplayer support to the UltimateXR example scene.
