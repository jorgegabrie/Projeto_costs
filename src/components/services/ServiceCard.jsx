import styles from '../project/ProjectCard.module.css'

import {BsFillTrashFill} from 'react-icons/Bs'

function ServiceCard({id, name, costs, Description, handleRemove}){

    const remove = (e) =>{
        e.preventDefault()
        handleRemove(id, costs)
    }

    return (
        <div className={styles.project_card}>
            <h4>{name}</h4>
            <p>
                <span>Custo total:</span> R${costs}
            </p>
            <p>{Description}</p>
            <div className={styles.project_card_action}>
                <button onClick={remove}>
                    <BsFillTrashFill/>
                    Excluir
                </button>
            </div>
        </div>
    )
}


export default ServiceCard