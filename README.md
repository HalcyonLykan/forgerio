Intructiuni de instalare:

Descarca docker https://www.docker.com/products/docker-desktop
dupa instalare, clonezi repository-ul asta si deschizi un terminal in acel folder
rulezi in consola docker-compose up -d
rulezi docker exec -it forgerio_app_1 /bin/bash
rulezi npm i
rulezi npm i -g laravel-echo-server
rulezi composer install
rulezi laravel-echo-server start
si teoretic ar trebui sa porneasca, poti apoi vedea aplicatia la http://localhost:8081/
