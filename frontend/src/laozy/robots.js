import React, { useEffect } from 'react'
import { useState } from 'react'

import {
    message,
    Form,
    Input,
    Button,
    Select
} from 'antd'

import { ListAndEditView } from './list_edit_view';

const { TextArea } = Input;

export const RobotListAndEditView = () => {
    const loadRobots = (setState) => {
        fetch('/api/robots').then(r => r.json()).then(data => setState(data));
    }

    const deleteItem = (i) => {
        return fetch(`/api/robots/${i.id}`, {method: 'DELETE'});
    }

    let parent = ListAndEditView({
        'load': loadRobots,
        'delete': deleteItem,
        'editor': RobotEditor,
    });
    return parent;
}

const RobotEditor = (props) => {
    const [instance, setInstance] = useState(props.instance);
    const [variables, setVariables] = useState(instance.variables ? JSON.parse(instance.variables):[]);
    const [msg, messagePlaceholder] = message.useMessage();
    const [templteSelectOptions, setTemplateSelectOptions] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState({});

    const openMessage = (t, m) => {
        msg.open({
            type: t,
            content: m,
        });
    }

    const loadTemplates = () => {
        fetch("/api/prompts").then(r => r.json()).then(templates => {
            let options = [];
            for (let i = 0; i < templates.length; i++) {
                options.push({
                    label: templates[i].name,
                    value: templates[i].id
                });
            }
            setTemplateSelectOptions(options);
        });
    }

    const templateSelected = (rid) => {
        fetch(`/api/prompts/${rid}`).then(r => r.json()).then(data => {
            data.variables = JSON.parse(data.variables);
            setSelectedTemplate(data);
        });
    }

    const update = (values) => {
        let url = '/api/robots';
        let method = 'POST';
        let id = instance.id;
        if (id) {
            url += '/' + id;
            method = 'PUT';
        }

        let vars = {}
        for (let k in values) {
            if (k != 'name' && k != 'prompt_template_id' && k != 'implement' && values[k]) {
                vars[k] = values[k];
            }
        }

        let body = {
            name: values['name'],
            implement: values['implement'],
            prompt_template_id: values['prompt_template_id'],
            variables: JSON.stringify(vars)
        }
        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }).then(r => {
            if (r.status >= 200 && r.status <= 400) {
                openMessage('success', 'Success.');
                return r.json();
            } else {
                openMessage('error', 'Error.')
            }
        }).then(data => {
            if (data.variables) {
                data.variables = data.variables
            }
            setInstance(data)
        })
        .catch(e => openMessage('error', 'Error: ' + e));
    }

    useEffect(() => {
        loadTemplates();
        if (instance.prompt_template_id) {
            templateSelected(instance.prompt_template_id);
        }
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
                    initialValue={instance.name}
                    style={{ width: '500px' }}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Implement"
                    name="implement"
                    rules={[
                        {
                            required: true,
                            message: "Implement is required."
                        },
                    ]}
                    initialValue='openai'
                    style={{ width: '500px' }}
                >
                    <Select
                        options={[
                            {
                                label: 'OpenAI/GPT-3.5',
                                value: 'openai'
                            }
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    label="Prompt Template"
                    name="prompt_template_id"
                    rules={[
                        {
                            required: true,
                            message: "Prompt template is required."
                        },
                    ]}
                    initialValue={instance.prompt_template_id}
                    style={{ width: '500px' }}
                >
                    <Select
                        placeholder="Select a prompt template"
                        options={templteSelectOptions}
                        onChange={templateSelected}
                    />
                </Form.Item>
                {selectedTemplate.variables && selectedTemplate.variables.map((v, i) => (
                    <Form.Item
                        key={i}
                        label={v}
                        name={v}

                        initialValue={variables[v]}

                        rules={[
                            {
                                required: true,
                                message: "Required."
                            },
                        ]}
                    >
                        <TextArea autoSize />
                    </Form.Item>
                ))}

                <Button type='primary' htmlType='submit' className='mt-3'>Submit</Button>
            </Form>
        </div>
    );
}