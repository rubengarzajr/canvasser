{title}Create an interaction
{text}In this tutorial, we will create two buttons that will show and hide an object.

{step}Create Images

{text}Click on *Add* in the *Images* window.
{img} images_start.png

{text}A new *Image* will be created.
{img} images_added.png

{text}Click on the new *Image* and then view it's *Properties* window.
{img} images_props.png
{text}Change the *id* to *show-button*.
{text}Change the *path* to *sample_images*.
{text}Change the *url* to *sample_show.png*.

{text}Your properties should look like this:
{img} images_props_done.png

{text}Repeat these steps for sample_hide.png and sphere.png.
{img} images_done.png

{step}Create Objects:
{text}Click on *Add* in the *Objects* window.
{img} objects_start.png

{text}A new *Object* will be created.
{img} objects_added.png

{text}Click on the new *Object* and then view it's *Properties* window.
{img} objects_props.png
{text}Change the *id* to *sphere*.
{text}Change the *image* to *sphere*.
{text}Congratulations, you have your first object showing up in Canvasser!
{img} output_01.png

{text}Create a new object and change the id to hide.
{text}Change the *image* to *hide-button*.
{text}Change the *position* to *x:100 y:200*.
{text}Check the *interactive* checkbox so that the button is clickable.
{text}Click on *Add Action* button.
{text}*Cleardown* means a click will only register once.  Most of the time you will have this as your first action.
{text}Click on *Add Action* button and select *vis.*
{text}Change *id* to *sphere*.
{text}Change *filter* to *object*.
{img} objects_hide_properties.png

{text}Try clicking on the *Hide button*.  This sphere should vanish!  Try creating a show button to make the sphere reappear.
