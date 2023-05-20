import time
from typing import List, Union
from starlette.authentication import requires
from fastapi import Request, HTTPException
from pydantic import BaseModel

from .entry import entry
from ..db import knowledges
from ..knowledge import Knowlege, knowledge_base
from ..utils import uuid


@entry.get('/knowledges')
@requires(['authenticated'])
async def list_knowledges(request: Request):
    k = await knowledges.list_by_owner(request.user.userid)
    return k


class KnowledgeModel(BaseModel):
    name: str


@entry.post('/knowledges', status_code=201)
@requires(['authenticated'])
async def create(k: KnowledgeModel, request: Request):
    r = {
        'id': uuid(),
        'name': k.name,
        'owner': request.user.userid,
        'created_time': int(time.time())
    }
    await knowledges.create(**r)
    return r


@entry.put('/knowledges/{id}', status_code=201)
@requires(['authenticated'])
async def update(id: str, k: KnowledgeModel, request: Request):
    r = await knowledges.get(id)
    if not r:
        raise HTTPException(404, "Not found.")

    r2u = {
        'name': k.name
    }
    await knowledges.update(id, **r2u)
    r2u['id'] = r.id
    return r2u


@entry.delete('/knowledges/{id}', status_code=204)
@requires(['authenticated'])
async def delete(id: str, request: Request):
    await knowledges.delete(id)


@entry.post('/knowledges/{knowledge_id}', status_code=201)
@requires(['authenticated'])
async def save_knowledge_item(knowledge_id: str, kl: List[Knowlege], request: Request):
    for k in kl:
        await knowledge_base.save(collection=knowledge_id, k=k)


@entry.get('/knowledges/{knowledge_id}', status_code=200)
@requires(['authenticated'])
async def retrieve_knowledges(knowledge_id: str, content: Union[str, None] = None, request: Request = None):
    if not content:
        content = ''
    return await knowledge_base.retrieve(collection=knowledge_id, content=content, topk=50)

@entry.delete('/knowledges/{knowledge_id}/{item_id}', status_code=204)
@requires(['authenticated'])
async def delete_knowlege_item(knowledge_id: str, item_id:str, request: Request):
    await knowledge_base.delete(collection=knowledge_id, id=item_id)
