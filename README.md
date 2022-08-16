# Groupwork

## Présentation

Ce projet de groupe est une application web frontend (HTML, CSS, JavaScript) suivant un cahier des charges avec des appels a notre propre API, réalisée avec Symfony (Doctrine). 



## Setup

Pour utiliser ce projet, il faut cloner le repository de l'[API sur GitHub](https://github.com/jibundeyare/symfo-p9).

Ensuite, depuis le dossier obtenu, il faut lancer la commande

```bash
symfony serve
```

Une fois le serveur de développement de l'API lancé, il faut ensuite lancer le serveur front dans le dossier de ce projet, en utilisant la commande 

```bash
php -S 0.0.0.0:8080
```



## Utilisation

Après avoir lancé les deux serveurs, il suffit d'aller à l'adresse [http://localhost:8080/](http://localhost:8080) pour accéder à la page d'acceuil.



## Elements

### wordcloud-poc

Cet section montre le Proof of Concept du wordcloud. Dans la version finale, il nous suffira de associer le code JavaScript à l'element html désiré.