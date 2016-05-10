<?php
?>
<html>
    <head>
        <title>Canvasser</title>
        <script src="js/canvasser.js" type="text/javascript"></script>
        <link rel="shortcut icon" href="favicon.ico" />
        <link href="css/normalize.css" rel="stylesheet" type="text/css"/>
        <link href="css/canvasser.css" rel="stylesheet" type="text/css"/>
    </head>
    <body onload='canvasser("data\\data.json");'>
        <table>
            <tr>
                <td>
                    <div id='canvasholder' style="float:left"></div>
                </td>
                <td>
                    <div id='details' class="contentspace" style="float:left"></div>
                </td>
            </tr>
        </table>
    </body>
</html>