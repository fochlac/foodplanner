const date = require(process.env.FOOD_HOME + 'helper/date.js')
// prettier-ignore
module.exports = (meal, instanceUrl) =>
`<style>td {padding: 5px;}</style>
<table style="border: solid 1px black;">
  <thead>
    <tr>
      <th colspan="${3 - +!meal.image - +!meal.description.length}" style="border-bottom: solid 1px black;padding:5px 10px;margin-bottom: 5px; text-align: left">
        <a style="text-decoration: none; font-size: 1.7em;" href="${instanceUrl}">${meal.name}</a>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      ${
        meal.image
        ? `<td style="width:160px;">
            <div style="width:150px;max-height:150px;display:flex;justify-content:center;align-items:center;margin-right:20px;${meal.image ? '' : 'display:none;'}">
              <img style="max-width:100%;max-height:100%;" src="${instanceUrl}${meal.image}" alt="" />
            </div>
          </td>`
        : ''
      }
      <td style="width: 300px; vertical-align: top;">
          <p>Organisator: ${meal.creator}</p>
          <p>Teilnehmergrenze: ${meal.signupLimit ? meal.signupLimit : 'keine'}</p>
          ${meal.datefinder ? `<p>Anmeldeschluss: ${date.formatDateTime(meal.deadline)}</p>
          <p>Lieferzeitpunkt: ${date.formatDateTime(meal.time)}</p>` : ''}
      </td>
      ${
        meal.description.length
        ? `<td style="width: 300px; vertical-align: top;">
          <h4>Beschreibung:</h4>
          <p>${meal.description}</p>
        </td>`
        : ''
      }
    </tr>
  </tbody>
</table>`;
