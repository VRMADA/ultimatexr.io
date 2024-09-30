---
title: "Creating a Custom Avatar"
---

# Creating a Custom Avatar
(Example for the Submitting a Simple Edit article)
You may also want to set up a custom avatar using your own rig and graphics. We have put special effort into providing a simple yet powerful way to set up your own avatar.

It all starts by creating an empty GameObject placed at floor level. Add an UxrAvatar component to it.

You will notice that there is immediately an assistant on top of the component that will guide you through the steps by looking at missing elements and offering an instant fix.

Let’s see what it can do automatically:

![](/media/docs/avatars/creating-a-custom-avatar/07AvatarFix01.png)
![](/media/docs/avatars/creating-a-custom-avatar/08AvatarFix02.png)
![](/media/docs/avatars/creating-a-custom-avatar/09AvatarFix03.png)
     
Woops! It seems we got our first roadblock.

![](/media/docs/avatars/creating-a-custom-avatar/10AvatarFix04.png)
 
This is because we haven’t placed anything hanging from the avatar yet. Let’s add our Cyborg geometry, we’ll drag the CyborgGeo asset under the avatar GameObject.

![](/media/docs/avatars/creating-a-custom-avatar/11AvatarFix05.png)
 
Let’s go back to the UxrAvatar assistant and try Fix again. It seems to work now! 

Now we set the Rig Type to Half or Full Body since the avatar is more than just head+hands.

We see that there are some elements that weren’t found correctly (Upper Chest, Chest, and Spine) but the rest was automatically assigned and found, including all finger bones. Let’s assign the missing elements.

![](/media/docs/avatars/creating-a-custom-avatar/12AvatarFix06.png)
 
Going back to the assistant, we see it now offers a choice between using Big Hands or Small Hands for the Hands Integration. You can check the previous section (Using a UltimateXR avatar prefab) if you are not familiar with what the Hands Integration is.

![](/media/docs/avatars/creating-a-custom-avatar/13AvatarFix07.png)
 
Let’s go with the small hands this time. The hand size will not affect the avatar itself; it will only decide which hands are shown when the avatar Render Mode is set to Controllers. When the Controllers are rendered, the Show Controller parameter tells whether to also render hands on top mimicking the user input on the real controllers. These hands, rendered using IK, can either be the big hands or the small hands. It really depends on what you consider your own avatar hand size to be, so that it doesn’t feel different from the avatar that you created.

![](/media/docs/avatars/creating-a-custom-avatar/14AvatarFix08.png)
 
Once we have selected the small hands, we see that the assistant tells us that the avatar is ready to rock!

![](/media/docs/avatars/creating-a-custom-avatar/15AvatarFix09.png)
 
Let’s see how well the hand integration was automatically aligned with our avatar.

Open the SmallHandsIntegration object added to our avatar and select the LeftHand object. We see that it needs a little push forward so that both palms align. The goal is to make sure that the palm centers are approximately in the same place and that both palms lie on the same plane. Fingers can be a little misleading, it’s usually better to focus on getting the palms aligned.

Do the same operation on the right hand.

![](/media/docs/avatars/creating-a-custom-avatar/16AvatarFix10.png)
 
When selecting LeftHand and RightHand in the SmallHandsIntegration object, you may also have noticed that the inspector lets you choose which hands are shown when the avatar Render Mode is set to LeftController + RightController. Set up which combination you prefer.

![](/media/docs/avatars/creating-a-custom-avatar/17AvatarFix11.png)
 
The next step is quite critical for manipulation: Go to the GrabberLeft and GrabberRight objects hanging from LeftHand/RightHand and assign them the correct renderers for each hand. This will provide a way to preview grab hand poses when editing the pose properties of a grabbable object.

![](/media/docs/avatars/creating-a-custom-avatar/18AvatarFix12.png)
 
Now go to the UxrAvatar component and drag all the renderers in your avatar to the Avatar Renderers field. It can be useful to click the lock on the inspector to be able to multi-select all renderers in the hierarchy and drag&drop them to the Avatar Renderers.

![](/media/docs/avatars/creating-a-custom-avatar/19AvatarFix13.png)

To finish let’s go to the root GameObject and edit the UxrStandardAvatarController component. We can adjust the eyes height so that the gizmos shown coincide with the eyes on the avatar. All other values are good by default.

![](/media/docs/avatars/creating-a-custom-avatar/20AvatarFix14.png)
 
Now click Play to test the avatar.

It seems to work nice! That was easy right? We hope the assistant can help you set up many other avatars the same way.

Where to go from here:

- On the root GameObject, add new poses to the UxrAvatar component by going to the Hand Poses section and opening the Hand Pose Editor. You may need to click Create Prefab first to save the avatar you just created as a prefab.
- After creating hand poses, on the root GameObject you can set up the UxrStandardAvatarController component to add hand gestures based on user input.
- Inside the HandsIntegration GameObject, you can set up the teleportation parameters hanging from the ForwardLeft/ForwardRight objects.
- Inside the HandsIntegration GameObject, you can enable laser pointers hanging from the ForwardLeft/ForwardRight objects to interact with Unity UIs. This will require creating an EventSystem in the scene (menu GameObject -> UI -> EventSystem) and adding a UxrPointerInputModule component to the EventSystem GameObject.
- Adding a UxrCameraWallFade component to the avatar’s Camera if you want to fade the screen to black whenever the user clips through colliders. “Allow Traverse” will only fade through the geometry while “Strict” will keep the screen black until the user returns to the original position.
- Set up grabbable objects that the avatar can interact with.

