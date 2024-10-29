import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .data_gen import data  # Import your data generation class
from .inference import Inferer
data_instance = data()
inferer = Inferer(data_instance)

@csrf_exempt
def get_inference(request):
    prediction = inferer.predict()
    tensor_values = prediction.tolist()

    json_data = json.dumps({"left_value": tensor_values[0][0], "right_value": tensor_values[0][1]})
    #json_data = json.dumps(tensor_values)
    return JsonResponse(json_data, safe = False)

@csrf_exempt
def get_live_data(request):
    generated_data = data_instance.get_data()
    return JsonResponse(generated_data.to_dict(orient='records'), safe=False)

