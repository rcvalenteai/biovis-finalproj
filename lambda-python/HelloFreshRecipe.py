from recipes.Recipe import Recipe
from hellofreshscraper.utils import soupify_url, soup_and_content_url
from hellofreshscraper.recipe_parser import title_parse, second_title_parse, description_parse, preparation_time_parse
from hellofreshscraper.recipe_parser import allergens_parse, ingredients_parse, nutrition_info_parse, utensils_parse
from hellofreshscraper.recipe_parser import pdf_link_parse, image_parse, rating_parse, ratings_count_parse
from hellofreshscraper.recipe_parser import text_instructions_parse
from bson import BSON
from bson import json_util
import json


class HelloFreshRecipe(Recipe):
    def __init__(self, json_vals=None):
        # self._id = json_vals.get("_id", None)
        # self.rating = json_vals.get("rating", 0)
        # self.rating_count = json_vals.get("rating_count", 0)
        super().__init__(json_vals)

    @classmethod
    def from_url(self, recipe_url):
        soup, content = soup_and_content_url(recipe_url)
        recipe = HelloFreshRecipe()
        recipe.title = title_parse(soup) + " " + second_title_parse(soup)
        recipe.description = description_parse(soup)
        recipe.preparation_time = preparation_time_parse(soup)
        recipe.allergies = allergens_parse(soup)
        ingredients = ingredients_parse(soup)
        for ingredient in ingredients:
            recipe.ingredients[ingredient[1]] = ingredient[0]
        nutritions = nutrition_info_parse(soup)
        for nutrition in nutritions[:-1]:
            recipe.nutrition[nutrition[0]] = nutrition[1]
        recipe.utensils = utensils_parse(soup)
        recipe.instructions = pdf_link_parse(soup)
        recipe.image = image_parse(soup)
        recipe.rating = rating_parse(content)
        recipe.rating_count = ratings_count_parse(content)
        recipe.text_instructions = text_instructions_parse(soup)
        return recipe

    @classmethod
    def from_mongo(cls, recipe_bson):
        recipe = HelloFreshRecipe(recipe_bson)
        return recipe

    def to_factors(self):
        factors = list()
        time = self.preparation_time.split()
        time = time[0]

        factors.append(time)
        for nutrition in self.nutrition.values():
            raw_value = nutrition.split()
            raw_value = raw_value[0]
            factors.append(raw_value)

        factors.append(self.rating)
        factors.append(self.rating_count)
        return factors
