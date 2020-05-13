from pymongo import MongoClient
from hellofreshscraper.HelloFreshRecipe import HelloFreshRecipe
import datetime
from hellofreshscraper.recipe_searcher import weekly_recipe_titles, batch_search_recipe, first_card_url, search_recipe
from selenium import webdriver
from hellofreshscraper.recipe_searcher import RecipeNotFoundError
import json
from recipes.Ingredient import Ingredient, get_all_ingredients, not_found
from recipes.GroceryList import GroceryList
import os
import csv

import time


def test_example(year, week):
    print(year, week)
    recipes = weekly_recipe_titles(year, week)
    client = MongoClient(
        "mongodb+srv://bigdatamanagement:bigdatamanagement2019@mongosandbox-qzmsu.mongodb.net/test?retryWrites=true&w=majority")
    db = client['projectfour']
    recipes_db = db.get_collection('recipes')
    recipe_urls = list()
    recipe_search_pages = batch_search_recipe(recipes, 1)
    for search_page in recipe_search_pages:
        recipe_urls.append(first_card_url(search_page))

    print(recipe_urls)
    for recipe_url in recipe_urls:
        recipe = HelloFreshRecipe.from_url(recipe_url).__dict__
        print(recipe["title"])
        recipe['created_on'] = datetime.datetime.strptime(str(year) + "-" + str(week), "%Y-%W")
        recipes_db.insert_one(recipe)
        time.sleep(1)
    client.close()



def test_example_2():
    client = MongoClient(
        "mongodb+srv://bigdatamanagement:bigdatamanagement2019@mongosandbox-qzmsu.mongodb.net/test?retryWrites=true&w=majority")
    db = client['projectfour']
    recipes_db = db.get_collection('recipes')
    recipe_url = first_card_url(search_recipe("Crispy Chicken Parmesan"))
    recipe = HelloFreshRecipe.from_url(recipe_url).__dict__

    recipe['created_on'] = datetime.datetime.now()
    recipes_db.insert_one(recipe)
    client.close()


def get_recipes_db():
    client = MongoClient(
        "mongodb+srv://bigdatamanagement:bigdatamanagement2019@mongosandbox-qzmsu.mongodb.net/test?retryWrites=true&w=majority")
    db = client['projectfour']
    recipes_db = db.get_collection('recipes')
    return recipes_db, client


def get_ratings():
    ingredients_count = dict()
    amounts_count = dict()
    recipes_db, client = get_recipes_db()
    recipes = recipes_db.find()
    print(recipes.count())
    for i in range(recipes.count()):
        doc = recipes.next()
        for ingredient, amount in doc.get("ingredients").items():
            count = ingredients_count.setdefault(ingredient, 0)
            ingredients_count[ingredient] = count + 1
            amounts = amount.split(" ")
            for amount2 in amounts:
                if not amount2.isnumeric() and amount2 != "/\u00a0serving" and amount2 != "" and amount2 != "people":
                    try:
                        float(amount2)
                    except ValueError:
                        counter = amounts_count.setdefault(amount2, 0)
                        amounts_count[amount2] = counter + 1

    # def convert_serving_amounts(amount):
    #     blacklist = ["/\u00a0serving", "", "people"]
    #
    #
    # def blacklisted_amounts(amount):

    ingredients_count = {k: v for k, v in sorted(ingredients_count.items(), key=lambda item: item[1])}
    print(ingredients_count)
    print(len(ingredients_count))
    amounts_count = {k: v for k, v in sorted(amounts_count.items(), key=lambda item: item[1])}
    print(amounts_count)
    print(len(amounts_count))
    print(json.dumps(ingredients_count, indent=4))
    print(json.dumps(amounts_count, indent=4))


    client.close()
def load_in_name_instruction():
    recipes_db, client = get_recipes_db()
    recipes = recipes_db.find()
    input_file = ""
    for mongo_recipe in recipes:
        recipe = HelloFreshRecipe.from_mongo(mongo_recipe)



def load_in_mongo():
    recipes_db, client = get_recipes_db()
    recipes = recipes_db.find()
    ingredients = list()
    old_ingredients = list()
    count = 0
    for mongo_recipe in recipes:

        recipe = HelloFreshRecipe.from_mongo(mongo_recipe)
        # print(recipe.ingredients)
        #
        # print(recipe.title)
        old_ingredients.append(ingredients)
        ingredients = get_all_ingredients(recipe)
        count += 1
        if count >= 500:
            break
        if count < 4:
            print("adding", recipe.title)
            grocery_list.add_recipe(recipe)
        else:
            break
        # else:
        #     for prev_ingredients in old_ingredients:
        #         for ingredient in prev_ingredients:
        #             for ingredient2 in ingredients:
        #                 combined = Ingredient.add(ingredient, ingredient2)
        #                 if combined is None and ingredient.ingredient == ingredient2.ingredient:
        #                     print(recipe.title)
        #                     print(mongo_recipe['instructions'])


    client.close()


def clear_old_entries():
    recipes_db, client = get_recipes_db()
    d = "2020-W01"
    print(recipes_db.remove({"created_on": {"$gt": datetime.datetime.strptime(d, "%Y-W%W")}}))
    print("cleared old entries in 2020")
    client.close()


def mongo_to_csv():
    recipes_db, client = get_recipes_db()
    recipes = recipes_db.find()
    factors = list()
    for mongo_recipe in recipes:
        recipe_factors = list()
        recipe = HelloFreshRecipe.from_mongo(mongo_recipe)
        factors.append(recipe.to_factors())
    print(factors)
    write_list_csv("data", "recipe_stats_ratings.csv", factors)


def search_recipes(recipe_name):
    recipes_db, client = get_recipes_db()
    query = {"title": {'$regex': recipe_name}}
    recipes = recipes_db.find(query)
    print(type(recipes))
    recipe = HelloFreshRecipe(recipes[0])
    grocery_list.add_recipe(recipe)
    client.close()


def write_list_csv(output_folder, filename, rows):
    output_path = "./" + output_folder + "/"
    filename = output_path + filename
    if not os.path.exists(output_path):
        os.makedirs(output_path)
    with open(filename, 'w', newline='', encoding='utf-8') as out:
        csv_cout = csv.writer(out)
        for row in rows:
            csv_cout.writerow(row)


# grocery_list = GroceryList()
# # load_in_mongo()
# print(not_found)
# #get_ratings()
# for i in range(51):
#     try:
#         test_example(2017, i+1)
#     except Exception as e:
#         print(e)
# for i in range(51):
#     try:
#         test_example(2018, i+1)
#     except Exception as e:
#         print(e)
# for i in range(51):
#     try:
#         test_example(2019, i+1)
#     except Exception as e:
#         print(e)
#clear_old_entries()
# #test_example(2019, 2)
# search_recipes("Beef Bulgogi Bowls")
# search_recipes("Pork Sausage Spaghetti Bolognese")
# search_recipes("Veggie Bibimbap Rice Bowls")
#
# print(grocery_list)
# mongo_to_csv()
