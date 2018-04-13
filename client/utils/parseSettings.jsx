import JSONForm, { FormConnector } from 'CONNECTED/JSONForm'

import InputRow from 'RAW/InputRow'
import React from 'react'

const ConnectedInputRow = FormConnector(InputRow)
const ConnectedSubmit = FormConnector(({ submit }) => <button onClick={submit}>Abschicken</button>)

const parseContent = content => content.map(parseElement)

const parseElement = ({ type, ...options }, index) => {
  switch (type) {
    case 'form':
      return (
        <JSONForm {...options} key={index}>
          {parseContent(options.content)}
        </JSONForm>
      )
    case 'map':
      return <ul key={index}>{getData(data, options.key).map(data => <li>{parseContent(options.content)}</li>)}</ul>
    case 'flexCol':
      return (
        <div key={index} className="col width50">
          {parseContent(options.content)}
        </div>
      )
    case 'col':
      return (
        <div key={index} className="col">
          {parseContent(options.content)}
        </div>
      )
    // case 'editToggle':
    //   const edit = {
    //     content: options.edit,
    //     method: options.method,
    //     url: options.url,
    //   }
    //   return <Toggle key={index} icon="fa-pencil" default={parseContent(options.content)} alt={<Form {...edit} />} />
    case 'text':
      return <div key={index}>{getData(data, options.key)}</div>

    case 'inputRow':
      return <ConnectedInputRow myKey={options.key} key2="test" />

    case 'submit':
      return <ConnectedSubmit />
  }
}

export const getData = (data, keys) => data && (Array.isArray(keys) ? keys.reduce((currentData, key) => currentData[key], data) : data[keys])

export const createContent = (data, content) => parseContent(content)
