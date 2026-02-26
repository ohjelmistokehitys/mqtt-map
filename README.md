# MQTT: liikennetiedot kartalla

Tämä repositorio sisältää React-sovelluksen, joka näyttää reaaliaikaiset liikennetiedot kartalla. Sovelluksen on tarkoitus käyttää [MQTT-protokollaa](https://mqtt.org/) sekä [Digitransit-palvelua](https://digitransit.fi/en/developers/apis/5-realtime-api/vehicle-positions/high-frequency-positioning/) ja esittää paikallisliikenteen reaaliaikaisia sijaintitietoja [Leaflet-kirjaston](https://leafletjs.com/) avulla.

> *"Most of the vehicles in the HSL area should publish their status, including their position, once per second. The devices of the end users, e.g. smartphones, may subscribe to receive the relevant messages based on their context, e.g. filtered on the mode of transport, the route ID, the geographical region etc. The subscription scope is specified by the MQTT topic structure of the API."*
>
> https://digitransit.fi/en/developers/apis/5-realtime-api/vehicle-positions/high-frequency-positioning/

Sovelluksen React-osuus on rakennettu valmiiksi, mutta liikennetietojen päivittäminen MQTT:n avulla on jätetty toteutettavaksi tässä harjoituksessa. Sovelluksen kehittäminen ei edellytä aikaisempaa kokemusta Reactista tai MQTT:stä, mutta perusymmärrys molemmista on avuksi. React-komponentteihin ei tarvitse tehdä muutoksia, mutta halutessasi voit tehdä myös niihin jatkokehitystä.

Tiedonsiirtologiikka on pyritty tekemään täysin erilliseksi React-komponenteista, jotta voit keskittyä MQTT-asiakaslogiikan toteuttamiseen ilman, että sinun tarvitsee huolehtia siitä, miten React-komponentit toimivat. Logiikan toteuttaminen osaksi isompaa sovellusta voi olla siitä huolimatta haastavaa. Vaihtoehtoisesti voit käyttää MQTT-asiakaslogiikkaasi komentoriviltä ajettavalla skriptillä, josta kerrotaan tarkemmin alempana.


## Sovelluksen rakenne

Sovellus koostuu React-komponenteista sekä MQTT-asiakaslogiikasta, joka on toteutettu komponenttien ulkopuolelle. Sovelluksen [pääkomponentti on `TrafficMap`](./src/map/TrafficMap.tsx), joka renderöi kartan ja näyttää ajoneuvojen sijainnit. Ajoneuvot esitetään kartalla [ikoneina (`VehicleMarker`)](./src/map/VehicleMarker.tsx), ja niiden klikkaaminen avaa [lisätietoja ajoneuvosta (`VehicleInfo`)](./src/map/VehicleInfo.tsx). React-komponentteihin ei tarvitse tehdä muutoksia, mutta niihin tutustuminen voi auttaa hahmottamaan sovelluksen toimintaperiaatetta. Voit halutessasi tehdä niihin myös parannuksia, kuten näkyvän alueen ulkopuolisten ajoneuvojen piilottamisen.

Liikenteen sijaintitietojen päivittäminen on toteutettu [`useVehiclePositions`-hookin](./src/positioning/useVehiclePositions.ts) avulla, joka "tilaa" MQTT-palvelusta ajoneuvojen sijaintitiedot ja päivittää React-komponentit aina, kun uusia tietoja saapuu. Tähän tiedostoon ei tarvitse tehdä muutoksia, mutta voit halutessasi tutustua siihen ja tehdä parannuksia.

Varsinainen MQTT-asiakaslogiikka on tarkoitus toteuttaa erillisessä [`mqttClient.ts`-tiedostossa](./src/positioning/mqttClient.ts), joka tarjoaa yksinkertaisen rajapinnan MQTT-viestintäpalveluun. Tiedoston `subscribeToVehiclePositions`-funktio on tarkoitus toteuttaa siten, että tälle funktiolle voidaan antaa [callback-funktio](), jota kutsutaan aina, kun uusia ajoneuvotietoja saapuu MQTT:stä. Tällä tavalla React-komponentit voivat "tilata" ajoneuvotietoja ilman, että niiden tarvitsee tietää MQTT:n yksityiskohdista.

```
src
├── map
│   ├── TrafficMap.tsx          # karttakomponentti
│   ├── VehicleMarker.tsx       # ajoneuvon karttapiste
│   └── VehicleInfo.tsx         # ajoneuvon lisätiedot
├── positioning
│   ├── mqttClient.spec.ts      # tehtävän testit
│   ├── mqttClient.ts           # tehtävän toteutettava osa
│   └── useVehiclePositions.ts  # tilanhallinta komponenttien ja MQTT:n välillä
├── mqttDemo.ts                 # erillinen Node.js-skripti yhteyden testaamiseen
└── types.ts                    # rajapinnan TypeScript-tyypit
```


## Sovelluksen käynnistäminen

Sovellus on toteutettu hyödyntäen [Vite-työkalua](https://vite.dev/), joka tarjoaa kätevän kehitysympäristön React-sovelluksille. Sovelluksen asentaminen ja käynnistäminen onnistuu seuraavilla komennoilla:

```bash
# Asenna riippuvuudet
npm install

# Käynnistä kehityspalvelin
npm run dev
```

Kun sovellus on käynnissä, voit avata sen selaimessa osoitteessa `http://localhost:5173/` (tai muussa Viten ilmoittamassa osoitteessa). Sovelluksen pitäisi näyttää kartta, mutta ajoneuvotietoja ei vielä näy, ennen kuin MQTT-asiakaslogiikka on toteutettu. Vite huolehtii automaattisesti uudelleenlatauksesta, kun teet muutoksia koodiin, mutta mahdollisissa virhetilanteissa kannattaa ladata sivu uudelleen manuaalisesti. Pidä sekä kehityspalvelimen että selaimen konsoli auki ratkaistessasi tehtävää, sillä näet niissä mahdolliset virheilmoitukset ja lokitiedot.


## High-frequency positioning API

MQTT on tapahtumapohjainen viestintäprotokolla, joka mahdollistaa tehokkaan ja skaalautuvan tiedonsiirron esimerkiksi tällaisessa tilanteessa, jossa sovelluksen on vastaanotettava jatkuvasti päivittyviä tietoja useista ajoneuvoista. MQTT-viestintäpalvelussa ajoneuvotiedot julkaistaan tietyissä "topic"-kanavissa, ja sovelluksen on tilattava sopiva kanava tai kanavat saadakseen tietoja ajoneuvoista.

Tehtävän ratkaisemiseksi sinun tulee perehtyä Digitransit-palvelun [High-frequency positioning -dokumentaatioon](https://digitransit.fi/en/developers/apis/5-realtime-api/vehicle-positions/high-frequency-positioning/). Dokumentaatiossa kerrotaan MQTT-viestintäpalvelun käytöstä, viestintäprotokollasta ja siitä, miten ajoneuvotietoja voidaan tilata ja vastaanottaa. Kokeile esimerkiksi Quick start -osion ohjeita viestien tilauksesta ja seuraamisesta suoraan komentorivillä.

MQTT-palvelu välittää ajoneuvojen tiedot JSON-muodossa, ja näissä tiedoissa on mm. [ajoneuvon sijainti, nopeus ja suunta](https://digitransit.fi/en/developers/apis/5-realtime-api/vehicle-positions/high-frequency-positioning/#the-payload). JSON-viestejä vastaavat TypeScript-tyypit on määritetty valmiiksi [`src/types.ts`-tiedostossa](./src/types.ts). Näitä tyyppejä käytetään React-komponenteissa ja MQTT-asiakaslogiikassa.


## MQTT-logiikan toteuttaminen ja testaaminen

MQTT-logiikka on tarkoitus toteuttaa [`mqttClient.ts`-tiedostoon](./src/positioning/mqttClient.ts) käyttämällä [MQTT.js-kirjastoa](https://www.npmjs.com/package/mqtt). MQTT.js-kirjastoa käytetään myös Digitransit-palvelun dokumentaatiossa, joten sieltä löytyy esimerkkejä MQTT-asiakaslogiikan toteuttamisesta.

Voit kehittää ja testata MQTT-logiikkaasi joko osana karttasovellusta tai erillisen skriptin sekä testien avulla. [`mqttDemo.ts`-tiedosto](./src/mqttDemo.ts) on tarkoitettu erilliseksi skriptiksi, jossa voit testata MQTT-asiakaslogiikkaasi ilman, että sinun tarvitsee käynnistää koko React-sovellusta. Voit ajaa `mqttDemo.ts`-tiedoston Node.js:llä seuraavasti:

```bash
# asenna tsx-työkalu, joka mahdollistaa TypeScript-tiedoston suorittamisen:
npm install --save-dev tsx

# suorita mqttDemo.ts käyttäen tsx-työkalua:
npx tsx ./src/mqttDemo.ts
```

`mqttDemo.ts`-tiedosto kutsuu `subscribeToVehiclePositions`-funktiota ja tulostaa konsoliin kaikki saapuvat ajoneuvotiedot. Tämä on kätevä tapa testata MQTT-asiakaslogiikkaa erillään React-sovelluksesta, ja voit käyttää tätä skriptiä varmistaaksesi, että saat ajoneuvotiedot oikein MQTT:stä ennen kuin kokeilet logiikkaasi selaimessa ja osana isompaa sovellusta. Alussa `mqttDemo.ts`-tiedosto ei tulosta mitään, mutta toteuttaessasi `subscribeToVehiclePositions`-funktion, sen pitäisi alkaa tulostamaan ajoneuvotietoja konsoliin.


## `subscribeToVehiclePositions`-funktion toteutus

Funktiosi tulee luoda MQTT-asiakas, joka yhdistää Digitransit-palvelun MQTT-brokeriin ja tilaa sopivan topic-kanavan saadakseen ajoneuvotiedot. Kun uusia tietoja saapuu, funktiosi tulee kutsua sille annettua callback-funktiota, joka päivittää React-komponentit uusilla ajoneuvotiedoilla. Callback-funktion tulee saada parametrinaan ajoneuvotiedot, jotka on vastaanotettu `VehiclePosition`-tyyppisinä olioina.

Funktion eri ominaisuuksien toteuttamisessa tarvitset sekä [MQTT.js-kirjaston dokumentaatiota](https://github.com/mqttjs/MQTT.js) että [Digitransit-palvelun HFP-dokumentaatiota](https://digitransit.fi/en/developers/apis/5-realtime-api/vehicle-positions/high-frequency-positioning/). Perusidea ja eri vaiheissa oleelliset rajoitteet esitetään alla, mutta yksityiskohtaisempi toteutus on sinun tehtäväsi.


### 1. Yhteyden muodostaminen (30 %)

Ensimmäisenä funktiosi tulee muodostaa yhteys Digitransit-palvelun MQTT-brokeriin. Digitransit-palvelu tukee sekä WebSocket- että TCP-pohjaisia MQTT-yhteyksiä, mutta koska tätä sovellusta on tarkoitus käyttää selaimessa, sinun tulee [valita palvelimeksi](https://digitransit.fi/en/developers/apis/5-realtime-api/vehicle-positions/high-frequency-positioning/#api-endpoints) `wss://mqtt.hsl.fi:443/` (MQTT over WebSockets with TLS, for browsers). `mqtt.connect`-funktion dokumentaatio löytyy [MQTT.js-kirjaston GitHub-sivulta](https://github.com/mqttjs/MQTT.js?tab=readme-ov-file#mqttconnecturl-options).

### 2. Sijaintitietojen tilaaminen (20 %)

Kun yhteys on muodostettu, sinun tulee tilata sopiva [*topic*-kanava](https://digitransit.fi/en/developers/apis/5-realtime-api/vehicle-positions/high-frequency-positioning/#the-topic) saadaksesi ajoneuvotiedot. Digitransit-palvelussa ajoneuvotiedot julkaistaan `hfp/v2/+/+/+/#`-topic-kanavissa, jossa `+`-merkit sekä `#`-merkit ovat jokerimerkkejä, jotka voivat vastata mitä tahansa yksittäistä arvoa tai useampaa arvoa.

Topicissa määritellään mm. ajoneuvon tilapäivityksen tyyppi, joista olemme kiinnostuneet ainoastaan `vp`-tyypin *vehicle position* -tilapäivityksistä. Näin ollen voit tilata esimerkiksi `/hfp/v2/journey/ongoing/vp/#`-topic-kanavan, jonka kautta saat kaikki mahdolliset ajoneuvotiedot, jotka liittyvät meneillään olevien matkojen sijaintipäivityksiin. Tämä kanava tuottaa erittäin paljon tietoa, joten voit myös tutustua dokumentaatioon ja rajata tilaustasi tarkemmin. Tarkemmat tiedot löydät [Digitransit-palvelun HFP-dokumentaatiosta](https://digitransit.fi/en/developers/apis/5-realtime-api/vehicle-positions/high-frequency-positioning/#the-topic) sekä sen [esimerkeistä](https://digitransit.fi/en/developers/apis/5-realtime-api/vehicle-positions/high-frequency-positioning/#examples).

[Dokumentaatiossa kerrotaan myös](https://digitransit.fi/en/developers/apis/5-realtime-api/vehicle-positions/high-frequency-positioning/#a-bounding-box), että voit tilata tiettyjen kriteerien mukaisia tietoja käyttämällä tarkempia topic-kanavia, mutta tässä harjoituksessa riittää, että tilaat kaikki ajoneuvotiedot, joita suodatetaan varsinaisessa ohjelmalogiikassa.

### 3. Tietojen vastaanottaminen ja käsittely (30 %)

Kun tilaus on tehty, MQTT-broker lähettää sinulle jatkuvasti uusia ajoneuvotietoja aina, kun niitä saapuu. Jotta voit reagoida uusiin ajoneuvojen sijaintitietoihin, MQTT-clientille tulee asettaa kuuntelija, jota client kutsuu aina uusien viestien saapuessa. MQTT.js-kirjastossa tämä tapahtuu `client.on('message', callback)`-funktiolla, jossa `callback` on funktio, joka saa parametrinaan topicin ja viestin sisällön. Löydät esimerkin[ GitHubista](https://github.com/mqttjs/MQTT.js?tab=readme-ov-file#example).

Vastaanotettu viesti on binäärimuodossa, joten se tulee muuntaa ensin tekstiksi `message.toString()`-funktiolla ja sen jälkeen parsia JSON-olioksi `JSON.parse`-funktiolla. Muunnoksen jälkeen sinulla on käytössäsi JavaScript-olio, joka vastaa Digitransit-palvelun dokumentaation mukaisia ajoneuvotietoja. Näissä tiedoissa on mm. ajoneuvon sijainti, nopeus ja suunta, jotka on määritetty `VehiclePosition`-tyyppisiksi olioiksi `src/types.ts`-tiedostossa. Näitä tietoja käytetään React-komponenteissa ajoneuvojen sijaintien ja muiden tietojen näyttämiseen kartalla.

Jotta alun perin `subscribeToVehiclePositions`-funktiotasi kutsunut taho saa tiedon uudesta ajoneuvotiedosta, sinun tulee kutsua funktiollesi annettua callback-funktiota. Tarvittaessa määrittele datan tyypiksi `VehiclePosition` esimerkiksi `myData as VehiclePosition`, jotta TypeScript ymmärtää että data on oikean tyyppistä.

### 4. Yhteyden sulkeminen (20 %)

Sovelluksessa on syytä olla myös mekanismi MQTT-yhteyden sulkemiseksi, kun sitä ei enää tarvita. Esimerkiksi React-sovelluksessa käyttäjä saattaa navigoida pois karttanäkymästä, jolloin MQTT-yhteyden sulkeminen on tärkeää. 

MQTT.js-kirjastossa yhteyden sulkeminen tapahtuu `client.end()`-funktiolla. Et kuitenkaan voi sulkea yhteyttä heti `subscribeToVehiclePositions`-funktion sisällä, koska React-komponentit tarvitsevat yhteyttä ja sen kautta saatavia ajoneuvotietoja pitkän aikaan. Voit kuitenkin *palauttaa* omasta `subscribeToVehiclePositions`-funktiostasi uuden sulkemisfunktion (cleanup function), joka sulkee MQTT-yhteyden. Tällöin esimerkiksi karttakomponentti voi kutsua tätä funktiota siinä vaiheessa, kun komponentti poistuu näkyvistä tai ei tarvitse enää ajoneuvotietoja.

### 5. Virheet ja poikkeustilanteet

Tämän tehtävän kannalta riittää, että MQTT-yhteyden muodostaminen ja tilaaminen onnistuu normaalisti, mutta voit halutessasi toteuttaa myös virheiden käsittelyn. Esimerkiksi MQTT-yhteyden muodostaminen tai tilaus saattavat epäonnistua, tai viestintä palvelimen kanssa saattaa keskeytyä. Voit oman harkintasi mukaan varautua myös näihin tilanteisiin, mutta tehtävän kannalta riittää, että peruslogiikka toimii normaalisti.

## Ratkaisun testaaminen ja lähettäminen arvioitavaksi

Ratkaisusi testataan käyttämällä automaattisia [Vitest](https://vitest.dev/)-testejä. Testit sijaitsevat [`src/positioning/mqttClient.spec.ts`-tiedostossa](./src/positioning/mqttClient.spec.ts) ja ne tarkistavat, että `subscribeToVehiclePositions`-funktiosi toimii vaaditulla tavalla:

1. funktio muodostaa yhteyden MQTT-brokeriin
2. tilaa sopivan topic-kanavan
3. vastaanottaa ajoneuvotietoja ja kutsuu callback-funktiota uusien tietojen saapuessa
4. palauttaa sulkemisfunktion, joka sulkee MQTT-yhteyden.

Koska sijaintitiedot vaihtuvat jatkuvasti, testit eivät käytä oikeaa MQTT-palvelinta, vaan ne käyttävät [mock-olioita](https://vitest.dev/guide/mocking) ja simuloivat viestintää. Näin varmistetaan, että testit ovat luotettavia ja toistettavissa vaikka palvelimen ja julkisen liikenteen tilanne vaihtelisi.

Kun olet toteuttanut `subscribeToVehiclePositions`-funktion, voit ajaa testit komennolla:

```bash
npm test
```


## Lisenssit

### HSL:n liikennetiedot

Liikenteen sijaintitiedot saadaan Helsingin seudun liikenteeltä (HSL) ja ne on lisensoitu Creative Commons Nimeä 4.0 (CC BY) -lisenssillä: https://digitransit.fi/en/developers/apis/7-terms-of-use/.

### Leaflet

Leaflet-kirjasto on lisensoitu BSD 2-Clause -lisenssillä: https://github.com/Leaflet/Leaflet/blob/main/LICENSE.

### React-Leaflet

React-Leaflet-kirjasto on lisensoitu Hippocratic License version 2.1 -lisenssillä: https://github.com/PaulLeCam/react-leaflet/blob/master/LICENSE.md

### MQTT.js

MQTT.js-kirjasto on lisensoitu MIT-lisenssillä: https://github.com/mqttjs/MQTT.js/blob/main/LICENSE.md.

### React

React-kirjasto on lisensoitu MIT-lisenssillä: https://github.com/facebook/react/blob/main/LICENSE.

### Vite ja Vitest

Vite-työkalu ja Vitest-testikirjasto on lisensoitu MIT-lisenssillä: https://github.com/vitejs/vite/blob/main/LICENSE ja https://github.com/vitest-dev/vitest/blob/main/LICENSE.

### Tämä tehtävä

Tämän tehtävän on kehittänyt Teemu Havulinna ja se on lisensoitu [Creative Commons BY-NC-SA -lisenssillä](https://creativecommons.org/licenses/by-nc-sa/4.0/).

Tehtävänannon, lähdekoodien ja testien toteutuksessa on hyödynnetty ChatGPT-kielimallia sekä GitHub copilot -tekoälyavustinta.
