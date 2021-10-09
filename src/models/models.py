from tortoise import models, fields
from tortoise import Tortoise


class BasicClass(models.Model):
    name = fields.CharField(max_length=100, unique=True, null=True)

    class Meta:
        abstract = True
        ordering = ['name']

    def __str__(self):
        return self.name


class Dataset(BasicClass):
    rating = fields.IntField(null=True)
    coast = fields.IntField(null=True)
    combine_key: fields.ManyToManyRelation[
        "CombineKey"
    ] = fields.ManyToManyField(
        'models.CombineKey',
        related_name='dataset',
        through='dataset_c_keys',
        null=True,
    )
    owner: fields.ForeignKeyRelation["Owner"] = fields.ForeignKeyField(
        'models.Owner',
        null=False,
        related_name='owner'
    )


class CombineKey(BasicClass):
    dataset: fields.ManyToManyRelation[Dataset]


class Owner(BasicClass):
    pass


Tortoise.init_models(["src.models.models"], "models")

adapter_dict = {
    'dataset': Dataset,
    'combine_key': CombineKey,
    'owner': Owner,
}
