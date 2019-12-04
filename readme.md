![canvasser](./author/image/canvasser.png)
# Canvasser
#### Authoring tool for interactive, embeddable, multimedia animations based on HTML5 Canvas.
#### Questions / Comments: <rubengarzajr@gmail.com>

## Recovery of deleted files
https://yourIP/canvasser/author/php/recover.php

## Quick Start
Copy the files to a web server / LAMP / MAMP / WAMP.

### HTACCESS Files
Create a .htaccess file in your canvasser directory.
```
Options +FollowSymLinks
RewriteEngine On

RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ author/php/api.php [L]
```

Also, you may need to allow your .htaccess file to rewrite rules.

```
sudo nano /etc/apache2/sites-available/000-default.conf
```
Edit the VirtualHost by adding the <Directory> contents.
```

<VirtualHost *:80>
    <Directory /var/www/html>
        Options Indexes FollowSymLinks MultiViews
        AllowOverride All
        Require all granted
    </Directory>

    . . .
</VirtualHost>

```

### Apache Settings
If you are running Ubuntu or some other Linux distro - you might need to enable mod_rewrite.

```
sudo a2enmod rewrite
sudo service restart apache2
```

### PHP Settings

You may also need to increase the max post and upload file size inside your PHP.INI file.
For example - LAMP would need to sudo gedit /etc/php/7.0/apache2/php.ini

Then search for:
```
upload_max_filesize
```
and then change it to a larger value like:
```
upload_max_filesize = 10M
```

Also, you need to change
```
post_max_size
```

to match the value you put in max upload_max_filesize
```
post_max_size = 10M
```
Restart your apache service.
```
sudo service restart apache2
```

Navigate to _yourWebserver_/canvasser/author/

Read the tutorials in the **Learning window** or view some samples by expanding the **Samples window**.


## External Commands:
You can issue commands to canvasser from other DOM elements using the following format:
```
<div data-canvasser="activity" data-canvasser-command='[{"command":"selectonly", "item":"objectID"}]'>CLICK ME</div>
```

This will click the object. Make sure the data-canvasser tag matches the "canvasdomname" in the settings.
The objectID is NOT the name of the object. Currently, you must use the JSON window to find the actual ID.
You can issue multiple commands per click, since the JSON is in an array.


## Minify
https://nodejs.org/en/download/package-manager/

Install Node.js v4
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs

or v6:
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs


https://github.com/mishoo/UglifyJS2

uglifyjs ~/Documents/canvasser/canvasser.js --compress --screw-ie8 --mangle --output ~/Documents/canvasser/canvasser.min.js


## More Info:
[Check out the Wiki!](https://github.com/rubengarzajr/canvasser/wiki)
