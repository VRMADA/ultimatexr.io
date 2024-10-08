# UxrManager Properties
 

The <a href="T_UltimateXR_Core_UxrManager">UxrManager</a> type exposes the following members.


## Properties
&nbsp;<table><tr><th></th><th>Name</th><th>Description</th></tr><tr><td>![Public property](media/pubproperty.gif "Public property")</td><td><a href="P_UltimateXR_Core_UxrManager_IsPrecaching">IsPrecaching</a></td><td>
Gets whether the manager is currently pre-caching. This happens right after the local avatar is enabled and <a href="P_UltimateXR_Core_UxrManager_UsePrecaching">UsePrecaching</a> is set.</td></tr><tr><td>![Public property](media/pubproperty.gif "Public property")</td><td><a href="P_UltimateXR_Core_UxrManager_PostUpdateMode">PostUpdateMode</a></td><td>
Gets or sets when to perform the post-update. The post-update updates among others the avatar animation (hand poses, manipulation mechanics and Inverse Kinematics). It is <a href="T_UltimateXR_Core_UxrPostUpdateMode">LateUpdate</a> by default to make sure they are played on top of any animation generated by Unity built-in animation components like Animator.</td></tr><tr><td>![Public property](media/pubproperty.gif "Public property")</td><td><a href="P_UltimateXR_Core_UxrManager_PrecacheFrameCount">PrecacheFrameCount</a></td><td>
Gets or sets the number of frames pre-cached objects are shown. These frames are drawn in black and right after the scene will fade in, so that pre-caching is hidden to the user.</td></tr><tr><td>![Public property](media/pubproperty.gif "Public property")</td><td><a href="P_UltimateXR_Core_UxrManager_TeleportFadeColor">TeleportFadeColor</a></td><td>
Gets or sets the color used when teleporting using screen fading transitions.</td></tr><tr><td>![Public property](media/pubproperty.gif "Public property")</td><td><a href="P_UltimateXR_Core_UxrManager_UsePrecaching">UsePrecaching</a></td><td>
Gets or sets whether the manager uses pre-caching. Pre-caching happens right after the local avatar is enabled and consists of instantiating objects described in all <a href="T_UltimateXR_Core_Caching_IUxrPrecacheable">IUxrPrecacheable</a> components in the scene. These objects are placed right in front of the camera while it is faded black, so that they can't be seen, which forces their resources to be loaded in order to reduce hiccups when they need to be instantiated during the session. After that they are deleted and the scene is faded in.</td></tr></table>&nbsp;
<a href="#uxrmanager-properties">Back to Top</a>

## See Also


#### Reference
<a href="T_UltimateXR_Core_UxrManager">UxrManager Class</a><br /><a href="N_UltimateXR_Core">UltimateXR.Core Namespace</a><br />