RecipeApp
To jest aplikacja do przepisów, która umożliwia użytkownikom wyszukiwanie przepisów po nazwie lub kategorii, przeglądanie szczegółowych informacji o przepisach, w tym składników i linków do pełnych przepisów oraz dodawanie przepisów do ulubionych. Aplikacja wykorzystuje API MealDB do dynamicznego pobierania danych dotyczących przepisów.

Funkcje
Nawigacja w pasku nawigacyjnym: Zawiera odnośniki do strony głównej, Ulubionych przepisów oraz menu rozwijane z kategoriami przepisów.
Funkcja wyszukiwania: Użytkownicy mogą wyszukiwać przepisy, wpisując nazwę przepisu w pasku wyszukiwania i naciskając Enter lub klikając przycisk "Szukaj przepisów".
Filtrowanie po kategorii: Przepisy można filtrować po kategorii za pomocą menu rozwijanego w pasku nawigacyjnym.
Ulubione przepisy: Użytkownicy mogą dodawać przepisy do listy ulubionych, która jest przechowywana lokalnie w localStorage przeglądarki.
Szczegółowe wyświetlanie przepisów: Każda karta przepisu wyświetla obrazek przepisu, nazwę, kategorię, listę składników oraz opcjonalnie link do pełnego źródła przepisu.
Responsywny design: Wykorzystuje Bootstrap do responsywnego projektowania, zapewniając, że aplikacja jest przyjazna dla urządzeń mobilnych.

Użyte technologie
HTML: Struktura strony internetowej.
CSS (style.css): Stylizacja aplikacji w celu stworzenia intuicyjnego interfejsu użytkownika.
Bootstrap: Wykorzystany do stylizacji komponentów takich jak pasek nawigacyjny, przyciski oraz responsywny układ.
JavaScript (script.js): Implementacja dynamicznych funkcji, w tym zapytań API, obsługi zdarzeń oraz zarządzania localStorage.
API MealDB: Pobieranie danych o przepisach, w tym kategorie, wyniki wyszukiwania i szczegóły przepisów.
