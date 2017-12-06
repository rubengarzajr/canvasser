
  var colors = [
    {id:'alert-bg-color',       default:'rgb( 51,   0,   0)', blue:'rgb(51, 0, 0)',      green:'rgb( 51,   0,   0)'},
    {id:'alert-color',          default:'white',              blue:'white',              green:'white'             },
    {id:'loadbox-bg-color',     default:'rgb( 99,  99,  99)', blue:'rgb( 99,  99, 199)', green:'rgb( 99, 199,  99)'},
    {id:'header-bg-color',      default:'rgb( 62,  62,  62)', blue:'rgb( 62,  62, 162)', green:'rgb( 62, 162,  62)'},
    {id:'header-color',         default:'white',              blue:'rgb(200, 200, 255)', green:'rgb(200, 255, 200)'},
    {id:'loadbox-border-color', default:'white',              blue:'white',              green:'white'},
    {id:'loadbox-color',        default:'black',              blue:'black',              green:'black'},
    {id:'notice-bg-color',      default:'rgb( 26,  26,  26)', blue:'rgb(26, 26, 66)',    green:'rgb( 26,  66,  26)'},
    {id:'notice-color',         default:'white',              blue:'white',              green:'white'},
    {id:'menu-dropdown-bg',     default:'rgb( 62,  62,  62)', blue:'rgb(62, 100, 162)',  green:'rgb( 62, 162, 100)'},
    {id:'titlebar',             default:'rgb(122, 122, 122)', blue:'rgb(122, 122, 200)', green:'rgb(  0, 138,   0)'},
    {id:'window-mv-bg',         default:'rgb( 86,  86,  86)', blue:'rgb(86, 86, 186)',   green:'rgb( 26, 186,  26)'},
    {id:'window-mv-border',     default:'rgb(142, 142, 142)', blue:'rgb(142, 142, 242)', green:'rgb(142, 242, 142)'},
    {id:'wintitle-color',       default:'rgb(255, 255, 255)', blue:'rgb(222, 222, 255)', green:'rgb(222, 255, 222)'}
  ];
  colors.forEach(function(color){document.documentElement.style.setProperty('--'+color.id, color['default']);});
