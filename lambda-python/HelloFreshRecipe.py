from Recipe import Recipe


class HelloFreshRecipe(Recipe):
    def __init__(self, json_vals=None):
        super().__init__(json_vals)

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
