Pull Request Guidelines
=======================

Mods are built on top of Forge, but there are some things that Forge doesn't support, and that limits what mods can do.  
When modders run into something like that, they can make a change to Forge to support it, and submit that change as a Pull Request on Github.

To make the best use of both your and the Forge team's time, it is recommended to follow some rough guidelines when preparing a Pull Request. The following points are the most important aspects to keep in mind when it comes to writing a good Pull Request.

What Exactly is Forge?
----------------------

At a high level, Forge is a mod compatibility layer on top of Minecraft.   
Early mods edited Minecraft's code directly (like coremods do now), but ran into conflicts with each other when they edited the same things. They also ran into issues when one mod changed behavior in ways that the other mods could not anticipate (like coremods do now), causing mysterious issues and lots of headaches.  

By using something like Forge, mods can centralize common changes and avoid conflicts.  
Forge also includes supporting structures for common mod features like Capabilities, Registries, Fluid handling, the Ore Dictionary, and others that allow mods to work together better.

When writing a good Forge Pull Request, you also have to know what Forge is at a lower level.   
There are two main types of code in Forge: Minecraft patches, and Forge code.

Patches
-------

Patches are applied as direct changes to Minecraft's source code, and aim to be as minimal as possible.  
Every time Minecraft code changes, all the Forge patches need to be looked over carefully and applied correctly to the new code.  
This means that large patches that change lots of things are difficult to maintain, so Forge aims to avoid those and keep patches as small as possible.  
In addition to making sure the code makes sense, reviews for patches will focus on minimizing the size.

There are many strategies to make small patches, and reviews will often point out better methods to do things.  
Forge patches often insert a single line that fires an event or a code hook, which affects the code after it if the event meets some condition.  
This allows most of the code to exist outside of the patch, which keeps the patch small and simple.

For more detailed information about creating patches, [see the GitHub wiki](https://github.com/MinecraftForge/MinecraftForge/wiki/If-you-want-to-contribute-to-Forge#conventions-for-coding-patches-for-a-minecraft-class-javapatch).

Forge Code
----------

Aside from the patches, Forge code is just normal Java code. It can be event code, compatibility features, or anything else that's not directly editing Minecraft code.
When Minecraft updates, Forge code has to update just like everything else. However, it's much easier because it is not directly entangled in the Minecraft code.

Because this code stands on its own, there is no size restriction like there is with the patches.

In addition to making sure the code makes sense, reviews for this code will focus on making the code clean, with proper formatting and Java documentation.

Explain Yourself
----------------

All Pull Requests need to answer the question: why is this necessary?  
Any code added to Forge needs to be maintained, and more code means more potential for bugs, so solid justification is needed for adding code.

A common Pull Request issue is offering no explanation, or giving cryptic examples for how the Pull Request might theoretically be used.
This only delays the Pull Request process.  
A clear explanation for the general case is good, but also give a concrete example of how your mod needs this Pull Request.

Sometimes there is better way to do what you wanted, or a way to do it without a Pull Request at all. Code changes can not be accepted until those possibilities have been completely ruled out.

Show that it Works
------------------

The code you submit to Forge should work perfectly, and it's up to you to convince the reviewers that it does.  

One of the best ways to do that is to add an example mod or junit test to Forge that makes use of your new code and shows it working.  

To set up and run a Forge Environment with the example mods, see [this guide](index.md).

Breaking Changes in Forge
-------------------------

Forge can't make changes that break the mods that depend on it.  
This means that Pull Requests have to ensure that they do not break binary compatibility with previous Forge versions.  
A change that breaks binary compatibility is called a Breaking Change.

There are some exceptions to this, Forge accepts Breaking Changes at the beginning of new Minecraft versions, where Minecraft itself already causes Breaking Changes for modders.  
Sometimes an emergency breaking change is required outside of that time window, but it is rare and can cause dependency headaches for everyone in the modded Minecraft community.

Outside of those exceptional times Pull Requests with breaking changes are not accepted, they must be adapted to support the old behavior or wait for the next Minecraft version.

Be Patient, Civil, and Empathetic
--------------------------------

When submitting Pull Requests you will often have to survive code review and make several changes before it is the best Pull Request possible.  
Keep in mind that code review is not judgement against you. Bugs in your code are not personal. Nobody is perfect, and that's why we're working together. 

Negativity will not help, threatening to give up on your Pull Request and write a coremod instead will just make people upset and make the modded ecosystem worse.  
It's important that while working together you assume the best intentions of the people who are reviewing your Pull Request and not take things personally.

Review
------

If you do your best to understand the slow and perfectionistic nature of the Pull Request process, we will do our best to understand your point of view as well.

After your Pull Request has been reviewed and cleaned up to the best of everyone's ability, it will be marked for a final review by Lex, who has the final say on what is included in the project or not.