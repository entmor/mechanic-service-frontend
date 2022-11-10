# Mechanic Service

Projekt mający na celu pokazanie umiejętności w Angular przeze mnie (Bartosz Chwarścianek)

Wersja Angulara to 14++

- `Routing` korzysta z:
  - Lazy loading
  - Guardów typu `CanActivate` czy `CanLoad` -> `src/app/guards`
  - Resolverów ->  `src/app/resolvers`
- `Component Repairs` został napisany w wzorcu `Model-View-Presenter` -> `src/app/components/Repairs`
- Projekcie znajdują się `Componenty Standalone`
- `Http Interceptor` został wykorzystany do przetwarzania danych z i do aplikacji za pomocą `HttpClient` -> `src/app/interceptor`
- Mechanizm `Injection Token` został wykorzystany do prowadzenia pewnych danych, w różnych componentach które używaja tego samego componentu
- **Store** 
- - Do przechowywania globalnego stanu został wykorzytany `NGRX` -> `/src/app/store`
- -  a także `@ngrx/effects`

- **Testy**
- - _Unit Tests_
- - - Karma + Jasmine - niestety nie cała aplikacja została jeszcze pokryta testami UNIT.
- - _E2E_
- - - Cypress - pełne pokrycie aplikacji.
- W aplikacji również jest wykorzytany `RXJS!`
- Aplikacja korzysta z `Angular Material`,
- itd.

## Server Backend
Tu znajdziesz backend do tego projektu, napisany również przeze mnie w NODE.js, wykorzystując Express.js, Docker oraz GRPC do komunikacji pomiędzy containerami 

[Server Mechanic Service](https://github.com/entmor/mechanic-service-backend)

## Development server

`ng serve` aby uruchomić wersje development, można użyć również flagi `-o`, aby automatyczne otworzyć w przeglądarce. 

Domyśny adres i port to `http://localhost:4200`

## Production Build

Użyj `ng build --configuration=production` aby wygenerować projekt w wersji produkcyjnej. Projekt będzie znajdował się w folderze `dist/`.

## Unit tests

Użyj `ng test` aby uruchomić Unit tests.

## E2E tests

Co testowania E2E został wykorzystany Cypress. Testy mają być przeprowadzone w warunkach podobnych do produkcyjny (bez mockowania danych), dlatego należy uruchomić:
1) [Server Mechanic Service:](https://github.com/entmor/mechanic-service-backend)`https://github.com/entmor/mechanic-service-backend` w wersji Development (wraz containerem Cypress)
2) Uruchomić stronę poprzez `ng serve`
3) Uruchomić cypress test. Dla wersji konsolowej: `npm run cypress:run`, wersja desktopowa `npm run cypress:open`
