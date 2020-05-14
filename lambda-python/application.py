from flask import Flask, request
from flask_restplus import Resource, Api, reqparse
from flask_restplus import inputs
from flask_cors import CORS
import json

from MongoDB import get_recipes_db
import VisualizationQuery

application = Flask(__name__)
application.config.SWAGGER_UI_DOC_EXPANSION = 'list'
api = Api(application, version='1.0', title='HelloFresh dataset API',
          description='HelloFresh Dataset parsing API')
cors = CORS(application, resources={r"/*": {"origins":"*"}})



bubble_chart = reqparse.RequestParser()
bubble_chart.add_argument('ingredient', type=str, required=True,
                          default='Celery',
                          help='an ingredient')
bubble_chart.add_argument('metric', type=str, required=False,
                          default='preparation_time',
                          help='metric to return value of with recipe name and ID, use & for dictionary-searches')

single_recipe = reqparse.RequestParser()
single_recipe.add_argument("recipe_id", type=str, required=True, default="5ea223e14a5f7f67bb3d9efc",
                           help='mongodb objectid as string for a recipe')

api.namespaces[0].name = 'Livox API'
api.namespaces[0].description = 'Main API methods for List Question Classifier'


@api.route("/bubble_chart")
class BubbleChart(Resource):

    @api.expect(bubble_chart)
    def get(self):
        """
        given a list of ingredients return recipes organized by ingredient used, with information on the specified metric
        and recipe name and details
        :return: json formatted batched list of organized recipes
        """
        args = bubble_chart.parse_args(request)
        ingredient = args.get('ingredient')
        metric = args.get('metric')
        count = VisualizationQuery.bubble_chart(ingredient, metric)
        return count


@api.route("/single_recipe")
class SingleRecipe(Resource):

    @api.expect(single_recipe)
    def get(self):
        """
        given a recipe id, return important details for the individual chart section
        :return:
        """
        args = single_recipe.parse_args(request)
        recipe_id = args['recipe_id']
        return VisualizationQuery.get_recipe_info(recipe_id)


@api.route("/ingredient_list")
class IngredientList(Resource):

    def get(self):
        """
        get list of all ingredients in dataset in json formatted ingredients
        :return: json ingredients with list of ingredients
        """
        return VisualizationQuery.get_list_of_ingredients()


# @api.route("/question_img_parser")
# class QuestionImageParser(Resource):
#
#     @api.expect(full_phrase)
#     def get(self):
#         """
#         given a phrase return the links to the image urls
#         """
#         args = full_phrase.parse_args(request)
#         n = args.get('ngram')
#         phrase = args.get('phrase')
#         local = args.get('local')
#         resp = phrase_split(phrase)
#         entities = parse(resp[1], n)
#         urls = list()
#         log = Logs(phrase=phrase, is_list=question_classifier(phrase), question_phrase=resp[0], list_phrase=resp[1])
#         for entity in entities:
#
#
#             url = get_image(entity)
#             print(local)
#             if local:
#                 url = url.replace("https://storage.googleapis.com/livox-images/full/", "")
#                 url = url.replace(".png", "")
#                 #test
#             log.entities.append(Entity(log.log_id, url, entity))
#             # print(entity)
#             # print(get_image(entity))
#             urls.append({'entity': entity, 'url': url})
#         print(log.entities)
#         urls = json.dumps(urls)
#         urls = json.loads(urls)
#         log.add()
#         return urls



if __name__ == '__main__':
    application.run()
