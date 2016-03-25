<VirtualHost *:80>
    ServerName {{hostname}}
    DocumentRoot /var/www/vhosts/{{hostname}}

    ErrorLog "|/usr/bin/cronolog ${APACHE_LOG_DIR}/{{hostname}}/error.log-%Y%m%d"
    CustomLog "|/usr/bin/cronolog ${APACHE_LOG_DIR}/{{hostname}}/access.log-%Y%m%d" combined

    <FilesMatch ".+\.php$">
        SetHandler "proxy:unix:/run/php/{{hostname}}.sock|fcgi://localhost"
    </FilesMatch>

    <Directory /var/www/vhosts/{{hostname}}>
        AllowOverride All
    </Directory>
</VirtualHost>
