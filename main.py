from fastapi import FastAPI
from fastapi import Body
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel, validator, ValidationError

from tortoise.contrib.fastapi import register_tortoise
from tortoise.contrib.pydantic import pydantic_model_creator
from tortoise.query_utils import Q

import requests
import uvicorn

from src.examples import *
from src.models.models import *


# Initial config
app = FastAPI(title='VTB APP', description='VTB DATA MARKET')

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_tortoise(
    app,
    db_url='sqlite://db.sqlite3',
    modules={'models': ['src.models.models']},
    generate_schemas=True,
    add_exception_handlers=True,
)


class Item(BaseModel):
    query: dict
    settings: dict


class ObjItem(BaseModel):
    target_class: str
    data: dict

    @validator('target_class', allow_reuse=True)
    def target_class_validator(cls, v):
        if v not in list(adapter_dict.keys()):
            raise ValidationError
        return v


@app.post('/get_datasets')
async def get_datasets(item: Item = Body(
    ...,
    example=GET_DATASETS_EXAMPLE,
)):
    query = item.query
    query_str = query.get('query', "*")
    if len(query_str) == 1:
        query_str = "*"
    start_num = query.get('start', 0)
    count_num = query.get('count', 5)
    fields_ = ' '.join(query.get('fields', ['fieldPath']))
    settings = item.settings
    status = 'Not ok'
    error_data = {}
    url = settings.get('url', r'http://localhost:8080/api/graphql')
    r = 500

    big_query_to_send = f"""
    {{search(input: {{ type: DATASET, query: \"{query_str}\", start: {start_num}, count: {count_num} }}) {{
      start
      count
      total
      searchResults {{
        entity {{
           urn
           type
           ...on Dataset {{
              name
                schema {{
                fields{{
                    {fields_}
                }}
              }}
           }}
        }}
      }}
    }}
    }}
  """

    try:
        r = requests.post(url, json={'query': big_query_to_send})
        status = 'Ok'
    except Exception as e:
        error_data['req_error'] = str(e)

    return {
        'status': status,
        'answer': r.json(),
        'error_report': error_data,
    }


@app.post('/create_depend')
async def create_depend(item: ObjItem = Body(
    ...,
    examples={
        "create_dependencies": {
            "description": "Create dependencies",
            "value": COMBINE_DATASET
        },
        "create_dataset": {
            "description": "Create dataset",
            "value": CREATE_DATASET
        },
        "create_owner": {
            "description": "Create owner",
            "value": CREATE_OWNER
        },

    }
)):
    target_class = item.target_class
    data = item.data
    errors_list = []
    counter_succ = num_of_objects = 0
    status = 'error at the beginning'
    objects_to_tie = []
    params = data[f'{target_class}_id']
    alias_dict = {
        'dataset': 'dataset',
        'combine_key': 'combine_key',
        "owner": 'owner',
    }

    async def create_if_not_exist(target, parameters):
        obj_pyd = pydantic_model_creator(
            adapter_dict[target],
            name=target + 'In',
            exclude_readonly=True
        )
        obj_orm = obj_pyd.parse_obj(parameters)
        await adapter_dict[target].create(**obj_orm.dict())
        output_obj = await adapter_dict[target].get(**parameters)
        return output_obj

    """
    Получение/создание дейст. в-ва
    """
    try:
        target_obj = await adapter_dict[target_class].get(Q(**params))
    except:
        target_obj = await create_if_not_exist(target_class, params)

    parameters = data.copy()
    parameters.pop(f'{target_class}_id')

    try:
        for k, v in parameters.items():
            for obj in v:
                num_of_objects += 1
                try:
                    await adapter_dict[k].get(Q(**obj))
                except Exception:
                    await create_if_not_exist(k, obj)

                try:
                    objects_to_tie.append(
                        await adapter_dict[k].get(Q(**obj))
                    )
                except Exception as e:
                    errors_list.append(f'{str(e)} in {obj}')

            counter_succ += len(objects_to_tie)
            f = getattr(target_obj, alias_dict[k])
            await f.add(*objects_to_tie)
            objects_to_tie = []

        status = 'not ok' if errors_list else 'ok'
        return {"status": status,
                "data": f"successfully combined {counter_succ}/{num_of_objects}",
                "errors": errors_list
                }
    except Exception as e:
        return {"status": status, "data": f"{str(e)} while adding preprocessed objects"}


@app.post('/get_obj')
async def get_obj(item: ObjItem = Body(
    ...,
    example=GET_ALL_DATASETS
)):
    target_class = item.target_class
    obj_pyd = pydantic_model_creator(
        adapter_dict[target_class],
        name=target_class,
    )
    response = await obj_pyd.from_queryset(adapter_dict[target_class].all())
    num_of_items = len(response)
    return {"status": "Ok", "data": response, "num_of_items": num_of_items}


@app.post('/get_combined')
async def get_combined(item: ObjItem = Body(
    ...,
    example=GET_ALL_DATASETS
)):
    target_class = item.target_class
    data = item.data
    count = data.get('count', 1)
    data.pop('count')

    obj_pyd = pydantic_model_creator(
        adapter_dict[target_class],
        name=target_class,
    )



    response = await obj_pyd.from_queryset(adapter_dict[target_class].get(Q(**data)))
    num_of_items = len(response)
    return {"status": "Ok", "data": response[:count], "num_of_items": num_of_items}


@app.post('/get_single', name="Получить один объект")
async def get_single(item: ObjItem = Body(
    ...,
    examples={
        "get_single_obj": {
            "description": "Get single obj",
            "value": {
              "target_class": "owner",
              "data": {
                "name": "Egitch"
              }
            }
        }
    }
)):
    target_class = item.target_class
    data = item.data
    try:
        obj_pyd = pydantic_model_creator(
            adapter_dict[target_class],
            name=target_class,
        )
        response = (
            await obj_pyd.from_queryset_single(
                adapter_dict[target_class].get(**data)))
    except Exception as e:
        return {"status": "not ok", "data": str(e)}
    return {"status": "Ok", "data": response}


if __name__ == '__main__':
    uvicorn.run(app, port=7070)
