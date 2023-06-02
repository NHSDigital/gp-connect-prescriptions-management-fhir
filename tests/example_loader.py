import os
import yaml
from datetime import datetime
import json

current_directory = os.path.dirname(os.path.realpath(__file__))


def load_example(path: str):
    with open(f"{current_directory}/../specification/components/examples/{path}") as f:
        if path.endswith("yml") or path.endswith("yaml"):
            return yaml.safe_load(f)
        else:
            return f.read().strip()


# To convert JSON string to JSON object
def load_example_json(path: str):
    yaml_obj = load_example(path)
    json_data = json.dumps(yaml_obj, cls=DateTimeEncoder)
    return json.loads(json_data)


# To format the datetime objects according to the desired format "YYYY-MM-DDTHH:00:00.000Z".
class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.strftime("%Y-%m-%dT%H:%M:%S.000Z")
        return super().default(obj)
