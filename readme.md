![canvasser](./author/image/canvasser.png)
# Canvasser
#### Authoring tool for interactive, embeddable, multimedia animations based on HTML5 Canvas.
#### Questions / Comments: <rubengarzajr@gmail.com>

## Quick Start
Copy the files to a web server / LAMP / MAMP / WAMP.

Create a .htaccess file in your canvasser directory.
```
Options +FollowSymLinks
RewriteEngine On

RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ author/php/api.php [L]
```

If you are running Ubuntu or some other Linux distro - you might need to enable mod_rewrite.

```
sudo a2enmod rewrite
sudo service restart apache2
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

Restart your apache service.
```
sudo service restart apache2
```

Navigate to _yourWebserver_/canvasser/author/

Read the tutorials in the **Learning window** or view some samples by expanding the **Samples window**.

## More Info:
[Check out the Wiki!](https://github.com/rubengarzajr/canvasser/wiki)
