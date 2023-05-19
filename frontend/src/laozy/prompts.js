import React, { useEffect } from 'react'
import { useState } from 'react'
import { ListAndEditView } from './list_edit_view';

import {
    message,
    Form,
    Input,
    Button,
    Select
} from 'antd'

const { TextArea } = Input;

export const PromptTemplateListAndEditView = () => {
    const loadPrompts = (setState) => {
        fetch('/api/prompts').then(r => r.json()).then(data => setState(data));
    }

    const deleteItem = (i) => {
        return fetch(`/api/prompts/${i.id}`, {method: 'DELETE'});
    }

    let parent = ListAndEditView({
        'load': loadPrompts,
        'delete': deleteItem,
        'editor': PromptTemplateEditor
    });
    return parent;
}

const PromptTemplateEditor = (props) => {
    const [template, setTemplate] = useState(props.instance);
    const [prompts, setPrompts] = useState([]);
    const [msg, messagePlaceholder] = message.useMessage();

    const openMessage = (t, m) => {
        msg.open({
            type: t,
            content: m,
        });
    }

    const initPrompts = () => {
        try {
            let t = [];
            let p = JSON.parse(template.template).prompts;
            for (let i = 0; i < p.length; i++) {
                t.push(p[i]);
            }
            setPrompts(t);
        } catch (e) {
            //console.error(e);
        }
    }

    const addPrompt = () => {
        prompts.push({
            role: 'system',
            template: ''
        });

        setPrompts([...prompts]);
    }

    const deletePrompt = (i) => {
        delete prompts[i];
        setPrompts([...prompts]);
    }

    const onRoleChange = (k, v) => {
        prompts[k].role = v;
    }

    const onPromptTemplateChange = (k, v) => {
        prompts[k].template = v;
    }

    const update = (values) => {
        let id = template.id;

        let prompts_values = [];
        for (let i = 0; i < prompts.length; i++) {
            let p = prompts[i];
            if (!p) continue;

            prompts_values.push(p);
        }

        let t = {
            name: values.name,
            template: JSON.stringify({
                prompts: prompts_values
            }),
        }

        let url = '/api/prompts';
        if (id) {
            url = url + '/' + id;
        }
        let method = id ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(t)
        }).then(r => {
            if (r.status >= 200 && r.status < 400) {
                openMessage('success', 'Success.');
                return r.json();
            } else {
                openMessage('error', 'Error.');
            }
        }).then((data) => {
            setTemplate(data);
        }).catch((e) => {
            openMessage('error', 'Error: ' + e);
        });
    }

    useEffect(() => {
        initPrompts();
    }, []);

    return (
        <div>
            {messagePlaceholder}
            <Form
                onFinish={update}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: "Name is required."
                        },
                    ]}
                    initialValue={template.name}
                    style={{ width: '500px' }}
                >
                    <Input />
                </Form.Item>
                <div className='card'>
                    <div className='card-header'>
                        Prompts
                        <Button size='small' className='ms-3' onClick={addPrompt}><i className="fa-solid fa-plus"></i></Button>
                    </div>
                    <div className='card-body'>
                        {Object.keys(prompts).map((v, k) => prompts[k] ? (
                            <div className='card p-3 mb-3 bg-light border-0' key={k}>
                                <div className='d-flex flex-row'>
                                    <Select
                                        onChange={(e) => onRoleChange(k, e)}
                                        defaultValue={prompts[k].role}
                                        options={[
                                            {
                                                label: 'System',
                                                value: 'system'
                                            },
                                            {
                                                label: 'Human',
                                                value: 'human'
                                            },
                                            {
                                                label: 'AI',
                                                value: 'ai'
                                            },
                                            {
                                                label: 'History',
                                                value: 'history'
                                            },
                                            {
                                                label: 'Knowledges',
                                                value: 'knowlege'
                                            }
                                        ]}
                                        style={{ width: '150px' }}
                                        className='mb-2'
                                    />
                                    <Button size='small' className='ms-auto me-0' onClick={() => deletePrompt(k)}><i className="fa-solid fa-minus"></i></Button>
                                </div>
                                <Form.Item
                                    initialValue={prompts[k].template}
                                    name={'prompt_' + k}
                                    rules={[
                                        {
                                            required: false
                                        },
                                    ]}
                                    style={{}}
                                >
                                    <TextArea autoSize onChange={(e) => onPromptTemplateChange(k, e.target.value)} />
                                </Form.Item>
                            </div>
                        ) : null)}
                    </div>
                </div>
                <Button type='primary' htmlType='submit' className='mt-3'>Submit</Button>
            </Form>
        </div>
    );
}