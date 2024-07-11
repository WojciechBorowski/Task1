document.addEventListener('DOMContentLoaded', function () {
    // Pobieramy kategorie z API
    async function getCategories() {
        try {
            const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
            const data = await response.json();
            return data.categories.map(category => category.strCategory);
        } catch (error) {
            console.error("Błąd przy pobieraniu kategorii", error);
            return [];
        }
    }

    // Wyświetla kategorie jak dropdownList
    async function displayCategories() {
        const categories = await getCategories();
        const categoriesDiv = document.getElementById('categories');
        categoriesDiv.innerHTML = '';
        categories.forEach(category => {
            const listItem = document.createElement('li');
            listItem.classList.add('dropdown-item');
            listItem.textContent = category;
            listItem.addEventListener('click', function () {
                getRecipesByCategory(category);
            });
            categoriesDiv.appendChild(listItem);
        });
    }

    displayCategories();

    // Przycisk wyszukiwania - wywołuje getRecipes
    document.getElementById('search-button').addEventListener('click', function (event) {
        event.preventDefault();
        const query = document.getElementById('input-recipe').value.trim();
        if (query) {
            getRecipes(query);
        } else {
            alert('Proszę wprowadzić nazwę przepisu lub składnik.');
        }
    });

    // Wyszukiwanie działa po naciśnięciu Enter
    document.getElementById('input-recipe').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const query = this.value.trim();
            if (query) {
                getRecipes(query);
            } else {
                alert('Proszę wprowadzić nazwę przepisu lub składnik.');
            }
        }
    });

    // Pobieramy listę przepisów po nazwie
    async function getRecipes(query) {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
            const data = await response.json();
            displayResults(data.meals);
        } catch (error) {
            console.error("Błąd przy pobieraniu przepisów", error);
        }
    }

    // Pobieramy listę przepisów po kategorii
    async function getRecipesByCategory(category) {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
            const data = await response.json();

            // Pobieramy szczegółowe informacje o każdym przepisie z osobnego zapytania
            const meals = await Promise.all(data.meals.map(async meal => {
                const mealResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
                const mealData = await mealResponse.json();
                return mealData.meals[0];
            }));

            displayResults(meals);
        } catch (error) {
            console.error("Błąd przy pobieraniu przepisów z kategorii", error);
        }
    }

    function displayResults(meals) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';

        if (!meals) {
            resultsDiv.innerHTML = '<p class="text-center">Nie znaleziono przepisów.</p>';
            return;
        }

        meals.forEach(meal => {
            const mealCard = document.createElement('div');
            mealCard.classList.add('recipe-card');
            mealCard.setAttribute('meal-id', meal.idMeal);

            let ingredientsList = '';
            for (let i = 1; i <= 5; i++) {
                const ingredient = meal[`strIngredient${i}`];
                if (ingredient) {
                    ingredientsList += `<li>${ingredient}</li>`;
                }
            }

            mealCard.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="img-fluid">
                <div class="recipe-card-body">
                    <h5>${meal.strMeal}</h5>
                    <p>${meal.strCategory}</p>
                    <p>Ingredients</p>
                    <ul>
                        ${ingredientsList}
                    </ul>
                    ${meal.strSource ? `<a href="${meal.strSource}" target="_blank" class="btn btn-primary btn-sm">Pełny przepis</a>` : `<p class="text-danger">Link do przepisu jest niedostępny</p>`}
                    <button class="btn btn-warning btn-sm add-recipe-button">Ulubione</button>
                </div>
            `;
            resultsDiv.appendChild(mealCard);

            // Obsługa przycisku "Dodaj do ulubionych"
            mealCard.querySelector('.add-recipe-button').addEventListener('click', function () {
                const mealId = mealCard.getAttribute('meal-id');
                const mealName = mealCard.querySelector('h5').textContent;
                const mealCategory = mealCard.querySelector('p').textContent;
                const mealThumb = mealCard.querySelector('img').src;
                const mealSource = mealCard.querySelector('a') ? mealCard.querySelector('a').href : null;

                const ingredientsList = mealCard.querySelectorAll('ul li');
                const ingredients = Array.from(ingredientsList).map(ingredient => ingredient.textContent);

                let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
                const existingRecipe = recipes.find(recipe => recipe.id === mealId);

                if (existingRecipe) {
                    alert('Przepis jest już w ulubionych.');
                } else {
                    const newRecipe = {
                        id: mealId,
                        name: mealName,
                        category: mealCategory,
                        thumb: mealThumb,
                        source: mealSource,
                        ingredients: ingredients
                    };

                    recipes.push(newRecipe);
                    localStorage.setItem('recipes', JSON.stringify(recipes));
                    alert('Przepis dodany do ulubionych!');
                }
            });
        });
    }

    // Obsługa linku "Ulubione przepisy"
    document.getElementById('favourites-link').addEventListener('click', function (event) {
        event.preventDefault();
        displayFavourites();
    });

    // Wyświetlanie ulubionych przepisów
    function displayFavourites() {
        const resultsDiv = document.getElementById('results');
        const favouritesDiv = document.getElementById('favourites');
        const favouritesResultsDiv = document.getElementById('favourites-results');

        resultsDiv.style.display = 'none';
        favouritesDiv.style.display = 'block';
        favouritesResultsDiv.innerHTML = '';

        const favoriteRecipes = JSON.parse(localStorage.getItem('recipes')) || [];

        if (favoriteRecipes.length === 0) {
            favouritesResultsDiv.innerHTML = '<p class="text-center">Nie masz jeszcze żadnych ulubionych przepisów.</p>';
            return;
        }

        favoriteRecipes.forEach(recipe => {
            const mealCard = document.createElement('div');
            mealCard.classList.add('recipe-card');
            mealCard.setAttribute('meal-id', recipe.id);

            mealCard.innerHTML = `
            <img src="${recipe.thumb}" alt="${recipe.name}" class="img-fluid">
            <div class="recipe-card-body">
                <h5>${recipe.name}</h5>
                <p>${recipe.category}</p>
                <p>Ingredients</p>
                <ul>
                    ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
                ${recipe.source ? `<a href="${recipe.source}" target="_blank" class="btn btn-primary btn-sm">Pełny przepis</a>` : `<p class="text-danger">Link do przepisu jest niedostępny</p>`}
                <button class="btn btn-danger btn-sm remove-favorite-button">Usuń z Ulubionych</button>
            </div>
        `;
            favouritesResultsDiv.appendChild(mealCard);

            // Obsługa przycisku "Usuń z Ulubionych"
            mealCard.querySelector('.remove-favorite-button').addEventListener('click', function () {
                const mealId = mealCard.getAttribute('meal-id');

                let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
                const recipeIndex = recipes.findIndex(recipe => recipe.id === mealId);

                if (recipeIndex !== -1) {
                    recipes.splice(recipeIndex, 1);
                    localStorage.setItem('recipes', JSON.stringify(recipes));
                    alert('Przepis usunięty z ulubionych!');
                    displayFavourites();
                }
            });
        });
    }
});
