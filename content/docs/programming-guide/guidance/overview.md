---
title: "Guidance Programming Guide"
---

# Overview

The **guidance system** in UltimateXR provides visual hints to guide the user towards targets in the VR environment. It uses a compass-style indicator that appears in front of the user's view, pointing towards the target when it is not visible. Once the target comes into sight, optional action icons can be displayed on top of it.

This guide offers a programmatic perspective. You can also check the [Guides API Reference](/api/N_UltimateXR_Guides).

## Key Components

### [UxrCompass](/docs/programming-guide/guidance/uxrcompass)

The `UxrCompass` is a singleton component that manages the compass indicator. It can be accessed globally using `UxrCompass.Instance`.

### [UxrCompassTargetHint](/docs/programming-guide/guidance/uxrcompass#uxrcompasstargethint)

The `UxrCompassTargetHint` component can be attached to target GameObjects to customize where the compass points to, depending on the current display mode.

## Display Modes

The `UxrCompassDisplayMode` enum defines how the compass behaves when the target is in sight:

- **`OnlyCompass`**: Only the compass arrow is shown while the target is not in sight. No icon is displayed when the target becomes visible.
- **`Location`**: Shows a location icon on top of the target when it is in sight. Indicates where the user should move next.
- **`Grab`**: Shows a grab icon on top of the target when it is in sight. Indicates that an object should be grabbed.
- **`Look`**: Shows a look icon on top of the target when it is in sight. Draws attention to a specific object.
- **`Use`**: Shows a use icon on top of the target when it is in sight. Indicates that an interaction should be performed.

## Quick Start

```c#
// Point the compass to a target with a grab icon
UxrCompass.Instance.SetTarget(targetTransform, UxrCompassDisplayMode.Grab);

// Stop the compass
UxrCompass.Instance.SetTarget(null);
```

## API Reference

For more information, refer to the [UxrCompass API Reference](/api/T_UltimateXR_Guides_UxrCompass).
