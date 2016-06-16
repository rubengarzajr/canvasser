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
    <body onload='initCanvasser("tex","data/eforensics.json");'>
        <div class="title_a">Case File</div>
        <div class="title_b">Drag bones</div>
        <table>
            <tr>
                <td>
                    <div id='canvasholder' style="float:left"></div>
                </td>
            </tr>
        </table>
        <table class="bottomlinks">
            <tr>
                <td>
                    <div class="locationbank" onclick='window.tex.external([{"command":"selectonly", "item":"drop_a"}])'>Pin A</div>
                </td>
                <td>
                    <div class="locationbank" onclick='window.tex.external([{"command":"selectonly", "item":"drop_e"}])'>Pin E</div>
                </td>
                <td>
                    <div class="locationbank" onclick='window.tex.external([{"command":"selectonly", "item":"drop_i"}])'>Pin I</div>
                </td>
                <td>
                    <div class="locationbank" onclick='window.tex.external([{"command":"selectonly", "item":"drop_m"}])'>Pin M</div>
                </td>
                <td>
                    <div class="locationbank" onclick='window.tex.external([{"command":"selectonly", "item":"drop_q"}])'>Pin Q</div>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="locationbank" onclick='window.tex.external([{"command":"selectonly", "item":"drop_b"}])'>Pin B</div>
                </td>
                <td>
                    <div class="locationbank" onclick='window.tex.external([{"command":"selectonly", "item":"drop_f"}])'>Pin F</div>
                </td>
                <td>
                    <div class="locationbank" onclick='window.tex.external([{"command":"selectonly", "item":"drop_j"}])'>Pin J</div>
                </td>
                <td>
                    <div class="locationbank" onclick='window.tex.external([{"command":"selectonly", "item":"drop_n"}])'>Pin N</div>
                </td>
                <td>
                    <div class="locationbank" onclick='window.tex.external([{"command":"selectonly", "item":"drop_r"}])'>Pin R</div>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="locationbank" onclick='window.tex.external([{"command":"selectonly", "item":"drop_c"}])'>Pin C</div>
                </td>
                <td>
                    <div class="locationbank" onclick='window.tex.external([{"command":"selectonly", "item":"drop_g"}])'>Pin G</div>
                </td>
                <td>
                    <div class="locationbank" onclick='window.tex.external([{"command":"selectonly", "item":"drop_k"}])'>Pin K</div>
                </td>
                <td>
                   <div class="locationbank" onclick='window.tex.external([{"command":"selectonly", "item":"drop_o"}])'>Pin O</div>
                </td>
                <td>
                   <div class="locationbank" onclick='window.tex.external([{"command":"selectonly", "item":"drop_s"}])'>Pin S</div>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="locationbank" onclick='window.tex.external([{"command":"selectonly", "item":"drop_d"}])'>Pin D</div>
                </td>
                <td>
                    <div class="locationbank" onclick='window.tex.external([{"command":"selectonly", "item":"drop_h"}])'>Pin H</div>
                </td>
                <td>
                    <div class="locationbank" onclick='window.tex.external([{"command":"selectonly", "item":"drop_l"}])'>Pin L</div>
                </td>
                <td>
                    <div class="locationbank" onclick='window.tex.external([{"command":"selectonly", "item":"drop_p"}])'>Pin P</div>
                </td>
                <td>
                    <div class="locationbank" onclick='window.tex.external([{"command":"selectonly", "item":"drop_t"}])'>Pin T</div>
                </td>
            </tr>
        </table>
    </body>
</html>