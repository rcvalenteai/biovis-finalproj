from MongoDB import get_recipes_db
from bson import ObjectId


nutrition = ["Calories", "Fat", "Saturated Fat", "Carbohydrate", "Sugar", "Dietary Fiber",
             "Protein", "Cholesterol", "Sodium"]

nutrition_similar = ["Fat", "Saturated Fat", "Carbohydrate", "Sugar", "Dietary Fiber", "Protein"]

def bubble_chart(ingredient, metric):
    """
    given ingredients, automatically group recipes by ingredient and pair with metric
    :param ingredients: ingredient to find recipes
    :param metric: metric to return along with recipes
    :return: json formatted, list of ingredients aligned in order with list of recipes and metric
    """
    exist = dict()
    recipe_data = dict({'id': list(), 'title': list(), 'metric': list()})
    recipes_db, client = get_recipes_db()
    recipes = recipes_db.find({"ingredients." + ingredient: {"$exists": True}})
    for i, recipe in enumerate(recipes):
        if recipe['title'] not in exist.keys():
            exist[recipe['title']] = 0
            recipe_data['title'].append(recipe['title'])
            recipe_data['id'].append(str(recipe['_id']))
            recipe_data['metric'].append(get_recipe_metric(recipe, metric))
    client.close()
    print(recipe_data)
    return recipe_data


def get_recipe_metric(recipe, metric):
    """
    given a metric and recipe get the numeric value
    :param recipe: a mongodb json recipe
    :param metric: a string
    :return: an integer or float value of the metric
    """
    amount = 0
    if metric in nutrition:
        amount_raw = recipe['nutrition'][metric].split()
        if len(amount_raw) is not 0:
            amount = float(amount_raw(0))
    else:
        return float(recipe[metric].split()[0])
    return amount


def get_recipe_info(recipe_id):
    recipe_data = dict()
    nutrition_data = dict()
    recipes_db, client = get_recipes_db()

    recipe = recipes_db.find({"_id": ObjectId(recipe_id)})
    for result in recipe:
        recipe_data["title"] = result['title']
        for nut in nutrition_similar:
            nutrition_raw = result['nutrition'][nut].split()
            if len(nutrition_raw) == 0:
                nutrition_data[nut] = 0
            else:
                nutrition_data[nut] = nutrition_raw[0]
        recipe_data['nutrition'] = nutrition_data
        recipe_data['image'] = result["image"]
        recipe_data['rating'] = result["rating"]
    client.close()
    return recipe_data


def get_list_of_ingredients():
    ingredients = dict()
    recipes_db, client = get_recipes_db()
    recipes = recipes_db.find()
    for recipe in recipes:
        for ingredient in recipe["ingredients"].keys():
            ingredients[ingredient] = 0
    ingredients = {"ingredients": sorted(list(ingredients.keys()))[4:]}

    client.close()
    return ingredients

print(get_list_of_ingredients())
# bubble_chart("Celery", "preparation_time")
# print(get_recipe_info("5ea223e14a5f7f67bb3d9efc"))