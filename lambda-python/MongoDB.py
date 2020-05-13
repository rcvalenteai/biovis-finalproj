from pymongo import MongoClient


def get_recipes_db():
    client = MongoClient(
        "mongodb+srv://bigdatamanagement:bigdatamanagement2019@mongosandbox-qzmsu.mongodb.net/test?retryWrites=true&w=majority")
    db = client['projectfour']
    recipes_db = db.get_collection('recipes')
    return recipes_db, client


# def mongo_to_csv():
#     recipes_db, client = get_recipes_db()
#     recipes = recipes_db.find()
#     factors = list()
#     for mongo_recipe in recipes:
#         recipe_factors = list()
#         recipe = HelloFreshRecipe.from_mongo(mongo_recipe)
#         factors.append(recipe.to_factors())
#     print(factors)
#     write_list_csv("data", "recipe_stats_ratings.csv", factors)


