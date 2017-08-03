Canvasser TODO:

author_buildprops - unify into one function
Wait until all images are loaded before displaying anything

Groups UI
Shapes UI
Tests Prop UI
Settings UI Broken
From current on animations acting weird

I think there's something wrong with the fade animation in canvasser.
If I add it through the animation panel, it'll have startalpha but not endalpha in the json file.
It still works once I manually put endalpha and a value for it in the json
Samples are getting placed in exported JSON.

DONE:
2017-08-03 Only one particle of a type can exist at a time and animations will override old one.
2017-08-03 Renamed testp to Interactive in UI and hide actions if object not interactive.
2017-08-03 Added "flow" particle emission type.  Burst now emits all particles at once.
2017-08-03 Version 1.1.0
2017-08-03 Fixed move anims referencing particle archetype rather than particle instance.
2017-08-02 Fixed animation bug with undefined previous time triggering anims twice.
2017-08-02 Permanent particle persisting working.
2017-08-02 Windows no longer go off of screen.
2017-08-01 Particle parenting working.
2017-07-28 Tests hooked up.
2017-07-18 Tests Window added to UI.
2017-07-18 Conditional position and variable added to UI.
2017-07-17 Sound UI and Add/Delete implemented.
2017-07-17 Combined functions for UI build menus.
2017-07-14 Settings cached option (bool) added - defaults to use cached
2017-07-14 Canvasser Init now grabs previous x,y mouse position for loadInto
2017-07-14 loadInto now stops the loop - not sure if 100% fixed but seems okay
