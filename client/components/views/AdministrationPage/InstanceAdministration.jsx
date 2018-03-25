import React from 'react'

import InfoBubble from 'UI/InfoBubble/InfoBubble.jsx'
import AddressBlock from 'UI/AddressBlock/AddressBlock.jsx'
import InputRow from 'UI/InputRow/InputRow.jsx'

const wording = {
  submit: 'Abschicken',
  address: 'Addresse',
  name: 'Name',
  company: 'Firma',
  nameInfo:
    'Bit\u00ADte geb\u00ADen Sie min\u00ADdes\u00ADtens 2 Zei\u00ADchen ein. Buch\u00ADsta\u00ADben, Zahl\u00ADen, Binde\u00ADstrich und Leer\u00ADzei\u00ADchen sind er\u00ADlaubt.',
}

export const userInterface = {
  name: /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,100}$/,
  company: /^[ÄÜÖäöüA-Za-z0-9.\-,\s\_]{0,100}$/,
}

export default class InstanceAdministration extends React.Component {
  render() {
    const { saveInstanceData, instance } = this.props
    const { address, name, company } = instance
    const nameLabel = [
      wording.name,
      <InfoBubble style={{ bottom: '28px', left: '-60px', width: '160px' }} symbol="fa-asterisk required" arrow="top" key="infobubble">
        {wording.nameInfo}
      </InfoBubble>
    ]
    let defaultAddress = {}

    try {
      defaultAddress = JSON.parse(address) 
    }
    catch(err) {}

    return (
      <div className="colRowGrid">
        <div className="row justifyCenter">
          <div className="col basis300">
            <h4>{wording.address}</h4>
            <InputRow defaultValue={name} label={nameLabel} required={false} autoComplete="name" userInterface={userInterface.name} onBlur={(name, isValid) => isValid && saveInstanceData(instance.id, { name })} />
            <InputRow defaultValue={company} label={wording.company} required={false} autoComplete="company" userInterface={userInterface.company} onBlur={(company, isValid) => isValid && saveInstanceData(instance.id, { company })} />
            <div>
              <AddressBlock onBlur={(address, isValid) => isValid && saveInstanceData(instance.id, { address: JSON.stringify(address) })} value={defaultAddress} required={false} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
