const date = require(process.env.FOOD_HOME + 'helper/date.js');

module.exports = (meal) =>
`<div style="padding:10px 20px; border:solid 1px; max-width: 700px; margin:10px 20px;">
  <div style="border-bottom: solid 1px; margin-bottom: 10px;">
    <a style="text-decoration: none; font-size: 1.7em;" href="https://${process.env.FOOD_EXTERNAL}">${meal.name}</a>
  </div>
  <div style="display:flex;">
    ${
      meal.image
      ? `<div style="width:150px;max-height:150px;display:flex;justify-content:center;align-items:center;margin-right:20px;${meal.image ? '' : 'display:none;'}">
        <img style="max-width:100%;max-height:100%;" src="https://${process.env.FOOD_EXTERNAL}${meal.image}" alt="" />
      </div>`
      : ''
    }
    <div style="align-self: flex-start; white-space: nowrap;">
        <p>Organisator: ${meal.creator}</p>
        <p>Teilnehmergrenze: ${meal.signupLimit ? meal.signupLimit : 'keine'}</p>
        <p>Anmeldeschluss: ${date.formatDateTime(meal.deadline)}</p>
        <p>Lieferzeitpunkt: ${date.formatDateTime(meal.time)}</p>
    </div>
    ${
      meal.description
      ? `<div style="flex-shrink:1;margin-left:10px;">
        <h4>Beschreibung:</h4>
        <p>${meal.description}</p>
      </div>`
      : ''
    }
  </div>
</div>`;