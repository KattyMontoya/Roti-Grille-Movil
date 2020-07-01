# KESTORE:

File Key:
roti-grill-key.keystore

Alias:
roti-grill

Password:
roti.grill.2020

# Datos porporcionados:

Name:
Roti Grill

Organizational Uni:
Restaurante Ec

Organization:
Restaurante

City:
Quito

Province:
Pichincha

Two-letter country code:
EC


keytool -genkey -v -keystore roti-grill-key.keystore -alias roti-grill -keyalg RSA -keysize 2048 -validity 10000


jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore roti-grill-key.keystore app-release-unsigned.apk roti-grill

zipalign -v 4 app-release-unsigned.apk roti-grill-prod.apk
