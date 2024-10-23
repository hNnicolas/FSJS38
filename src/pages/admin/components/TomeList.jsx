import { Link } from "react-router-dom"
import { config } from '../../../config'

const TomeList = ({ tomes, onClickDeleteTome }) => {
  return (
    <div className="table-container">
      <table id="tableTome">
        <thead>
          <tr>
            <th>Image</th>
            <th>Nom</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tomes.length > 0 ? (
            tomes.map((tome) => {
              const imageUrl = `${config.api_url}/images/${tome.picture}`
    
              return (
                <tr key={tome.id}>
                  <td data-label="Image">
                    <img
                      src={imageUrl}
                      alt={tome.name}
                      style={{ width: "100px", height: "auto" }}
                    />
                  </td>
                  <td data-label="Nom">{tome.name}</td>
                  <td data-label="Action">
                    <Link to={`/editTome/${tome.id}`} className="edit-btn">Modifier</Link>
                    <button
                      className="delete-btn"
                      onClick={() => onClickDeleteTome(tome.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              )
            })
          ) : (
            <tr>
              <td colSpan="3">Aucun tome disponible</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default TomeList
