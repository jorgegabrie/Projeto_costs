import styles from './Home.module.css'
import saving from '../../img/savings.svg'
import LinkButton from '../layout/LinkButton'


function Home (){
    return(
        <section className={styles.home_container}>
            <h1>Bem-Vindo ao <span>Costs</span></h1>
            <p>Comece a gerenciar os seus projetos</p>
            <LinkButton to='/newproject' text="Criar projeto"/>
            <img src={saving} alt="costs" />
        </section>
    )
}

export default Home