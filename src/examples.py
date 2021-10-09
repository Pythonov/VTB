_std_query = """
    {search(input: { type: DATASET, query: "*", start: 0, count: 10 }) {
      start
      count
      total
      searchResults {
        entity {
           urn
           type
           ...on Dataset {
              name
                schema {
                fields{
                  fieldPath
                  nullable
                  description
                  nativeDataType
                }
              }
           }
        
        }
      }
    }
    }
  """

_std_url = r'http://localhost:8080/api/graphql'

GET_DATASETS_EXAMPLE = {
    'query': _std_query,
    'settings': {
        'url': _std_url
    }
}

CREATE_C_KEY = {
    "target_class": "combine_key",
    "data": {
        "combine_key_id": {"name": "Cats"}
    }
}

CREATE_DATASET = {
    "target_class": "dataset",
    "data": {
        "dataset_id": {"name": "TestDataset", "owner_id": "1"}
    }
}

COMBINE_DATASET = {
    "target_class": "dataset",
    "data": {
        "dataset_id": {"name": "TestDataset", "owner_id": "1"},
        "combine_key": [
          {
            "name": "Cats"
          }
        ]
    }
}

GET_ALL_DATASETS = {
  "target_class": "dataset",
  "data": {}
}
