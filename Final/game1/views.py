from django.http import JsonResponse
from .models import Leaderboard
from django.views.decorators.http import require_http_methods
from django.core.exceptions import ObjectDoesNotExist
import json

@require_http_methods(["GET"])
def get_leaderboard(request):
    top_scores = Leaderboard.objects.order_by('-score')[:10]
    data = list(top_scores.values('username', 'score'))
    return JsonResponse(data, safe=False)

@require_http_methods(["POST"])
def update_score(request):
    try:
        data = json.loads(request.body)
        username = data['username']
        score = data['score']
        Leaderboard.objects.update_or_create(username=username, defaults={'score': score})
        return JsonResponse({"message": "Score updated successfully"}, status=200)
    except (KeyError, json.JSONDecodeError, ObjectDoesNotExist) as e:
        return JsonResponse({"error": str(e)}, status=400)
