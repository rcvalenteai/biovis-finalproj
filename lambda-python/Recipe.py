from recipes.Ingredient import Ingredient, get_all_ingredients


class Recipe(object):

    def __init__(self, json_vals=None):
        if json_vals is None:
            json_vals = dict()
        self.title = json_vals.get("title", None)
        self.description = json_vals.get("description", None)
        self.preparation_time = json_vals.get("preparation_time", None)
        self.allergies = json_vals.get("allergens", list())
        self.ingredients = json_vals.get("ingredients", dict())
        self.nutrition = json_vals.get("nutrition", dict())
        self.utensils = json_vals.get("utensils", list())
        self.instructions = json_vals.get("instructions", None)
        self.image = json_vals.get("image", None)
        self.text_instructions = json_vals.get("text_instructions", list())
        self.rating = json_vals.get("rating")
        self.rating_count = json_vals.get("rating_count")

    def from_db(self):
        pass

    def to_db(self):
        pass