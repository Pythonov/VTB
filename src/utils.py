class QueryCreator:
    def __init__(self, query: str = "*",
                 fields: list = 'fieldPath',
                 start_num: int = 0,
                 count_num: int = 5):
        self.query = query
        self.fields = fields
        self.start_num = start_num
        self.count_num = count_num
